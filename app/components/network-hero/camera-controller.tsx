import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useNetworkStore } from './store';
import { ANIMATION_CONFIG } from './constants';
import * as THREE from 'three';

// Reusable vector to avoid GC pressure
const _tempVector = new THREE.Vector3();

export const CameraController: React.FC = React.memo(() => {
  const { camera } = useThree();
  const trackingPoint = useNetworkStore((state) => state.trackingPoint);

  // Cache the last tracking point to avoid unnecessary computations
  const lastTrackingPointRef = useRef({ x: 0, y: 0 });
  const hasTrackingPointChanged = useRef(false);

  // Update tracking point change detection
  if (trackingPoint.x !== lastTrackingPointRef.current.x || trackingPoint.y !== lastTrackingPointRef.current.y) {
    lastTrackingPointRef.current = { x: trackingPoint.x, y: trackingPoint.y };
    hasTrackingPointChanged.current = true;
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime * ANIMATION_CONFIG.cameraTime;

    // Camera movement relative to tracking point (matches original) - optimized calculations
    const sinTime = Math.sin(time);
    const cosTime = Math.cos(time * 0.8);

    const targetX = sinTime * 3 + -trackingPoint.x * ANIMATION_CONFIG.cameraInfluence;
    const targetY = cosTime * 2.5 + -trackingPoint.y * ANIMATION_CONFIG.cameraInfluence;

    // Use lerp for smooth interpolation - direct mutation for performance
    camera.position.x += (targetX - camera.position.x) * ANIMATION_CONFIG.lerpFactor;
    camera.position.y += (targetY - camera.position.y) * ANIMATION_CONFIG.lerpFactor;

    // Only update lookAt if necessary
    if (hasTrackingPointChanged.current || Math.abs(sinTime) > 0.01 || Math.abs(cosTime) > 0.01) {
      camera.lookAt(0, 0, 0);
      hasTrackingPointChanged.current = false;
    }
  });

  return null;
});
