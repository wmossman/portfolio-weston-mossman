// Constants for the NetworkHero component
export const COLORS = {
  background: '#0F1717',
  brightSand: '#FFD0B0',
  warmTan: '#D9B08C',
  fadedTurquoise: '#84C3B2',
  white: '#FFFFFF',
} as const;

export const TIMING = {
  nodeCreationInterval: 600,
  connectionAttemptInterval: 150,
  spawnCoreDuration: 500,
  spawnParticleDuration: 800,
  nodeMaxAge: 25000,
  nodeFadeDuration: 12500,
} as const;

export const LIMITS = {
  maxConnections: 160,
  maxNodes: 50,
  maxConnectionsPerNode: 8,
  particleCount: 60,
  burstParticleCount: 60,
  defaultMaxDistance: 7,
} as const;

export const SIZES = {
  nodeRadius: 0.2,
  tubeRadius: 0.024,
  glowTubeMultiplier: 4.0,
  particleSize: 0.02,
  burstParticleSize: 0.06,
} as const;

export const CAMERA_CONFIG = {
  fov: 66.5,
  near: 0.1,
  far: 1000,
  position: [0, 0, 30] as [number, number, number],
} as const;

export const ANIMATION_CONFIG = {
  connectionSpeed: 0.015,
  particleSpeed: 0.005,
  pulseSpeed: 0.012,
  cameraTime: 0.0003 * 0.25,
  cameraInfluence: 7.0,
  lerpFactor: 0.03,
  maxAcceleration: 0.005,
  acceleration: 0.008,
  friction: 0.9,
  particleTrailSpacing: 0.05,
  newNodeConnectionProbability: 0.7,
  randomConnectionProbability: 0.5,
  midLifeConnectionProbability: 0.3,
} as const;
