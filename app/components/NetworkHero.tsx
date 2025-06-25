'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer, RenderPass, EffectPass } from 'postprocessing';
import { BloomEffect } from 'postprocessing';

interface NetworkNode {
  position: THREE.Vector3;
  connections: NetworkConnection[];
  createdAt: number;
  mesh: THREE.Mesh;
  isRemoving: boolean;
  fadeStartTime?: number;
  isSpawning: boolean;
  spawnStartTime: number;
  spawnParticles?: THREE.Points;
}

interface NetworkConnection {
  from: NetworkNode;
  to: NetworkNode;
  line: THREE.Object3D;
  glowLine: THREE.Object3D;
  createdAt: number;
  opacity: number;
  isAnimating: boolean;
  animationProgress: number;
  leadingParticle?: THREE.Group;
}

// Constants
const COLORS = {
  background: '#0F1717',
  brightSand: '#FFD0B0',
  warmTan: '#D9B08C',
  fadedTurquoise: '#84C3B2',
  white: '#FFFFFF',
} as const;

const TIMING = {
  nodeCreationInterval: 600,
  connectionAttemptInterval: 150,
  spawnCoreDuration: 500,
  spawnParticleDuration: 800,
  nodeMaxAge: 25000,
  nodeFadeDuration: 12500,
} as const;

const LIMITS = {
  maxConnections: 160,
  maxNodes: 50,
  maxConnectionsPerNode: 8,
  particleCount: 60,
  burstParticleCount: 60,
} as const;

const SIZES = {
  nodeRadius: 0.2,
  tubeRadius: 0.024,
  glowTubeMultiplier: 4.0,
  particleSize: 0.02,
  burstParticleSize: 0.06,
} as const;

