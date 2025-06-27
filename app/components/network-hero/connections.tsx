import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, SIZES, TIMING, ANIMATION_CONFIG } from './constants';
import { NetworkConnection } from './types';
import { getLineColor } from './utils';
import { useNetworkStore } from './store';

// Reusable vectors to avoid GC pressure
const tempVector1 = new THREE.Vector3();
const tempVector2 = new THREE.Vector3();
const tempDirection = new THREE.Vector3();

interface ConnectionProps {
  connection: NetworkConnection;
}

export const Connection: React.FC<ConnectionProps> = React.memo(({ connection }) => {
  const tubeRef = useRef<THREE.Mesh>(null);
  const glowTubeRef = useRef<THREE.Mesh>(null);
  const leadingParticlesRef = useRef<THREE.Group>(null);
  const { nodes, connections } = useNetworkStore();

  // Store stable references to avoid closure issues
  const connectionIdRef = useRef(connection.id);
  connectionIdRef.current = connection.id;

  // Memoized update functions
  const updateConnectionStore = useCallback((updates: Partial<NetworkConnection>) => {
    useNetworkStore.getState().updateConnection(connectionIdRef.current, updates);
  }, []);

  const removeConnectionStore = useCallback(() => {
    useNetworkStore.getState().removeConnection(connectionIdRef.current);
  }, []);

  // Check for duplicate connections and remove this one if it's a duplicate
  useEffect(() => {
    const checkForDuplicates = () => {
      const duplicates = connections.filter((conn) => {
        if (conn.id === connection.id) return false; // Don't compare with self

        // Check if this connection connects the same two nodes (bidirectional)
        const sameNodes =
          (conn.from.id === connection.from.id && conn.to.id === connection.to.id) ||
          (conn.from.id === connection.to.id && conn.to.id === connection.from.id);

        return sameNodes;
      });

      if (duplicates.length > 0) {
        // This connection is a duplicate, remove it
        removeConnectionStore();
        return true; // Indicate this connection was removed
      }

      return false;
    };

    // Run the check after a small delay to ensure all connections have been added to the store
    const timeoutId = setTimeout(checkForDuplicates, 100);

    return () => clearTimeout(timeoutId);
  }, [connection.id, connection.from.id, connection.to.id, connections, removeConnectionStore]);

  const distance = connection.from.position.distanceTo(connection.to.position);
  const lineColor = getLineColor(distance);

  // Calculate connection properties - memoized for performance
  const { tubeStartPosition, tubeGeometry, glowTubeGeometry } = useMemo(() => {
    tempDirection.subVectors(connection.to.position, connection.from.position);
    const length = tempDirection.length();
    const segments = Math.max(12, Math.floor(length * 6));
    tempDirection.normalize();
    const halfLength = length / 2;
    tempVector1.copy(connection.from.position).add(tempDirection.clone().multiplyScalar(halfLength));

    // Create shared geometries for this connection
    const tubeGeo = new THREE.CylinderGeometry(SIZES.tubeRadius, SIZES.tubeRadius, length, 8, segments);
    const glowTubeGeo = new THREE.CylinderGeometry(
      SIZES.tubeRadius * SIZES.glowTubeMultiplier,
      SIZES.tubeRadius * SIZES.glowTubeMultiplier,
      length,
      8,
      segments,
    );

    return {
      tubeStartPosition: tempVector1.clone(),
      tubeGeometry: tubeGeo,
      glowTubeGeometry: glowTubeGeo,
    };
  }, [connection.from.position, connection.to.position]);

  // Set initial orientation when component mounts
  const initialOrientationRef = useRef(false);

  useEffect(() => {
    if (tubeRef.current && glowTubeRef.current && !initialOrientationRef.current) {
      // Set initial orientation like the original
      tubeRef.current.lookAt(connection.to.position);
      tubeRef.current.rotateX(Math.PI / 2);

      glowTubeRef.current.lookAt(connection.to.position);
      glowTubeRef.current.rotateX(Math.PI / 2);

      initialOrientationRef.current = true;
    }
  }, [connection.to.position]);

  // Create materials - memoized to prevent recreation
  const tubeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(lineColor),
        transparent: true,
        opacity: 0.8,
        emissive: new THREE.Color(lineColor),
        emissiveIntensity: 0.8,
        roughness: 0.0,
        metalness: 0.1,
        depthTest: true,
        depthWrite: true,
        toneMapped: false, // Allow bloom effect
      }),
    [lineColor],
  );

  const glowTubeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(lineColor),
        transparent: true,
        opacity: 0.15,
        emissive: new THREE.Color(lineColor),
        emissiveIntensity: 0.8,
        roughness: 0.0,
        metalness: 0.0,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        toneMapped: false, // Allow bloom effect
      }),
    [lineColor],
  );

  // Create leading particles - memoized for performance
  const leadingParticles = useMemo(() => {
    const group = new THREE.Group();

    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.BufferGeometry();
      const position = new Float32Array([0, 0, 0]);
      geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

      const particleSize = 0.3 - i * 0.05;
      const material = new THREE.PointsMaterial({
        color: new THREE.Color(COLORS.warmTan),
        size: particleSize,
        transparent: true,
        opacity: 0.8 - i * 0.1,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        toneMapped: false, // Allow bloom effect
      });

      const particle = new THREE.Points(geometry, material);
      group.add(particle);
    }

    return group;
  }, []);

  useFrame(() => {
    if (!tubeRef.current || !glowTubeRef.current) return;

    if (connection.isAnimating && connection.animationProgress < 1) {
      // Update animation progress using constant speed - direct mutation for performance
      const newProgress = Math.min(connection.animationProgress + ANIMATION_CONFIG.connectionSpeed, 1);

      // Update the connection progress in the store
      updateConnectionStore({ animationProgress: newProgress });

      // Calculate current position and scale based on progress - reuse temp vectors
      tempVector1.copy(connection.from.position);
      tempVector2.copy(connection.to.position);
      tempDirection.subVectors(tempVector2, tempVector1);
      const fullLength = tempDirection.length();
      tempDirection.normalize();

      // Current length based on animation progress
      const currentLength = fullLength * newProgress;
      const currentOffset = currentLength / 2;
      tempVector1.add(tempDirection.clone().multiplyScalar(currentOffset));

      // Update tube positions and scales (using setY like original) - direct mutations
      tubeRef.current.position.copy(tempVector1);
      tubeRef.current.lookAt(connection.to.position);
      tubeRef.current.rotateX(Math.PI / 2);
      tubeRef.current.scale.setY(newProgress);

      glowTubeRef.current.position.copy(tempVector1);
      glowTubeRef.current.lookAt(connection.to.position);
      glowTubeRef.current.rotateX(Math.PI / 2);
      glowTubeRef.current.scale.setY(newProgress);

      // Update leading particles
      if (leadingParticlesRef.current && connection.isAnimating) {
        leadingParticlesRef.current.children.forEach((child, i) => {
          const particle = child as THREE.Points;
          const particleGeometry = particle.geometry as THREE.BufferGeometry;
          const positionAttribute = particleGeometry.attributes.position;
          const positions = positionAttribute.array as Float32Array;

          const trailProgress = Math.max(0, newProgress - i * ANIMATION_CONFIG.particleTrailSpacing);
          // Reuse temp vector for trail position calculation
          tempVector2.copy(connection.from.position).lerp(connection.to.position, trailProgress);

          positions[0] = tempVector2.x;
          positions[1] = tempVector2.y;
          positions[2] = tempVector2.z;

          positionAttribute.needsUpdate = true;
        });
      }

      if (newProgress >= 1) {
        // Animation complete, remove leading particles
        if (leadingParticlesRef.current) {
          leadingParticlesRef.current.visible = false;
        }
        // Update the connection to mark animation as complete
        updateConnectionStore({ isAnimating: false });
      }
    }

    // Handle connection opacity based on node fade states
    // Get fresh node data from store to ensure we have current fade states
    const fromNode = nodes.find((n) => n.id === connection.from.id) || connection.from;
    const toNode = nodes.find((n) => n.id === connection.to.id) || connection.to;

    let fromFadeMultiplier = 1;
    let toFadeMultiplier = 1;

    if (fromNode.isRemoving && fromNode.fadeStartTime) {
      const fadeAge = Date.now() - fromNode.fadeStartTime;
      fromFadeMultiplier = Math.max(0, 1 - fadeAge / TIMING.nodeFadeDuration);
    }

    if (toNode.isRemoving && toNode.fadeStartTime) {
      const fadeAge = Date.now() - toNode.fadeStartTime;
      toFadeMultiplier = Math.max(0, 1 - fadeAge / TIMING.nodeFadeDuration);
    }

    // Use the minimum (most faded) opacity to match the oldest node
    const connectionOpacity = Math.min(fromFadeMultiplier, toFadeMultiplier);

    // Direct material mutations for performance
    tubeMaterial.opacity = 0.8 * connectionOpacity;
    glowTubeMaterial.opacity = 0.15 * connectionOpacity;

    // Connection removal is handled by NetworkManager
    if (connectionOpacity <= 0) {
      // Connection removal is handled by NetworkManager
    }
  });

  return (
    <group>
      {/* eslint-disable react/no-unknown-property */}
      {/* Main tube */}
      <mesh ref={tubeRef} position={tubeStartPosition} scale={[1, 0, 1]}>
        <primitive object={tubeGeometry} />
        <primitive object={tubeMaterial} />
      </mesh>

      {/* Glow tube */}
      <mesh ref={glowTubeRef} position={tubeStartPosition} scale={[1, 0, 1]}>
        <primitive object={glowTubeGeometry} />
        <primitive object={glowTubeMaterial} />
      </mesh>

      {/* Leading particles */}
      {connection.isAnimating && <primitive ref={leadingParticlesRef} object={leadingParticles} />}
      {/* eslint-enable react/no-unknown-property */}
    </group>
  );
});
