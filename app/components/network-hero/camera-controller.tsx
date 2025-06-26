import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useNetworkStore } from './store';
import { ANIMATION_CONFIG } from './constants';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const trackingPoint = useNetworkStore((state) => state.trackingPoint);

  useFrame((state) => {
    const time = state.clock.elapsedTime * ANIMATION_CONFIG.cameraTime;

    // Camera movement relative to tracking point (matches original)
    const targetX = Math.sin(time) * 3 + -trackingPoint.x * ANIMATION_CONFIG.cameraInfluence;
    const targetY = Math.cos(time * 0.8) * 2.5 + -trackingPoint.y * ANIMATION_CONFIG.cameraInfluence;

    camera.position.x += (targetX - camera.position.x) * ANIMATION_CONFIG.lerpFactor;
    camera.position.y += (targetY - camera.position.y) * ANIMATION_CONFIG.lerpFactor;
    camera.lookAt(0, 0, 0);
  });

  return null;
};
