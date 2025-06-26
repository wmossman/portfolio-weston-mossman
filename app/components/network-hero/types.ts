import * as THREE from 'three';

export interface NetworkNode {
  id: string;
  position: THREE.Vector3;
  connections: NetworkConnection[];
  createdAt: number;
  mesh?: THREE.Mesh;
  isRemoving: boolean;
  fadeStartTime?: number;
  isSpawning: boolean;
  spawnStartTime: number;
}

export interface NetworkConnection {
  id: string;
  from: NetworkNode;
  to: NetworkNode;
  createdAt: number;
  opacity: number;
  isAnimating: boolean;
  animationProgress: number;
}

export interface SpawnParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

export interface MouseData {
  x: number;
  y: number;
}

export interface TrackingPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
}
