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
  line: THREE.Object3D; // Changed from THREE.Line to THREE.Object3D to support both lines and meshes
  glowLine: THREE.Object3D; // Changed from THREE.Line to THREE.Object3D
  createdAt: number;
  opacity: number;
  isAnimating: boolean;
  animationProgress: number;
  leadingParticle?: THREE.Group;
}

const NetworkHero = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const nodesRef = useRef<NetworkNode[]>([]);
  const connectionsRef = useRef<NetworkConnection[]>([]);
  const animationIdRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const trackingPointRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 }); // Invisible point with velocity
  const cameraTargetRef = useRef({ x: 0, y: 0 });
  const cameraPositionRef = useRef({ x: 0, y: 0 });
  const cameraSmoothedRef = useRef({ x: 0, y: 0 });
  const composerRef = useRef<EffectComposer | null>(null);
  const contextLossHandlerRef = useRef<((event: Event) => void) | null>(null);
  const contextRestoreHandlerRef = useRef<(() => void) | null>(null);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Check if we have a valid renderer and context
    const hasValidRenderer = rendererRef.current && 
                            !rendererRef.current.getContext().isContextLost() &&
                            mountRef.current.contains(rendererRef.current.domElement);
    
    if (hasValidRenderer) {
      return;
    }
    
    // Clean up any existing renderer
    if (rendererRef.current) {
      if (rendererRef.current.domElement.parentNode) {
        rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0F1717'); // --color-soft-charcoal
    sceneRef.current = scene;

    // Camera setup with reduced FOV to prevent edge warping
    const camera = new THREE.PerspectiveCamera(
      66.5, // Reduced FOV to 70% (95 * 0.7 = 66.5) to reduce edge warping
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 25; // Zoomed out to compensate for narrower FOV
    cameraRef.current = camera;

    // Renderer setup with enhanced settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    const containerWidth = mountRef.current.clientWidth;
    const containerHeight = mountRef.current.clientHeight;
    
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Enable post-processing for blur effects
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
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestore);

    // Set up bloom post-processing with BloomEffect
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    const renderPass = new RenderPass(scene, camera);
    
    const bloomEffect = new BloomEffect({
      intensity: 7.0, // Further increased for stronger bloom on cylinders
      luminanceThreshold: 0.01, // Even lower threshold to catch more emissive material
      luminanceSmoothing: 0.95, // Very smooth transitions
      height: 1024 // Higher resolution for crisp bloom
    });
    
    const effectPass = new EffectPass(camera, bloomEffect);
    
    composer.addPass(renderPass);
    composer.addPass(effectPass);

    // Colors from your palette
    const brightSand = new THREE.Color('#FFD0B0'); // --color-bright-sand
    const warmTan = new THREE.Color('#D9B08C'); // --color-warm-tan
    const fadedTurquoise = new THREE.Color('#84C3B2'); // --color-faded-turquoise

    // Add ambient lighting for depth
    const ambientLight = new THREE.AmbientLight(fadedTurquoise, 0.4);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(new THREE.Color('#FFFFFF'), 0.6, 50); // Changed to neutral white
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Single node material with high bloom - turquoise colored (using MeshBasicMaterial to avoid lighting issues)
    const nodeMaterial = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color('#84C3B2'), // Turquoise color
      transparent: true,
      opacity: 0.9
    });

    // Enhanced line material with increased thickness (1.6x more from current)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: warmTan,
      transparent: true,
      opacity: 0.8,
      linewidth: 6.4 // Increased 1.6x from 4 to 6.4
    });

    const lineGlowMaterial = new THREE.LineBasicMaterial({
      color: fadedTurquoise,
      transparent: true,
      opacity: 0.3,
      linewidth: 19.2, // Increased 1.6x from 12 to 19.2
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    // Single node geometry - reduced to 80% size
    const nodeGeometry = new THREE.SphereGeometry(0.2, 12, 12); // Reduced from 0.25 to 0.2 (80%)

    // Helper functions
    const createNode = (position: THREE.Vector3): NetworkNode => {
      // Create single node mesh with high bloom material
      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      
      nodeMesh.position.copy(position);
      
      // Start node at zero scale for spawn animation
      nodeMesh.scale.setScalar(0);
      
      scene.add(nodeMesh);

      // Create spawn particle burst (5x more particles in a sphere)
      const burstParticleCount = 60; // Increased from 12 to 60 (5x)
      const burstGeometry = new THREE.BufferGeometry();
      const burstPositions = new Float32Array(burstParticleCount * 3);
      const burstVelocities = new Float32Array(burstParticleCount * 3);
      
      // Initialize particles at the node position with spherical distribution
      for (let i = 0; i < burstParticleCount; i++) {
        burstPositions[i * 3] = position.x;
        burstPositions[i * 3 + 1] = position.y;
        burstPositions[i * 3 + 2] = position.z;
        
        // Spherical distribution instead of circular
        const phi = Math.acos(2 * Math.random() - 1); // Polar angle
        const theta = 2 * Math.PI * Math.random(); // Azimuthal angle
        const speed = 0.8 + Math.random() * 0.4;
        
        burstVelocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        burstVelocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
        burstVelocities[i * 3 + 2] = Math.cos(phi) * speed;
      }
      
      burstGeometry.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3));
      burstGeometry.setAttribute('velocity', new THREE.BufferAttribute(burstVelocities, 3));
      
      const burstMaterial = new THREE.PointsMaterial({
        color: new THREE.Color('#84C3B2'), // Create new color instance for fadedTurquoise
        size: 0.06, // Reduced to half size (0.12 * 0.5 = 0.06)
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
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
        spawnParticles: spawnParticles
      };
    };

    const createConnection = (from: NetworkNode, to: NetworkNode): NetworkConnection => {
      // Calculate connection properties
      const distance = from.position.distanceTo(to.position);
      const lineColor = distance < 4 ? brightSand : warmTan;
      
      // Create tube geometry for smooth, bloom-friendly edges
      const direction = new THREE.Vector3().subVectors(to.position, from.position);
      const connectionLength = direction.length();
      
      // Create main connection tube (thicker for better bloom)
      const tubeRadius = 0.024; // Increased by 1.6x from 0.015 for better bloom coverage
      const tubeSegments = Math.max(12, Math.floor(connectionLength * 6)); // Even higher resolution
      const tubeGeometry = new THREE.CylinderGeometry(tubeRadius, tubeRadius, connectionLength, 8, tubeSegments);
      
      // Create material for main tube with brighter, more vivid colors for better bloom
      const tubeMaterial = new THREE.MeshStandardMaterial({
        color: lineColor,
        transparent: true,
        opacity: 1.0, // Full opacity for brighter appearance
        emissive: lineColor,
        emissiveIntensity: 0.8, // Increased from 0.2 for much more bloom
        roughness: 0.0, // Smoother for better light reflection
        metalness: 0.1
      });
      
      const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
      
      // Position and orient the tube to start at source node
      // Use existing direction vector and position tube at source, growing toward destination
      const tubeDirection = direction.clone().normalize();
      
      // Position tube at source node + half length offset along direction 
      const halfLength = connectionLength / 2;
      const tubeStartPosition = from.position.clone().add(tubeDirection.clone().multiplyScalar(halfLength));
      tubeMesh.position.copy(tubeStartPosition);
      tubeMesh.lookAt(to.position);
      tubeMesh.rotateX(Math.PI / 2); // Adjust orientation for cylinder
      
      // Initially scale to zero for animation (will grow from source toward destination)
      tubeMesh.scale.set(1, 0, 1); // Scale Y (length) to 0 for drawing animation
      scene.add(tubeMesh);

      // Create glow tube (larger and more transparent)
      const glowTubeRadius = tubeRadius * 4.0; // Increased glow radius for better bloom spread
      const glowTubeGeometry = new THREE.CylinderGeometry(glowTubeRadius, glowTubeRadius, connectionLength, 8, tubeSegments);
      const glowTubeMaterial = new THREE.MeshStandardMaterial({
        color: lineColor,
        transparent: true,
        opacity: 0.25, // Increased opacity for more visible glow
        emissive: lineColor,
        emissiveIntensity: 0.8, // Much higher emissive for stronger bloom effect
        roughness: 0.0,
        metalness: 0.0,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      
      const glowTubeMesh = new THREE.Mesh(glowTubeGeometry, glowTubeMaterial);
      glowTubeMesh.position.copy(tubeStartPosition); // Use same position as main tube
      glowTubeMesh.lookAt(to.position);
      glowTubeMesh.rotateX(Math.PI / 2);
      glowTubeMesh.scale.set(1, 0, 1); // Scale Y (length) to 0 for drawing animation
      scene.add(glowTubeMesh);

      const connection: NetworkConnection = {
        from,
        to,
        line: tubeMesh, // Using tube mesh instead of line
        glowLine: glowTubeMesh, // Using glow tube mesh
        createdAt: Date.now(),
        opacity: 0.8,
        isAnimating: true,
        animationProgress: 0
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
      connectionsToRemove.forEach(connection => {
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
        connection.from.connections = connection.from.connections.filter(c => c !== connection);
        connection.to.connections = connection.to.connections.filter(c => c !== connection);
        
        // Remove from global connections array
        connectionsRef.current = connectionsRef.current.filter(c => c !== connection);
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
      nodesRef.current = nodesRef.current.filter(n => n !== node);
    };

    const getRandomPosition = (): THREE.Vector3 => {
      // Get full viewport width since we now extend to screen edges
      const viewportWidth = mountRef.current?.clientWidth || window.innerWidth;
      // Scale horizontal bounds based on full screen width for better coverage
      let horizontalBounds = Math.min(45, (viewportWidth / 1200) * 45);
      
      // Scale vertical bounds relative to viewport height
      // Use window.innerHeight to get device viewport height
      const viewportHeight = window.innerHeight;
      // Base vertical bounds on viewport height with a scaling factor
      let verticalBounds = (viewportHeight / 1080) * 23.04; // Scale relative to 1080px baseline
      
      // Mobile/tablet adjustments (viewport width < 768px)
      if (viewportWidth < 768) {
        horizontalBounds *= 1.1; // 110% wider on mobile
        verticalBounds *= 1.6; // 130% taller on mobile
      }
      
      return new THREE.Vector3(
        (Math.random() - 0.5) * horizontalBounds, // Responsive horizontal space with mobile scaling
        (Math.random() - 0.5) * verticalBounds, // Viewport-relative vertical space with mobile scaling
        (Math.random() - 0.5) * 15
      );
    };

    const findNearbyNodes = (position: THREE.Vector3, maxDistance: number = 7): NetworkNode[] => {
      return nodesRef.current.filter(node => {
        const distance = position.distanceTo(node.position);
        return distance <= maxDistance && distance > 0;
      });
    };

    const shouldCreateConnection = (node1: NetworkNode, node2: NetworkNode): boolean => {
      // Don't create if already connected
      const alreadyConnected = node1.connections.some(conn => 
        conn.from === node2 || conn.to === node2
      );
      
      // Increase connections per node to 8 for more dense network
      const hasRoomForConnection = node1.connections.length < 8 && node2.connections.length < 8;
      
      return !alreadyConnected && hasRoomForConnection;
    };

    // Particle system for visual effects (increased count)
    const particleCount = 60;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: fadedTurquoise,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation variables with improved edge management
    let lastNodeCreation = 0;
    const nodeCreationInterval = 600; // Create nodes faster
    let lastConnectionAttempt = 0;
    const connectionAttemptInterval = 150; // Try connections more frequently
    const maxConnections = 160; // Doubled from 80 to 160 (2x more edges)
    const resumeThreshold = 10; // Resume when 10 less than max
    let isWaitingForEdgeReduction = false;

    // Animation loop
    const animate = () => {
      const currentTime = Date.now();

      // Check edge count and manage waiting state
      const currentEdgeCount = connectionsRef.current.length;
      
      // If we've hit max edges, start waiting
      if (currentEdgeCount >= maxConnections && !isWaitingForEdgeReduction) {
        isWaitingForEdgeReduction = true;
      }
      
      // If we're waiting and edges have reduced enough, resume
      if (isWaitingForEdgeReduction && currentEdgeCount <= (maxConnections - resumeThreshold)) {
        isWaitingForEdgeReduction = false;
      }

      // Create new nodes only if we're not waiting for edge reduction
      if (!isWaitingForEdgeReduction && currentTime - lastNodeCreation > nodeCreationInterval) {
        const newPosition = getRandomPosition();
        const newNode = createNode(newPosition);
        nodesRef.current.push(newNode);
        lastNodeCreation = currentTime;

        // Try to connect to nearby nodes only if we have room for more connections
        if (currentEdgeCount < maxConnections) {
          const nearbyNodes = findNearbyNodes(newPosition);
          nearbyNodes.forEach(nearbyNode => {
            // Don't connect to nodes that are fading out
            if (!nearbyNode.isRemoving && shouldCreateConnection(newNode, nearbyNode) && 
                Math.random() < 0.7 && connectionsRef.current.length < maxConnections) {
              const connection = createConnection(newNode, nearbyNode);
              connectionsRef.current.push(connection);
            }
          });
        }
      }

      // Try to create additional connections between existing nodes only if we have room
      if (currentTime - lastConnectionAttempt > connectionAttemptInterval && 
          nodesRef.current.length > 1 && connectionsRef.current.length < maxConnections) {
        const randomNode1 = nodesRef.current[Math.floor(Math.random() * nodesRef.current.length)];
        
        // Only connect if the source node is not fading
        if (!randomNode1.isRemoving) {
          const nearbyNodes = findNearbyNodes(randomNode1.position, 6);
          
          if (nearbyNodes.length > 0) {
            const randomNode2 = nearbyNodes[Math.floor(Math.random() * nearbyNodes.length)];
            // Don't connect to fading nodes
            if (!randomNode2.isRemoving && shouldCreateConnection(randomNode1, randomNode2) && Math.random() < 0.5) {
              const connection = createConnection(randomNode1, randomNode2);
              connectionsRef.current.push(connection);
            }
          }
        }
        lastConnectionAttempt = currentTime;
      }

      // Animate connections being drawn using tube scaling
      connectionsRef.current.forEach(connection => {
        if (connection.isAnimating && connection.animationProgress < 1) {
          connection.animationProgress += 0.015; // Animation speed
          
          // For tube meshes, animate the Y scale and position to grow from source to destination
          const tubeMesh = connection.line as THREE.Mesh;
          const glowTubeMesh = connection.glowLine as THREE.Mesh;
          
          // Calculate the current length and position offset
          const startPos = connection.from.position;
          const endPos = connection.to.position;
          const fullDirection = new THREE.Vector3().subVectors(endPos, startPos);
          const fullLength = fullDirection.length();
          const normalizedDirection = fullDirection.clone().normalize();
          
          // Current length based on animation progress
          const currentLength = fullLength * connection.animationProgress;
          
          // Position the tube so it starts at source and grows toward destination
          const currentOffset = currentLength / 2; // Half of current length for center positioning
          const currentPosition = startPos.clone().add(normalizedDirection.clone().multiplyScalar(currentOffset));
          
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
              singleParticleGeometry.setAttribute('position', new THREE.BufferAttribute(singleParticlePosition, 3));
              
              // Size gradient: larger at front (0.3), smaller at back (0.1)
              const particleSize = 0.3 - (i * 0.05); // 0.3, 0.25, 0.2, 0.15, 0.1
              
              const singleParticleMaterial = new THREE.PointsMaterial({
                color: new THREE.Color('#D9B08C'), // Sand color to match edges
                size: particleSize,
                transparent: true,
                opacity: 0.8 - (i * 0.1), // Also fade opacity slightly for trailing effect
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
              });
              
              const singleParticle = new THREE.Points(singleParticleGeometry, singleParticleMaterial);
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
            for (let i = 0; i < connection.leadingParticle.children.length; i++) {
              const particle = connection.leadingParticle.children[i] as THREE.Points;
              const particleGeometry = particle.geometry as THREE.BufferGeometry;
              const positionAttribute = particleGeometry.attributes.position;
              const positions = positionAttribute.array as Float32Array;
              
              // Adjust spacing between particles back to original spacing for better visibility
              const trailProgress = Math.max(0, connection.animationProgress - (i * 0.05));
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
      nodesRef.current.forEach(node => {
        const connectionCount = node.connections.length;
        const glowIntensity = Math.min(connectionCount / 8, 1); // Updated for max 8 connections
        
        // Handle spawn animation with simple 0-100% scale
        let spawnScale = 1;
        if (node.isSpawning) {
          const spawnAge = currentTime - node.spawnStartTime;
          const coreDuration = 500; // 400ms duration to match CSS
          const particleDuration = 800; // Twice as long as core duration for particles
          const totalDuration = Math.max(particleDuration, coreDuration); // Use particle duration for total
          
          if (spawnAge < totalDuration) {
            // 0-100% scale using ease-in quadratic
            if (spawnAge < coreDuration) {
              const easedT = Math.min(Math.pow(spawnAge/coreDuration, 3), 1);
              
              spawnScale = easedT; // Simple 0 to 1 scale
            }
            
            // Animate spawn particles with longer duration and slower fade
            if (node.spawnParticles) {
              const positions = node.spawnParticles.geometry.attributes.position.array as Float32Array;
              const velocities = node.spawnParticles.geometry.attributes.velocity.array as Float32Array;
              const material = node.spawnParticles.material as THREE.PointsMaterial;
              
              // Fade out particles over particle duration (twice as long, half as fast)
              const newOpacity = Math.max(0, 1 - (spawnAge / particleDuration));
              material.opacity = newOpacity;
              
              // Delete particles when they reach 0% opacity (fully transparent)
              if (newOpacity <= 0) {
                scene.remove(node.spawnParticles);
                node.spawnParticles.geometry.dispose();
                (node.spawnParticles.material as THREE.PointsMaterial).dispose();
                node.spawnParticles = undefined;
              } else {
                // Move particles outward much slower
                for (let i = 0; i < positions.length / 3; i++) {
                  positions[i * 3] += velocities[i * 3] * 0.005; // Reduced from 0.02 to 0.005 (4x slower)
                  positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.005;
                  positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.005;
                }
                node.spawnParticles.geometry.attributes.position.needsUpdate = true;
              }
            }
          } else {
            // Spawn animation complete
            node.isSpawning = false;
            spawnScale = 1;
            
            // Remove spawn particles
            if (node.spawnParticles) {
              scene.remove(node.spawnParticles);
              node.spawnParticles.geometry.dispose();
              (node.spawnParticles.material as THREE.PointsMaterial).dispose();
              node.spawnParticles = undefined;
            }
          }
        }
        
        // Add pulsing effect (much slower and based on node creation time to prevent restart)
        const baseTime = currentTime - node.createdAt; // Use node's age for consistent timing
        const pulseSpeed = 0.0004; // 1/5 of original speed (was 0.002 base)
        const pulse = (Math.sin(baseTime * pulseSpeed) + 1) / 2;
        
        // Check if node is fading out
        let nodeFadeMultiplier = 1;
        if (node.isRemoving && node.fadeStartTime) {
          const fadeAge = currentTime - node.fadeStartTime;
          const fadeDuration = 12500; // 12.5 seconds fade duration
          const fadeProgress = Math.min(fadeAge / fadeDuration, 1);
          nodeFadeMultiplier = 1 - fadeProgress;
        }
        
        // Core node material opacity control
        (node.mesh.material as THREE.MeshBasicMaterial).opacity = 0.9 * nodeFadeMultiplier;
        
        // Update opacity of all connected edges based on this node's fade state
        node.connections.forEach(connection => {
          // Find the fade multiplier for the other node
          const otherNode = connection.from === node ? connection.to : connection.from;
          let otherNodeFadeMultiplier = 1;
          if (otherNode.isRemoving && otherNode.fadeStartTime) {
            const otherFadeAge = currentTime - otherNode.fadeStartTime;
            const fadeDuration = 12500;
            const otherFadeProgress = Math.min(otherFadeAge / fadeDuration, 1);
            otherNodeFadeMultiplier = 1 - otherFadeProgress;
          }
          
          // Use the lower opacity (more faded) of the two connected nodes
          const connectionOpacity = Math.min(nodeFadeMultiplier, otherNodeFadeMultiplier);
          
          // Apply to tube mesh materials (cast to Mesh to access material)
          const tubeMesh = connection.line as THREE.Mesh;
          const glowTubeMesh = connection.glowLine as THREE.Mesh;
          (tubeMesh.material as THREE.MeshBasicMaterial).opacity = 0.8 * connectionOpacity;
          (glowTubeMesh.material as THREE.MeshBasicMaterial).opacity = 0.15 * connectionOpacity;
        });
        
        // Simplified scaling - only the main node mesh
        node.mesh.scale.setScalar(spawnScale);
      });

      // Mid-life edge generation: at 1/3 of node lifetime, attempt additional connections
      nodesRef.current.forEach(node => {
        if (!node.isRemoving && connectionsRef.current.length < maxConnections) {
          const age = currentTime - node.createdAt;
          const nodeMaxAge = 25000; // Same as used later
          const midLifePoint = nodeMaxAge / 3; // 1/3 of lifetime
          const connectionWindow = 2000; // 2 second window around mid-life point
          
          // Check if node is in its mid-life connection window
          if (age >= midLifePoint && age <= (midLifePoint + connectionWindow)) {
            const nearbyNodes = findNearbyNodes(node.position, 8); // Slightly larger search radius
            nearbyNodes.forEach(nearbyNode => {
              if (!nearbyNode.isRemoving && shouldCreateConnection(node, nearbyNode) && 
                  Math.random() < 0.3 && connectionsRef.current.length < maxConnections) { // Lower probability for mid-life connections
                const connection = createConnection(node, nearbyNode);
                connectionsRef.current.push(connection);
              }
            });
          }
        }
      });

      // Handle node fade-out and removal with same process as edges
      const maxNodes = 50; // Increased from 25 to 50
      const nodeMaxAge = 25000; // 25 seconds
      const nodeFadeStartAge = nodeMaxAge / 2; // Start fading at 12.5 seconds
      
      // Start fading nodes that are old enough
      nodesRef.current.forEach(node => {
        const age = currentTime - node.createdAt;
        if (age > nodeFadeStartAge && !node.isRemoving) {
          startNodeRemoval(node);
        }
      });
      
      // Check for nodes that need to start fading (old or excess nodes)
      const nodesToStartFading = nodesRef.current.filter((node, index) => {
        const age = currentTime - node.createdAt;
        const exceedsMaxCount = index < nodesRef.current.length - maxNodes;
        const shouldStartFading = !node.isRemoving && (age > nodeMaxAge || exceedsMaxCount);
        return shouldStartFading;
      });
      
      nodesToStartFading.forEach(node => {
        startNodeRemoval(node);
      });

      // Remove nodes that have fully completed their fade animation
      const nodesToRemove = nodesRef.current.filter(node => {
        if (!node.isRemoving || !node.fadeStartTime) return false;
        const fadeDuration = 12500; // Must match the fade duration in the render loop
        const fadeAge = currentTime - node.fadeStartTime;
        return fadeAge > fadeDuration;
      });
      
      nodesToRemove.forEach(node => {
        removeNode(node);
      });

      // Animate particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleVelocities[i * 3];
        positions[i * 3 + 1] += particleVelocities[i * 3 + 1];
        positions[i * 3 + 2] += particleVelocities[i * 3 + 2];
        
        // Wrap particles around the larger scene
        if (Math.abs(positions[i * 3]) > 20) particleVelocities[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 12) particleVelocities[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 10) particleVelocities[i * 3 + 2] *= -1;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Simplified camera movement with physics-based tracking point
      const time = currentTime * 0.0003 * 0.25; // Slowed down to 25% speed
      
      // Update tracking point physics
      const trackingPoint = trackingPointRef.current;
      const mouse = mouseRef.current;
      
      // Calculate distance from tracking point to mouse
      const dx = mouse.x - trackingPoint.x;
      const dy = mouse.y - trackingPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Acceleration based on distance (farther = faster acceleration) - increased for responsiveness
      const maxAcceleration = 0.005; // Tripled from 0.004 for faster response
      const acceleration = Math.min(maxAcceleration, distance * 0.008); // Quadrupled from 0.002 for quicker pickup
      
      // Apply acceleration toward mouse position
      if (distance > 0.01) { // Reduced threshold from 0.01 to 0.005 for earlier response
        trackingPoint.vx += (dx / distance) * acceleration;
        trackingPoint.vy += (dy / distance) * acceleration;
      }
      
      // Apply friction to velocity - reduced for more responsive movement
      const friction = 0.9; // Reduced from 0.95 for less dampening
      trackingPoint.vx *= friction;
      trackingPoint.vy *= friction;
      
      // Update tracking point position
      trackingPoint.x += trackingPoint.vx;
      trackingPoint.y += trackingPoint.vy;
      
      // Camera movement relative to tracking point (not mouse directly)
      const cameraInfluence = 5.0;
      const targetX = Math.sin(time) * 3 + (-trackingPoint.x * cameraInfluence);
      const targetY = Math.cos(time * 0.8) * 2.5 + (-trackingPoint.y * cameraInfluence);
      
      // Smooth camera interpolation - increased for more responsive movement
      const lerpFactor = 0.03; // Tripled from 0.02 for faster camera response
      camera.position.x += (targetX - camera.position.x) * lerpFactor;
      camera.position.y += (targetY - camera.position.y) * lerpFactor;
      camera.lookAt(0, 0, 0);

      

      // Render with bloom effect
      if (composerRef.current && rendererRef.current && sceneRef.current && cameraRef.current && !rendererRef.current.getContext().isContextLost()) {
        try {
          composerRef.current.render();
        } catch (error) {
          console.warn('Composer render failed, falling back to basic render:', error);
          // Fallback to basic renderer if composer fails
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      } else if (rendererRef.current && sceneRef.current && cameraRef.current && !rendererRef.current.getContext().isContextLost()) {
        // Fallback render without composer
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      } else {
        // Log what's missing
        const missing: string[] = [];
        if (!composerRef.current) missing.push('composer');
        if (!rendererRef.current) missing.push('renderer');
        if (!sceneRef.current) missing.push('scene');
        if (!cameraRef.current) missing.push('camera');
        if (rendererRef.current && rendererRef.current.getContext().isContextLost()) missing.push('context-lost');
        if (missing.length > 0) {
          console.warn('NetworkHero: Cannot render, missing:', missing.join(', '));
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
      // Clear any pending initialization timeout
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
        initializationTimeoutRef.current = null;
      }
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = undefined;
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      
      // Clean up Three.js objects in proper order
      if (composerRef.current) {
        composerRef.current.dispose();
        composerRef.current = null;
      }
      
      // Clean up scene objects
      if (sceneRef.current) {
        scene.remove(particles);
        particles.geometry.dispose();
        (particles.material as THREE.PointsMaterial).dispose();
        
        nodesRef.current.forEach(node => {
          scene.remove(node.mesh);
          node.mesh.geometry.dispose();
          (node.mesh.material as THREE.MeshBasicMaterial).dispose();
          
          // Clean up spawn particles
          if (node.spawnParticles) {
            scene.remove(node.spawnParticles);
            node.spawnParticles.geometry.dispose();
            (node.spawnParticles.material as THREE.PointsMaterial).dispose();
          }
        });
        
        connectionsRef.current.forEach(connection => {
          scene.remove(connection.line);
          scene.remove(connection.glowLine);
          
          // Dispose geometry and material for mesh-based connections
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
            // Dispose of all child particles
            connection.leadingParticle.children.forEach((child) => {
              if (child instanceof THREE.Points) {
                child.geometry.dispose();
                (child.material as THREE.PointsMaterial).dispose();
              }
            });
          }
        });
        
        // Clear the scene
        while(scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }
        
        sceneRef.current = null;
      }
      
      // Clear arrays
      nodesRef.current = [];
      connectionsRef.current = [];
      
      // Dispose renderer and remove canvas
      if (rendererRef.current) {
        const renderer = rendererRef.current;
        
        // Remove WebGL context event listeners
        if (contextLossHandlerRef.current) {
          renderer.domElement.removeEventListener('webglcontextlost', contextLossHandlerRef.current);
        }
        if (contextRestoreHandlerRef.current) {
          renderer.domElement.removeEventListener('webglcontextrestored', contextRestoreHandlerRef.current);
        }
        
        // Force context loss to prevent WebGL issues on navigation
        const gl = renderer.getContext();
        if (gl && gl.getExtension('WEBGL_lose_context')) {
          gl.getExtension('WEBGL_lose_context')!.loseContext();
        }
        
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
          try {
            mountRef.current.removeChild(renderer.domElement);
          } catch (error) {
            console.warn('Error removing canvas element:', error);
          }
        }
        
        renderer.dispose();
        rendererRef.current = null;
      }
      
      cameraRef.current = null;
      
      // Clear handler refs
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
          `
        }}
      />
    </div>
  );
};

export default NetworkHero;
