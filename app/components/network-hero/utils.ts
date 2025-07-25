import * as THREE from 'three';
import { COLORS, LIMITS } from './constants';
import { NetworkNode, NetworkConnection } from './types';

// Alternative name for compatibility with NetworkManager
export const generateRandomPosition = (existingNodes?: NetworkNode[]): THREE.Vector3 => {
  const viewportWidth = window.innerWidth;
  let horizontalBounds = Math.min(45, (viewportWidth / 1200) * 45);

  const viewportHeight = window.innerHeight;
  let verticalBounds = (viewportHeight / 1080) * 23.04;

  // Mobile/tablet adjustments
  if (viewportWidth < 768) {
    horizontalBounds *= 1.1;
    verticalBounds *= 1.6;
  }

  let position: THREE.Vector3;
  let attempts = 0;
  const maxAttempts = 50;
  const minDistance = 1.0; // Minimum distance between nodes

  do {
    position = new THREE.Vector3(
      (Math.random() - 0.5) * horizontalBounds,
      (Math.random() - 0.5) * verticalBounds,
      (Math.random() - 0.5) * 15,
    );

    attempts++;

    // If no existing nodes provided, or max attempts reached, use the position
    if (!existingNodes || attempts >= maxAttempts) {
      break;
    }

    // Check if position is too close to existing nodes
    const tooClose = existingNodes.some((node) => {
      const distance = position.distanceTo(node.position);
      return distance < minDistance;
    });

    if (!tooClose) {
      break;
    }
  } while (attempts < maxAttempts);

  return position;
};

// Keep the original name for backwards compatibility
export const getRandomPosition = generateRandomPosition;

export const findNearestNodes = (
  sourceNode: NetworkNode,
  nodes: NetworkNode[],
  maxCount: number = 7,
  maxDistance: number = 7,
): NetworkNode[] => {
  return nodes
    .filter((node) => node !== sourceNode)
    .map((node) => ({
      node,
      distance: sourceNode.position.distanceTo(node.position),
    }))
    .filter(({ distance }) => distance > 0 && distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxCount)
    .map(({ node }) => node);
};

export const findNearbyNodes = (
  position: THREE.Vector3,
  nodes: NetworkNode[],
  maxDistance: number = LIMITS.defaultMaxNodeDistance,
): NetworkNode[] => {
  return nodes.filter((node) => {
    const distance = position.distanceTo(node.position);
    return distance <= maxDistance && distance > 0;
  });
};

export const isValidConnection = (
  node1: NetworkNode,
  node2: NetworkNode,
  existingConnections?: NetworkConnection[],
): boolean => {
  // Don't connect node to itself
  if (node1.id === node2.id) return false;

  // Check if already connected by looking at both nodes' connections (bidirectional check)
  const alreadyConnectedInNodes =
    node1.connections.some((conn) => conn.from.id === node2.id || conn.to.id === node2.id) ||
    node2.connections.some((conn) => conn.from.id === node1.id || conn.to.id === node1.id);

  // Also check global connections list if provided (for more accurate checking)
  const alreadyConnectedInGlobal = existingConnections
    ? existingConnections.some(
        (conn) =>
          (conn.from.id === node1.id && conn.to.id === node2.id) ||
          (conn.from.id === node2.id && conn.to.id === node1.id),
      )
    : false;

  if (alreadyConnectedInNodes || alreadyConnectedInGlobal) {
    return false;
  }

  const hasRoomForConnection =
    node1.connections.length < LIMITS.maxConnectionsPerNode && node2.connections.length < LIMITS.maxConnectionsPerNode;

  if (!hasRoomForConnection) {
    return false;
  }

  return true;
};

// Keep the original name for backwards compatibility
export const shouldCreateConnection = (
  node1: NetworkNode,
  node2: NetworkNode,
  existingConnections: NetworkConnection[],
): boolean => isValidConnection(node1, node2, existingConnections);

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const createNodeId = (): string => {
  return `node_${generateId()}`;
};

export const createConnectionId = (): string => {
  return `connection_${generateId()}`;
};

export const getLineColor = (distance: number): string => {
  return distance < 4 ? COLORS.brightSand : COLORS.warmTan;
};

// Utility functions for the NetworkHero component

// Calculate optimized DPR based on device type and performance requirements
export const getOptimizedDPR = (): [number, number] => {
  if (typeof window === 'undefined') return [1, 2];

  const baseDevicePixelRatio = window.devicePixelRatio || 1;

  // if (isMobileDevice()) {
  //   // For mobile: reduce to 1/2 of current resolution
  //   // Current is [2, 3], so mobile gets [1, 1.5]
  //   return [Math.min(1.4, baseDevicePixelRatio * 0.7), Math.min(1.6, baseDevicePixelRatio * 0.8)];
  // }

  return [Math.min(1.5, baseDevicePixelRatio * 0.75), Math.min(2.25, baseDevicePixelRatio * 1.125)];
};

// Calculate optimized bloom resolution
export const getOptimizedBloomHeight = (): number => {
  if (typeof window === 'undefined') return 1536;

  // if (isMobileDevice()) {
  //   // For mobile: reduce to 1/2 of current resolution
  //   // Current is 2048, so mobile gets 1024
  //   return 1024;
  // }

  return 1536;
};

// Performance monitoring utilities
export const performanceMonitor = {
  frameCount: 0,
  lastTime: 0,
  fps: 0,

  update: () => {
    const now = performance.now();
    if (performanceMonitor.lastTime === 0) {
      performanceMonitor.lastTime = now;
      return;
    }

    performanceMonitor.frameCount++;
    const delta = now - performanceMonitor.lastTime;

    if (delta >= 1000) {
      // Update every second
      performanceMonitor.fps = Math.round((performanceMonitor.frameCount * 1000) / delta);
      performanceMonitor.frameCount = 0;
      performanceMonitor.lastTime = now;

      // Log performance issues
      if (performanceMonitor.fps < 30) {
        console.warn(`Low FPS detected: ${performanceMonitor.fps}fps`);
      }
    }
  },

  getFPS: () => performanceMonitor.fps,
};

// Object pooling for frequently created objects
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;

  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;

    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  acquire(): T {
    const obj = this.pool.pop();
    if (obj) {
      this.resetFn(obj);
      return obj;
    }
    return this.createFn();
  }

  release(obj: T): void {
    this.pool.push(obj);
  }

  getPoolSize(): number {
    return this.pool.length;
  }
}

// Pre-created object pools for common operations
export const vector3Pool = new ObjectPool(
  () => new THREE.Vector3(),
  (v) => v.set(0, 0, 0),
  50,
);

export const colorPool = new ObjectPool(
  () => new THREE.Color(),
  (c) => c.set(0, 0, 0),
  20,
);