const NetworkHero = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const nodesRef = useRef<NetworkNode[]>([]);
  const connectionsRef = useRef<NetworkConnection[]>([]);
  const animationIdRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const trackingPointRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const composerRef = useRef<EffectComposer | null>(null);
  const contextLossHandlerRef = useRef<((event: Event) => void) | null>(null);
  const contextRestoreHandlerRef = useRef<(() => void) | null>(null);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Check if we have a valid renderer and context
    const hasValidRenderer =
      rendererRef.current &&
      !rendererRef.current.getContext().isContextLost() &&
      mountRef.current.contains(rendererRef.current.domElement);

    if (hasValidRenderer) {
      return;
    }

    // Clean up any existing renderer
    if (rendererRef.current) {
      if (rendererRef.current.domElement.parentNode) {
        rendererRef.current.domElement.parentNode.removeChild(
          rendererRef.current.domElement,
        );
      }
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.background);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      66.5,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 25;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    const containerWidth = mountRef.current.clientWidth;
    const containerHeight = mountRef.current.clientHeight;

    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Ensure container is empty before appending
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Handle WebGL context loss and restoration
    const handleContextLoss = (event: Event) => {
      event.preventDefault();
      console.log('WebGL context lost');
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = undefined;
      }
    };

    const handleContextRestore = () => {
      console.log('WebGL context restored');
      // Force re-initialization by triggering a re-render
      // The useEffect will detect the invalid renderer and reinitialize
    };

    // Store handlers in refs for cleanup
    contextLossHandlerRef.current = handleContextLoss;
    contextRestoreHandlerRef.current = handleContextRestore;

    renderer.domElement.addEventListener('webglcontextlost', handleContextLoss);
    renderer.domElement.addEventListener(
      'webglcontextrestored',
      handleContextRestore,
    );

    // Set up bloom post-processing
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    const renderPass = new RenderPass(scene, camera);

    const bloomEffect = new BloomEffect({
      intensity: 7.0,
      luminanceThreshold: 0.01,
      luminanceSmoothing: 0.95,
      height: 1024,
    });

    const effectPass = new EffectPass(camera, bloomEffect);

    composer.addPass(renderPass);
    composer.addPass(effectPass);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(COLORS.fadedTurquoise, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(COLORS.white, 0.6, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Material creation utilities
    const createNodeMaterial = () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(COLORS.fadedTurquoise),
        transparent: true,
        opacity: 0.9,
      });

    const createTubeMaterial = (color: string) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 1.0,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.8,
        roughness: 0.0,
        metalness: 0.1,
      });

    const createGlowTubeMaterial = (color: string) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.25,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.8,
        roughness: 0.0,
        metalness: 0.0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

    // Geometries
    const nodeGeometry = new THREE.SphereGeometry(SIZES.nodeRadius, 12, 12);

    // Helper functions
    const createNode = (position: THREE.Vector3): NetworkNode => {
      const nodeMesh = new THREE.Mesh(nodeGeometry, createNodeMaterial());
      nodeMesh.position.copy(position);
      nodeMesh.scale.setScalar(0);
      scene.add(nodeMesh);

      // Create spawn particle burst
      const burstGeometry = new THREE.BufferGeometry();
      const burstPositions = new Float32Array(LIMITS.burstParticleCount * 3);
      const burstVelocities = new Float32Array(LIMITS.burstParticleCount * 3);

      for (let i = 0; i < LIMITS.burstParticleCount; i++) {
        burstPositions[i * 3] = position.x;
        burstPositions[i * 3 + 1] = position.y;
        burstPositions[i * 3 + 2] = position.z;

        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const speed = 0.8 + Math.random() * 0.4;

        burstVelocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        burstVelocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
        burstVelocities[i * 3 + 2] = Math.cos(phi) * speed;
      }

      burstGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(burstPositions, 3),
      );
      burstGeometry.setAttribute(
        'velocity',
        new THREE.BufferAttribute(burstVelocities, 3),
      );

      const burstMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(COLORS.fadedTurquoise),
        size: SIZES.burstParticleSize,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      const spawnParticles = new THREE.Points(burstGeometry, burstMaterial);
      scene.add(spawnParticles);

      const now = Date.now();
      return {
        position: position.clone(),
        connections: [],
        createdAt: now,
        mesh: nodeMesh,
        isRemoving: false,
        isSpawning: true,
        spawnStartTime: now,
        spawnParticles: spawnParticles,
      };
    };

    const createConnection = (
      from: NetworkNode,
      to: NetworkNode,
    ): NetworkConnection => {
      const distance = from.position.distanceTo(to.position);
      const lineColor = distance < 4 ? COLORS.brightSand : COLORS.warmTan;

      const direction = new THREE.Vector3().subVectors(
        to.position,
        from.position,
      );
      const connectionLength = direction.length();

      // Create main connection tube
      const tubeSegments = Math.max(12, Math.floor(connectionLength * 6));
      const tubeGeometry = new THREE.CylinderGeometry(
        SIZES.tubeRadius,
        SIZES.tubeRadius,
        connectionLength,
        8,
        tubeSegments,
      );

      const tubeMaterial = createTubeMaterial(lineColor);
      const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);

      // Position and orient the tube
      const tubeDirection = direction.clone().normalize();
      const halfLength = connectionLength / 2;
      const tubeStartPosition = from.position
        .clone()
        .add(tubeDirection.clone().multiplyScalar(halfLength));

      tubeMesh.position.copy(tubeStartPosition);
      tubeMesh.lookAt(to.position);
      tubeMesh.rotateX(Math.PI / 2);
      tubeMesh.scale.set(1, 0, 1);
      scene.add(tubeMesh);

      // Create glow tube
      const glowTubeRadius = SIZES.tubeRadius * SIZES.glowTubeMultiplier;
      const glowTubeGeometry = new THREE.CylinderGeometry(
        glowTubeRadius,
        glowTubeRadius,
        connectionLength,
        8,
        tubeSegments,
      );

      const glowTubeMaterial = createGlowTubeMaterial(lineColor);
      const glowTubeMesh = new THREE.Mesh(glowTubeGeometry, glowTubeMaterial);

      glowTubeMesh.position.copy(tubeStartPosition);
      glowTubeMesh.lookAt(to.position);
      glowTubeMesh.rotateX(Math.PI / 2);
      glowTubeMesh.scale.set(1, 0, 1);
      scene.add(glowTubeMesh);

      const connection: NetworkConnection = {
        from,
        to,
        line: tubeMesh,
        glowLine: glowTubeMesh,
        createdAt: Date.now(),
        opacity: 0.8,
        isAnimating: true,
        animationProgress: 0,
      };

      from.connections.push(connection);
      to.connections.push(connection);

      return connection;
    };

    const startNodeRemoval = (node: NetworkNode) => {
      if (!node.isRemoving) {
        node.isRemoving = true;
        node.fadeStartTime = Date.now();
        // Connections will automatically fade as this node fades
      }
    };

    const removeNode = (node: NetworkNode) => {
      // Remove all connections
      const connectionsToRemove = [...node.connections];
      connectionsToRemove.forEach((connection) => {
        scene.remove(connection.line);
        scene.remove(connection.glowLine);

        // Dispose geometry and material for tube meshes
        if (connection.line instanceof THREE.Mesh) {
          connection.line.geometry.dispose();
          (connection.line.material as THREE.Material).dispose();
        }
        if (connection.glowLine instanceof THREE.Mesh) {
          connection.glowLine.geometry.dispose();
          (connection.glowLine.material as THREE.Material).dispose();
        }

        // Remove leading particle if it exists
        if (connection.leadingParticle) {
          scene.remove(connection.leadingParticle);
          // Dispose of all child particles
          connection.leadingParticle.children.forEach((child) => {
            if (child instanceof THREE.Points) {
              child.geometry.dispose();
              (child.material as THREE.PointsMaterial).dispose();
            }
          });
        }

        // Remove from both nodes' connection arrays
        connection.from.connections = connection.from.connections.filter(
          (c) => c !== connection,
        );
        connection.to.connections = connection.to.connections.filter(
          (c) => c !== connection,
        );

        // Remove from global connections array
        connectionsRef.current = connectionsRef.current.filter(
          (c) => c !== connection,
        );
      });

      // Remove node mesh
      scene.remove(node.mesh);
      node.mesh.geometry.dispose();
      (node.mesh.material as THREE.MeshBasicMaterial).dispose();

      // Remove spawn particles if they exist
      if (node.spawnParticles) {
        scene.remove(node.spawnParticles);
        node.spawnParticles.geometry.dispose();
        (node.spawnParticles.material as THREE.PointsMaterial).dispose();
      }

      // Remove from nodes array
      nodesRef.current = nodesRef.current.filter((n) => n !== node);
    };

    const getRandomPosition = (): THREE.Vector3 => {
      const viewportWidth = mountRef.current?.clientWidth || window.innerWidth;
      let horizontalBounds = Math.min(45, (viewportWidth / 1200) * 45);

      const viewportHeight = window.innerHeight;
      let verticalBounds = (viewportHeight / 1080) * 23.04;

      // Mobile/tablet adjustments
      if (viewportWidth < 768) {
        horizontalBounds *= 1.1;
        verticalBounds *= 1.6;
      }

      return new THREE.Vector3(
        (Math.random() - 0.5) * horizontalBounds,
        (Math.random() - 0.5) * verticalBounds,
        (Math.random() - 0.5) * 15,
      );
    };

    const findNearbyNodes = (
      position: THREE.Vector3,
      maxDistance: number = 7,
    ): NetworkNode[] => {
      return nodesRef.current.filter((node) => {
        const distance = position.distanceTo(node.position);
        return distance <= maxDistance && distance > 0;
      });
    };

    const shouldCreateConnection = (
      node1: NetworkNode,
      node2: NetworkNode,
    ): boolean => {
      // Don't create if already connected
      const alreadyConnected = node1.connections.some(
        (conn) => conn.from === node2 || conn.to === node2,
      );

      const hasRoomForConnection =
        node1.connections.length < LIMITS.maxConnectionsPerNode &&
        node2.connections.length < LIMITS.maxConnectionsPerNode;

      return !alreadyConnected && hasRoomForConnection;
    };

    // Particle system for visual effects
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(LIMITS.particleCount * 3);
    const particleVelocities = new Float32Array(LIMITS.particleCount * 3);

    for (let i = 0; i < LIMITS.particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3),
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(COLORS.fadedTurquoise),
      size: SIZES.particleSize,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation variables
    let lastNodeCreation = 0;
    let lastConnectionAttempt = 0;
    const resumeThreshold = 10;
    let isWaitingForEdgeReduction = false;

    // Animation loop
    const animate = () => {
      const currentTime = Date.now();

      // Check edge count and manage waiting state
      const currentEdgeCount = connectionsRef.current.length;

      // If we've hit max edges, start waiting
      if (
        currentEdgeCount >= LIMITS.maxConnections &&
        !isWaitingForEdgeReduction
      ) {
        isWaitingForEdgeReduction = true;
      }

      // If we're waiting and edges have reduced enough, resume
      if (
        isWaitingForEdgeReduction &&
        currentEdgeCount <= LIMITS.maxConnections - resumeThreshold
      ) {
        isWaitingForEdgeReduction = false;
      }

      // Create new nodes only if we're not waiting for edge reduction
      if (
        !isWaitingForEdgeReduction &&
        currentTime - lastNodeCreation > TIMING.nodeCreationInterval
      ) {
        const newPosition = getRandomPosition();
        const newNode = createNode(newPosition);
        nodesRef.current.push(newNode);
        lastNodeCreation = currentTime;

        // Try to connect to nearby nodes only if we have room for more connections
        if (currentEdgeCount < LIMITS.maxConnections) {
          const nearbyNodes = findNearbyNodes(newPosition);
          nearbyNodes.forEach((nearbyNode) => {
            // Don't connect to nodes that are fading out
            if (
              !nearbyNode.isRemoving &&
              shouldCreateConnection(newNode, nearbyNode) &&
              Math.random() < 0.7 &&
              connectionsRef.current.length < LIMITS.maxConnections
            ) {
              const connection = createConnection(newNode, nearbyNode);
              connectionsRef.current.push(connection);
            }
          });
        }
      }

      // Try to create additional connections between existing nodes only if we have room
      if (
        currentTime - lastConnectionAttempt >
          TIMING.connectionAttemptInterval &&
        nodesRef.current.length > 1 &&
        connectionsRef.current.length < LIMITS.maxConnections
      ) {
        const randomNode1 =
          nodesRef.current[Math.floor(Math.random() * nodesRef.current.length)];

        // Only connect if the source node is not fading
        if (!randomNode1.isRemoving) {
          const nearbyNodes = findNearbyNodes(randomNode1.position, 6);

          if (nearbyNodes.length > 0) {
            const randomNode2 =
              nearbyNodes[Math.floor(Math.random() * nearbyNodes.length)];
            // Don't connect to fading nodes
            if (
              !randomNode2.isRemoving &&
              shouldCreateConnection(randomNode1, randomNode2) &&
              Math.random() < 0.5
            ) {
              const connection = createConnection(randomNode1, randomNode2);
              connectionsRef.current.push(connection);
            }
          }
        }
        lastConnectionAttempt = currentTime;
      }

      // Animate connections being drawn using tube scaling
      connectionsRef.current.forEach((connection) => {
        if (connection.isAnimating && connection.animationProgress < 1) {
          connection.animationProgress += 0.015; // Animation speed

          // For tube meshes, animate the Y scale and position to grow from source to destination
          const tubeMesh = connection.line as THREE.Mesh;
          const glowTubeMesh = connection.glowLine as THREE.Mesh;

          // Calculate the current length and position offset
          const startPos = connection.from.position;
          const endPos = connection.to.position;
          const fullDirection = new THREE.Vector3().subVectors(
            endPos,
            startPos,
          );
          const fullLength = fullDirection.length();
          const normalizedDirection = fullDirection.clone().normalize();

          // Current length based on animation progress
          const currentLength = fullLength * connection.animationProgress;

          // Position the tube so it starts at source and grows toward destination
          const currentOffset = currentLength / 2; // Half of current length for center positioning
          const currentPosition = startPos
            .clone()
            .add(normalizedDirection.clone().multiplyScalar(currentOffset));

          // Update position and scale for both tubes
          tubeMesh.position.copy(currentPosition);
          tubeMesh.scale.setY(connection.animationProgress);

          glowTubeMesh.position.copy(currentPosition);
          glowTubeMesh.scale.setY(connection.animationProgress);

          // Create leading particle effect with size gradient
          if (!connection.leadingParticle) {
            // Create a group to hold multiple particle systems for size gradient
            const leadingParticleGroup = new THREE.Group();

            // Create 5 individual particles with decreasing sizes
            for (let i = 0; i < 5; i++) {
              const singleParticleGeometry = new THREE.BufferGeometry();
              const singleParticlePosition = new Float32Array([0, 0, 0]); // Single particle position
              singleParticleGeometry.setAttribute(
                'position',
                new THREE.BufferAttribute(singleParticlePosition, 3),
              );

              // Size gradient: larger at front (0.3), smaller at back (0.1)
              const particleSize = 0.3 - i * 0.05; // 0.3, 0.25, 0.2, 0.15, 0.1

              const singleParticleMaterial = new THREE.PointsMaterial({
                color: new THREE.Color('#D9B08C'), // Sand color to match edges
                size: particleSize,
                transparent: true,
                opacity: 0.8 - i * 0.1, // Also fade opacity slightly for trailing effect
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true,
              });

              const singleParticle = new THREE.Points(
                singleParticleGeometry,
                singleParticleMaterial,
              );
              leadingParticleGroup.add(singleParticle);
            }

            connection.leadingParticle = leadingParticleGroup;
            scene.add(connection.leadingParticle);
          }

          // Update leading particle trail along the tube
          if (connection.leadingParticle) {
            const startPos = connection.from.position;
            const endPos = connection.to.position;

            // Update each particle in the group
            for (
              let i = 0;
              i < connection.leadingParticle.children.length;
              i++
            ) {
              const particle = connection.leadingParticle.children[
                i
              ] as THREE.Points;
              const particleGeometry =
                particle.geometry as THREE.BufferGeometry;
              const positionAttribute = particleGeometry.attributes.position;
              const positions = positionAttribute.array as Float32Array;

              // Adjust spacing between particles back to original spacing for better visibility
              const trailProgress = Math.max(
                0,
                connection.animationProgress - i * 0.05,
              );
              const trailPos = startPos.clone().lerp(endPos, trailProgress);

              positions[0] = trailPos.x;
              positions[1] = trailPos.y;
              positions[2] = trailPos.z;

              positionAttribute.needsUpdate = true;
            }
          }

          if (connection.animationProgress >= 1) {
            connection.isAnimating = false;
            // Remove leading particle when animation is complete
            if (connection.leadingParticle) {
              scene.remove(connection.leadingParticle);
              // Dispose of all child particles
              connection.leadingParticle.children.forEach((child) => {
                const particle = child as THREE.Points;
                particle.geometry.dispose();
                (particle.material as THREE.PointsMaterial).dispose();
              });
              connection.leadingParticle = undefined;
            }
          }
        }
      });

      // Update node glow based on connection count with pulsing effect
      nodesRef.current.forEach((node) => {
        const connectionCount = node.connections.length;
        const glowIntensity = Math.min(
          connectionCount / LIMITS.maxConnectionsPerNode,
          1,
        );

        // Handle spawn animation with simple 0-100% scale
        let spawnScale = 1;
        if (node.isSpawning) {
          const spawnAge = currentTime - node.spawnStartTime;
          const totalDuration = Math.max(
            TIMING.spawnParticleDuration,
            TIMING.spawnCoreDuration,
          );

          if (spawnAge < totalDuration) {
            if (spawnAge < TIMING.spawnCoreDuration) {
              const easedT = Math.min(
                Math.pow(spawnAge / TIMING.spawnCoreDuration, 3),
                1,
              );
              spawnScale = easedT;
            }

            // Animate spawn particles
            if (node.spawnParticles) {
              const positions = node.spawnParticles.geometry.attributes.position
                .array as Float32Array;
              const velocities = node.spawnParticles.geometry.attributes
                .velocity.array as Float32Array;
              const material = node.spawnParticles
                .material as THREE.PointsMaterial;

              const newOpacity = Math.max(
                0,
                1 - spawnAge / TIMING.spawnParticleDuration,
              );
              material.opacity = newOpacity;

              if (newOpacity <= 0) {
                scene.remove(node.spawnParticles);
                node.spawnParticles.geometry.dispose();
                (
                  node.spawnParticles.material as THREE.PointsMaterial
                ).dispose();
                node.spawnParticles = undefined;
              } else {
                for (let i = 0; i < positions.length / 3; i++) {
                  positions[i * 3] += velocities[i * 3] * 0.005;
                  positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.005;
                  positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.005;
                }
                node.spawnParticles.geometry.attributes.position.needsUpdate =
                  true;
              }
            }
          } else {
            node.isSpawning = false;
            spawnScale = 1;

            if (node.spawnParticles) {
              scene.remove(node.spawnParticles);
              node.spawnParticles.geometry.dispose();
              (node.spawnParticles.material as THREE.PointsMaterial).dispose();
              node.spawnParticles = undefined;
            }
          }
        }

        // Add pulsing effect based on node creation time
        const baseTime = currentTime - node.createdAt;
        const pulseSpeed = 0.012;
        const pulse = (Math.sin(baseTime * pulseSpeed) + 1) / 2;

        // Check if node is fading out
        let nodeFadeMultiplier = 1;
        if (node.isRemoving && node.fadeStartTime) {
          const fadeAge = currentTime - node.fadeStartTime;
          const fadeProgress = Math.min(fadeAge / TIMING.nodeFadeDuration, 1);
          nodeFadeMultiplier = 1 - fadeProgress;
        }

        // Core node material opacity control with subtle brightness and pulse effects
        const nodeMaterial = node.mesh.material as THREE.MeshBasicMaterial;

        const brightnessMultiplier = 1 + glowIntensity * 0.08;
        const pulseMultiplier = 1 - pulse * 0.05;

        const finalOpacity =
          0.9 * nodeFadeMultiplier * brightnessMultiplier * pulseMultiplier;
        nodeMaterial.opacity = Math.min(finalOpacity, 1.0);

        // Update opacity of all connected edges based on this node's fade state
        node.connections.forEach((connection) => {
          const otherNode =
            connection.from === node ? connection.to : connection.from;
          let otherNodeFadeMultiplier = 1;
          if (otherNode.isRemoving && otherNode.fadeStartTime) {
            const otherFadeAge = currentTime - otherNode.fadeStartTime;
            const otherFadeProgress = Math.min(
              otherFadeAge / TIMING.nodeFadeDuration,
              1,
            );
            otherNodeFadeMultiplier = 1 - otherFadeProgress;
          }

          const connectionOpacity = Math.min(
            nodeFadeMultiplier,
            otherNodeFadeMultiplier,
          );

          const tubeMesh = connection.line as THREE.Mesh;
          const glowTubeMesh = connection.glowLine as THREE.Mesh;
          (tubeMesh.material as THREE.MeshBasicMaterial).opacity =
            0.8 * connectionOpacity;
          (glowTubeMesh.material as THREE.MeshBasicMaterial).opacity =
            0.15 * connectionOpacity;
        });

        node.mesh.scale.setScalar(spawnScale);
      });

      // Mid-life edge generation: at 1/3 of node lifetime, attempt additional connections
      nodesRef.current.forEach((node) => {
        if (
          !node.isRemoving &&
          connectionsRef.current.length < LIMITS.maxConnections
        ) {
          const age = currentTime - node.createdAt;
          const midLifePoint = TIMING.nodeMaxAge / 3;
          const connectionWindow = 2000;

          // Check if node is in its mid-life connection window
          if (age >= midLifePoint && age <= midLifePoint + connectionWindow) {
            const nearbyNodes = findNearbyNodes(node.position, 8);
            nearbyNodes.forEach((nearbyNode) => {
              if (
                !nearbyNode.isRemoving &&
                shouldCreateConnection(node, nearbyNode) &&
                Math.random() < 0.3 &&
                connectionsRef.current.length < LIMITS.maxConnections
              ) {
                const connection = createConnection(node, nearbyNode);
                connectionsRef.current.push(connection);
              }
            });
          }
        }
      });

      // Handle node fade-out and removal
      const nodeFadeStartAge = TIMING.nodeMaxAge / 2;

      // Start fading nodes that are old enough
      nodesRef.current.forEach((node) => {
        const age = currentTime - node.createdAt;
        if (age > nodeFadeStartAge && !node.isRemoving) {
          startNodeRemoval(node);
        }
      });

      // Check for nodes that need to start fading (old or excess nodes)
      const nodesToStartFading = nodesRef.current.filter((node, index) => {
        const age = currentTime - node.createdAt;
        const exceedsMaxCount =
          index < nodesRef.current.length - LIMITS.maxNodes;
        const shouldStartFading =
          !node.isRemoving && (age > TIMING.nodeMaxAge || exceedsMaxCount);
        return shouldStartFading;
      });

      nodesToStartFading.forEach((node) => {
        startNodeRemoval(node);
      });

      // Remove nodes that have fully completed their fade animation
      const nodesToRemove = nodesRef.current.filter((node) => {
        if (!node.isRemoving || !node.fadeStartTime) return false;
        const fadeAge = currentTime - node.fadeStartTime;
        return fadeAge > TIMING.nodeFadeDuration;
      });

      nodesToRemove.forEach((node) => {
        removeNode(node);
      });

      // Animate particles
      const positions = particles.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < LIMITS.particleCount; i++) {
        positions[i * 3] += particleVelocities[i * 3];
        positions[i * 3 + 1] += particleVelocities[i * 3 + 1];
        positions[i * 3 + 2] += particleVelocities[i * 3 + 2];

        // Wrap particles around the scene
        if (Math.abs(positions[i * 3]) > 20) particleVelocities[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 12)
          particleVelocities[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 10)
          particleVelocities[i * 3 + 2] *= -1;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Simplified camera movement with physics-based tracking point
      const time = currentTime * 0.0003 * 0.25;

      // Update tracking point physics
      const trackingPoint = trackingPointRef.current;
      const mouse = mouseRef.current;

      const dx = mouse.x - trackingPoint.x;
      const dy = mouse.y - trackingPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxAcceleration = 0.005;
      const acceleration = Math.min(maxAcceleration, distance * 0.008);

      if (distance > 0.01) {
        trackingPoint.vx += (dx / distance) * acceleration;
        trackingPoint.vy += (dy / distance) * acceleration;
      }

      const friction = 0.9;
      trackingPoint.vx *= friction;
      trackingPoint.vy *= friction;

      trackingPoint.x += trackingPoint.vx;
      trackingPoint.y += trackingPoint.vy;

      // Camera movement relative to tracking point
      const cameraInfluence = 5.0;
      const targetX = Math.sin(time) * 3 + -trackingPoint.x * cameraInfluence;
      const targetY =
        Math.cos(time * 0.8) * 2.5 + -trackingPoint.y * cameraInfluence;

      const lerpFactor = 0.03;
      camera.position.x += (targetX - camera.position.x) * lerpFactor;
      camera.position.y += (targetY - camera.position.y) * lerpFactor;
      camera.lookAt(0, 0, 0);

      // Render with bloom effect
      if (
        composerRef.current &&
        rendererRef.current &&
        sceneRef.current &&
        cameraRef.current &&
        !rendererRef.current.getContext().isContextLost()
      ) {
        try {
          composerRef.current.render();
        } catch (error) {
          console.warn(
            'Composer render failed, falling back to basic render:',
            error,
          );
          // Fallback to basic renderer if composer fails
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      } else if (
        rendererRef.current &&
        sceneRef.current &&
        cameraRef.current &&
        !rendererRef.current.getContext().isContextLost()
      ) {
        // Fallback render without composer
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      } else {
        // Log what's missing
        const missing: string[] = [];
        if (!composerRef.current) missing.push('composer');
        if (!rendererRef.current) missing.push('renderer');
        if (!sceneRef.current) missing.push('scene');
        if (!cameraRef.current) missing.push('camera');
        if (
          rendererRef.current &&
          rendererRef.current.getContext().isContextLost()
        )
          missing.push('context-lost');
        if (missing.length > 0) {
          console.warn(
            'NetworkHero: Cannot render, missing:',
            missing.join(', '),
          );
        }
      }
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    mountRef.current.addEventListener('mousemove', handleMouseMove);

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      const mountElement = mountRef.current;

      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
        initializationTimeoutRef.current = null;
      }

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = undefined;
      }

      window.removeEventListener('resize', handleResize);

      if (mountElement) {
        mountElement.removeEventListener('mousemove', handleMouseMove);
      }

      // Clean up Three.js objects
      if (composerRef.current) {
        composerRef.current.dispose();
        composerRef.current = null;
      }

      if (sceneRef.current) {
        scene.remove(particles);
        particles.geometry.dispose();
        (particles.material as THREE.PointsMaterial).dispose();

        nodesRef.current.forEach((node) => {
          scene.remove(node.mesh);
          node.mesh.geometry.dispose();
          (node.mesh.material as THREE.MeshBasicMaterial).dispose();

          if (node.spawnParticles) {
            scene.remove(node.spawnParticles);
            node.spawnParticles.geometry.dispose();
            (node.spawnParticles.material as THREE.PointsMaterial).dispose();
          }
        });

        connectionsRef.current.forEach((connection) => {
          scene.remove(connection.line);
          scene.remove(connection.glowLine);

          if (connection.line instanceof THREE.Mesh) {
            connection.line.geometry.dispose();
            (connection.line.material as THREE.Material).dispose();
          }
          if (connection.glowLine instanceof THREE.Mesh) {
            connection.glowLine.geometry.dispose();
            (connection.glowLine.material as THREE.Material).dispose();
          }

          if (connection.leadingParticle) {
            scene.remove(connection.leadingParticle);
            connection.leadingParticle.children.forEach((child) => {
              if (child instanceof THREE.Points) {
                child.geometry.dispose();
                (child.material as THREE.PointsMaterial).dispose();
              }
            });
          }
        });

        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }

        sceneRef.current = null;
      }

      nodesRef.current = [];
      connectionsRef.current = [];

      if (rendererRef.current) {
        const renderer = rendererRef.current;

        if (contextLossHandlerRef.current) {
          renderer.domElement.removeEventListener(
            'webglcontextlost',
            contextLossHandlerRef.current,
          );
        }
        if (contextRestoreHandlerRef.current) {
          renderer.domElement.removeEventListener(
            'webglcontextrestored',
            contextRestoreHandlerRef.current,
          );
        }

        const gl = renderer.getContext();
        if (gl && gl.getExtension('WEBGL_lose_context')) {
          gl.getExtension('WEBGL_lose_context')!.loseContext();
        }

        if (mountElement && renderer.domElement.parentNode === mountElement) {
          try {
            mountElement.removeChild(renderer.domElement);
          } catch (error) {
            console.warn('Error removing canvas element:', error);
          }
        }

        renderer.dispose();
        rendererRef.current = null;
      }

      cameraRef.current = null;
      contextLossHandlerRef.current = null;
      contextRestoreHandlerRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-screen h-[75vh] rounded-lg overflow-hidden bg-background-base mb-8 -mx-2 md:-mx-0 lg:-mx-4 left-1/2 -translate-x-1/2">
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{ minHeight: '75vh' }}
      />
      {/* Edge gradient overlay for subtle vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, var(--color-background-base) 0%, transparent 32px, transparent calc(100% - 32px), var(--color-background-base) 100%),
            linear-gradient(to bottom, var(--color-background-base) 0%, transparent 32px, transparent calc(100% - 32px), var(--color-background-base) 100%)
          `,
        }}
      />
    </div>
  );
};

export default NetworkHero;
