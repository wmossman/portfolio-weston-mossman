import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, LIMITS, SIZES } from './constants';

// Global shared geometry and material for better performance
const sharedParticleGeometry = (() => {
  const positions = new Float32Array(LIMITS.particleCount * 3);
  const velocities = new Float32Array(LIMITS.particleCount * 3);

  // Match original positioning and velocity logic exactly
  for (let i = 0; i < LIMITS.particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

  return geometry;
})();

const sharedParticleMaterial = new THREE.PointsMaterial({
  color: new THREE.Color(COLORS.fadedTurquoise).multiplyScalar(1.5), // Subtle brightness, lower threshold will catch it
  size: SIZES.particleSize * 2.5, // Larger size to prevent bloom flickering
  transparent: true,
  opacity: 0.4, // Higher opacity since brightness is lower
  sizeAttenuation: true,
  toneMapped: false, // Allow bloom effect
});

export const BackgroundParticles: React.FC = React.memo(() => {
  const pointsRef = useRef<THREE.Points>(null);

  // Get velocities from the shared geometry
  const velocities = useMemo(() => {
    return sharedParticleGeometry.attributes.velocity.array as Float32Array;
  }, []);

  // Animate particles with exact original logic - optimized for performance
  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Use direct array manipulation for better performance
    for (let i = 0; i < LIMITS.particleCount; i++) {
      const index = i * 3;

      positions[index] += velocities[index];
      positions[index + 1] += velocities[index + 1];
      positions[index + 2] += velocities[index + 2];

      // Wrap particles around the scene (exact original logic)
      if (Math.abs(positions[index]) > 20) velocities[index] *= -1;
      if (Math.abs(positions[index + 1]) > 12) velocities[index + 1] *= -1;
      if (Math.abs(positions[index + 2]) > 10) velocities[index + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    // eslint-disable react/no-unknown-property
    <points ref={pointsRef}>
      {/* eslint-disable react/no-unknown-property */}
      <primitive object={sharedParticleGeometry.clone()} />
      <primitive object={sharedParticleMaterial} />
      {/* eslint-enable react/no-unknown-property */}
    </points>
  );
});
