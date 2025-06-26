import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, LIMITS, SIZES } from './constants';

export const BackgroundParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Create particle geometry, material, and velocities to match original
  const { geometry, material, velocities } = useMemo(() => {
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

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(COLORS.fadedTurquoise).multiplyScalar(1.5), // Subtle brightness, lower threshold will catch it
      size: SIZES.particleSize * 2.5, // Larger size to prevent bloom flickering
      transparent: true,
      opacity: 0.4, // Higher opacity since brightness is lower
      sizeAttenuation: true,
      toneMapped: false, // Allow bloom effect
    });

    return { geometry, material, velocities };
  }, []);

  // Animate particles with exact original logic
  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < LIMITS.particleCount; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // Wrap particles around the scene (exact original logic)
      if (Math.abs(positions[i * 3]) > 20) velocities[i * 3] *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 12) velocities[i * 3 + 1] *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    // eslint-disable react/no-unknown-property
    <points ref={pointsRef}>
      {/* eslint-disable react/no-unknown-property */}
      <primitive object={geometry} />
      <primitive object={material} />
      {/* eslint-enable react/no-unknown-property */}
    </points>
  );
};
