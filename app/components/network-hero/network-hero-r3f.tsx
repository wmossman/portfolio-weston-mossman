import React, { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { COLORS, CAMERA_CONFIG } from './constants';
import { useNetworkStore } from './store';
import { BackgroundParticles } from './background-particles';
import { CameraController } from './camera-controller';
import { NetworkManager } from './network-manager';
import { MouseHandler } from './mouse-handler';
import { Node } from './node';
import { Connection } from './connections';
import { getOptimizedDPR, performanceMonitor } from './utils';

// Performance monitoring component
const PerformanceMonitor: React.FC = React.memo(() => {
  useEffect(() => {
    const interval = setInterval(() => {
      performanceMonitor.update();
    }, 100); // Update performance metrics every 100ms

    return () => clearInterval(interval);
  }, []);

  return null;
});

const Scene: React.FC = React.memo(() => {
  const { nodes, connections } = useNetworkStore();

  // Memoize expensive signature calculations to prevent re-computation on every render
  const nodesLength = nodes.length;
  const nodesSignature = useMemo(() => nodes.map((n) => n.id + n.isSpawning + n.isRemoving).join(''), [nodes]);
  const connectionsLength = connections.length;
  const connectionsSignature = useMemo(
    () => connections.map((c) => c.id + c.isAnimating + c.animationProgress).join(''),
    [connections],
  );

  // Memoize the nodes and connections arrays to prevent unnecessary re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedNodes = useMemo(() => nodes, [nodes, nodesLength, nodesSignature]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedConnections = useMemo(() => connections, [connections, connectionsLength, connectionsSignature]);

  return (
    <>
      {/* Performance monitoring - only in development */}
      {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}

      {/* Lighting - use shared light instances */}
      {/* eslint-disable react/no-unknown-property */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color={COLORS.white} />
      <pointLight position={[0, 0, 10]} intensity={0.6} color={COLORS.fadedTurquoise} />
      {/* eslint-enable react/no-unknown-property */}

      {/* Background particles */}
      <BackgroundParticles />

      {/* Network connections (render first so nodes appear on top) */}
      {memoizedConnections.map((connection) => (
        <Connection key={connection.id} connection={connection} />
      ))}

      {/* Network nodes (render after connections) */}
      {memoizedNodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}

      {/* Controllers */}
      <CameraController />
      <NetworkManager />
      <MouseHandler />
    </>
  );
});

const Fallback: React.FC = React.memo(() => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-300 mx-auto mb-4"></div>
      <p className="text-gray-500">Loading network visualization...</p>
    </div>
  </div>
));

type BloomConfig = {
  intensity: number;
  luminanceThreshold: number;
  luminanceSmoothing: number;
  radius: number;
  height?: number;
};

export const NetworkHeroR3F: React.FC = React.memo(() => {
  const { clearAll } = useNetworkStore();

  // Clear all state when component unmounts (e.g., page navigation)
  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);

  // Optimized Canvas configuration
  const canvasConfig = useMemo(
    () => ({
      camera: {
        fov: CAMERA_CONFIG.fov,
        near: CAMERA_CONFIG.near,
        far: CAMERA_CONFIG.far,
        position: CAMERA_CONFIG.position,
      },
      dpr: getOptimizedDPR(),
      performance: { min: 0.5 },
      style: { background: COLORS.background, minHeight: '75vh' },
      fallback: <Fallback />,
      // Enable concurrent features for better performance
      mode: 'concurrent' as const,
      // Optimize for performance
      flat: false,
      linear: false,
    }),
    [],
  );

  const bloomConfig: BloomConfig = useMemo(() => {
    const baseConfig: BloomConfig = {
      intensity: 1.88,
      luminanceThreshold: 0.05,
      luminanceSmoothing: 0.9,
      radius: 0.46,
    };

    if (typeof window === 'undefined') {
      return baseConfig;
    }

    if (window.innerWidth < 768) {
      return {
        ...baseConfig,
        intensity: 1.41,
        radius: 0.35,
      };
    }

    if (window.innerWidth > 1920) {
      return {
        ...baseConfig,
        intensity: 2.34,
        radius: 0.58,
      };
    }

    return baseConfig;
  }, []);

  return (
    <div className="relative w-screen h-[75vh] rounded-lg overflow-hidden bg-background-base mb-8 -mx-2 md:-mx-0 lg:-mx-4 left-1/2 -translate-x-1/2">
      <Canvas {...canvasConfig}>
        <Suspense fallback={null}>
          <Scene />
          <EffectComposer multisampling={0}>
            <Bloom {...bloomConfig} />
          </EffectComposer>
        </Suspense>
      </Canvas>

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
});
