import React, { useEffect, useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useNetworkStore } from './store';
import { ANIMATION_CONFIG } from './constants';

export const MouseHandler: React.FC = React.memo(() => {
  const { gl } = useThree();
  const { setMouse, setTrackingPoint, trackingPoint, mouse } = useNetworkStore();

  // Cache mouse values to avoid unnecessary store updates
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const lastTrackingPointRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  // Throttle mouse updates for better performance
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Only update if mouse position changed significantly
      const deltaX = Math.abs(x - lastMouseRef.current.x);
      const deltaY = Math.abs(y - lastMouseRef.current.y);

      if (deltaX > 0.001 || deltaY > 0.001) {
        lastMouseRef.current = { x, y };
        setMouse({ x, y });
      }
    },
    [gl.domElement, setMouse],
  );

  // Set up mouse event handling on the canvas directly (like original)
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl.domElement, handleMouseMove]);

  // Update tracking point physics in frame loop - optimized for performance
  useFrame(() => {
    const dx = mouse.x - trackingPoint.x;
    const dy = mouse.y - trackingPoint.y;
    const distanceSquared = dx * dx + dy * dy;

    // Skip expensive sqrt if distance is very small
    if (distanceSquared < 0.0001) {
      return;
    }

    const distance = Math.sqrt(distanceSquared);
    const acceleration = Math.min(ANIMATION_CONFIG.maxAcceleration, distance * ANIMATION_CONFIG.acceleration);

    let newVx = trackingPoint.vx;
    let newVy = trackingPoint.vy;

    // Normalize and apply acceleration
    const invDistance = 1 / distance;
    newVx += dx * invDistance * acceleration;
    newVy += dy * invDistance * acceleration;

    // Apply friction
    newVx *= ANIMATION_CONFIG.friction;
    newVy *= ANIMATION_CONFIG.friction;

    const newX = trackingPoint.x + newVx;
    const newY = trackingPoint.y + newVy;

    // Only update store if values changed significantly
    const trackingDeltaX = Math.abs(newX - lastTrackingPointRef.current.x);
    const trackingDeltaY = Math.abs(newY - lastTrackingPointRef.current.y);
    const trackingDeltaVx = Math.abs(newVx - lastTrackingPointRef.current.vx);
    const trackingDeltaVy = Math.abs(newVy - lastTrackingPointRef.current.vy);

    if (trackingDeltaX > 0.001 || trackingDeltaY > 0.001 || trackingDeltaVx > 0.001 || trackingDeltaVy > 0.001) {
      lastTrackingPointRef.current = { x: newX, y: newY, vx: newVx, vy: newVy };
      setTrackingPoint({
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
      });
    }
  });

  return null; // No need for a mesh, using direct canvas event
});
