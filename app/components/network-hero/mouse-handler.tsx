import React, { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useNetworkStore } from './store';
import { ANIMATION_CONFIG } from './constants';

export const MouseHandler: React.FC = () => {
  const { gl } = useThree();
  const { setMouse, setTrackingPoint, trackingPoint, mouse } = useNetworkStore();

  // Set up mouse event handling on the canvas directly (like original)
  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      setMouse({ x, y });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl.domElement, setMouse]);

  // Update tracking point physics in frame loop
  useFrame(() => {
    const dx = mouse.x - trackingPoint.x;
    const dy = mouse.y - trackingPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const acceleration = Math.min(ANIMATION_CONFIG.maxAcceleration, distance * ANIMATION_CONFIG.acceleration);

    let newVx = trackingPoint.vx;
    let newVy = trackingPoint.vy;

    if (distance > 0.01) {
      newVx += (dx / distance) * acceleration;
      newVy += (dy / distance) * acceleration;
    }

    newVx *= ANIMATION_CONFIG.friction;
    newVy *= ANIMATION_CONFIG.friction;

    const newX = trackingPoint.x + newVx;
    const newY = trackingPoint.y + newVy;

    setTrackingPoint({
      x: newX,
      y: newY,
      vx: newVx,
      vy: newVy,
    });
  });

  return null; // No need for a mesh, using direct canvas event
};
