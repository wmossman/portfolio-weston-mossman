import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, SIZES, LIMITS, TIMING, ANIMATION_CONFIG } from './constants';
import { NetworkNode } from './types';
import { useNetworkStore } from './store';

// Global shared materials and geometries for better performance
const sharedNodeGeometry = new THREE.SphereGeometry(SIZES.nodeRadius, 12, 12);
const sharedNodeMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color(COLORS.fadedTurquoise),
  transparent: true,
  opacity: 0.9,
  toneMapped: false, // Allow bloom effect
});

const sharedBurstMaterial = new THREE.PointsMaterial({
  color: new THREE.Color(COLORS.fadedTurquoise),
  size: SIZES.burstParticleSize,
  transparent: true,
  opacity: 1.0,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
  toneMapped: false, // Allow bloom effect
});

interface NodeProps {
  node: NetworkNode;
}

export const Node: React.FC<NodeProps> = React.memo(({ node }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const spawnParticlesRef = useRef<THREE.Points>(null);

  // Store reference to avoid closure issues in useFrame
  const nodeIdRef = useRef(node.id);
  nodeIdRef.current = node.id;

  // Memoized update function to avoid recreating on every render
  const updateNodeStore = useCallback((updates: Partial<NetworkNode>) => {
    useNetworkStore.getState().updateNode(nodeIdRef.current, updates);
  }, []);

  // Create spawn particles geometry only once per node
  const spawnParticlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(LIMITS.burstParticleCount * 3);
    const velocities = new Float32Array(LIMITS.burstParticleCount * 3);

    for (let i = 0; i < LIMITS.burstParticleCount; i++) {
      // Start particles at origin since they're in a group positioned at node.position
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const speed = 0.6 + Math.random() * 0.4; // Moderate increase: 0.9-1.3 range (between original 0.8-1.2 and previous 1.0-1.6)

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    return geometry;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const currentTime = Date.now();
    const connectionCount = node.connections.length;
    const glowIntensity = Math.min(connectionCount / LIMITS.maxConnectionsPerNode, 1);

    // Handle spawn animation
    let spawnScale = 1;
    if (node.isSpawning) {
      const spawnAge = currentTime - node.spawnStartTime;
      const totalDuration = Math.max(TIMING.spawnParticleDuration, TIMING.spawnCoreDuration);

      if (spawnAge < totalDuration) {
        if (spawnAge < TIMING.spawnCoreDuration) {
          const easedT = Math.min(Math.pow(spawnAge / TIMING.spawnCoreDuration, 3), 1);
          spawnScale = easedT;
        }

        // Animate spawn particles
        if (spawnParticlesRef.current) {
          const positions = spawnParticlesRef.current.geometry.attributes.position.array as Float32Array;
          const velocities = spawnParticlesRef.current.geometry.attributes.velocity.array as Float32Array;
          const material = spawnParticlesRef.current.material as THREE.PointsMaterial;

          const newOpacity = Math.max(0, 1 - spawnAge / TIMING.spawnParticleDuration);
          material.opacity = newOpacity;

          if (newOpacity <= 0) {
            // Remove spawn particles - use direct mutation instead of setState
            updateNodeStore({ isSpawning: false });
          } else {
            // Update particle positions - direct mutation for performance
            for (let i = 0; i < positions.length / 3; i++) {
              positions[i * 3] += velocities[i * 3] * 0.006; // Reduced from 0.008 to 0.006 (between original 0.005 and previous 0.008)
              positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.006;
              positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.006;
            }
            spawnParticlesRef.current.geometry.attributes.position.needsUpdate = true;
          }
        }
      } else {
        updateNodeStore({ isSpawning: false });
        spawnScale = 1;
      }
    }

    // Add pulsing effect
    const baseTime = currentTime - node.createdAt;
    const pulse = (Math.sin(baseTime * ANIMATION_CONFIG.pulseSpeed) + 1) / 2;

    // Check if node is fading out
    let nodeFadeMultiplier = 1;
    if (node.isRemoving && node.fadeStartTime) {
      const fadeAge = currentTime - node.fadeStartTime;
      const fadeProgress = Math.min(fadeAge / TIMING.nodeFadeDuration, 1);
      nodeFadeMultiplier = 1 - fadeProgress;

      // Remove node when fade is complete
      if (fadeProgress >= 1) {
        // Node removal is handled by NetworkManager
        return;
      }
    }

    // Update material opacity directly on the shared material (cloned per instance)
    const brightnessMultiplier = 1 + glowIntensity * 0.08;
    const pulseMultiplier = 1 - pulse * 0.05;
    const finalOpacity = 0.9 * nodeFadeMultiplier * brightnessMultiplier * pulseMultiplier;

    // Apply to the actual mesh material
    const meshMaterial = meshRef.current.material as THREE.MeshBasicMaterial;
    meshMaterial.opacity = Math.min(finalOpacity, 1.0);

    // Update scale - direct mutation for performance
    meshRef.current.scale.setScalar(spawnScale);
  });

  return (
    // eslint-disable-next-line react/no-unknown-property
    <group position={node.position}>
      {/* eslint-disable react/no-unknown-property */}
      <mesh ref={meshRef}>
        <primitive object={sharedNodeGeometry} />
        <primitive object={sharedNodeMaterial.clone()} />
      </mesh>

      {node.isSpawning && (
        <points ref={spawnParticlesRef}>
          <primitive object={spawnParticlesGeometry} />
          <primitive object={sharedBurstMaterial.clone()} />
        </points>
      )}
      {/* eslint-enable react/no-unknown-property */}
    </group>
  );
});
