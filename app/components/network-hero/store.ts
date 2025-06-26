import { create } from 'zustand';
import { NetworkNode, NetworkConnection, MouseData, TrackingPoint } from './types';

interface NetworkState {
  nodes: NetworkNode[];
  connections: NetworkConnection[];
  mouse: MouseData;
  trackingPoint: TrackingPoint;
  isWaitingForEdgeReduction: boolean;

  // Actions
  addNode: (node: NetworkNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<NetworkNode>) => void;

  addConnection: (connection: NetworkConnection) => void;
  removeConnection: (connectionId: string) => void;
  updateConnection: (connectionId: string, updates: Partial<NetworkConnection>) => void;

  setMouse: (mouse: MouseData) => void;
  setTrackingPoint: (trackingPoint: TrackingPoint) => void;
  setIsWaitingForEdgeReduction: (waiting: boolean) => void;

  clearAll: () => void;

  // Cleanup method to remove duplicate nodes
  removeDuplicateNodes: () => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  nodes: [],
  connections: [],
  mouse: { x: 0, y: 0 },
  trackingPoint: { x: 0, y: 0, vx: 0, vy: 0 },
  isWaitingForEdgeReduction: false,

  addNode: (node) =>
    set((state) => {
      // Check for duplicate nodes before adding
      const existingNode = state.nodes.find((n) => n.id === node.id);
      if (existingNode) {
        return state; // Don't add duplicate
      }

      return {
        nodes: [...state.nodes, node],
      };
    }),

  removeNode: (nodeId) =>
    set((state) => {
      return {
        nodes: state.nodes.filter((n) => n.id !== nodeId),
        connections: state.connections.filter((conn) => conn.from.id !== nodeId && conn.to.id !== nodeId),
      };
    }),

  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)),
    })),

  addConnection: (connection) =>
    set((state) => ({
      connections: [...state.connections, connection],
    })),

  removeConnection: (connectionId) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== connectionId),
    })),

  updateConnection: (connectionId, updates) =>
    set((state) => ({
      connections: state.connections.map((conn) => (conn.id === connectionId ? { ...conn, ...updates } : conn)),
    })),

  setMouse: (mouse) => set({ mouse }),
  setTrackingPoint: (trackingPoint) => set({ trackingPoint }),
  setIsWaitingForEdgeReduction: (waiting) => set({ isWaitingForEdgeReduction: waiting }),

  clearAll: () =>
    set({
      nodes: [],
      connections: [],
      isWaitingForEdgeReduction: false,
    }),

  // Cleanup method to remove duplicate nodes
  removeDuplicateNodes: () =>
    set((state) => {
      const uniqueNodes = new Map<string, NetworkNode>();
      const duplicatesRemoved: string[] = [];

      state.nodes.forEach((node) => {
        if (uniqueNodes.has(node.id)) {
          duplicatesRemoved.push(node.id);
        } else {
          uniqueNodes.set(node.id, node);
        }
      });

      const cleanedNodes = Array.from(uniqueNodes.values());

      // Also clean connections that reference removed nodes
      const validNodeIds = new Set(cleanedNodes.map((n) => n.id));
      const cleanedConnections = state.connections.filter(
        (conn) => validNodeIds.has(conn.from.id) && validNodeIds.has(conn.to.id),
      );

      return {
        nodes: cleanedNodes,
        connections: cleanedConnections,
      };
    }),
}));
