import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
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

export const useNetworkStore = create<NetworkState>()(
  subscribeWithSelector((set, _get) => ({
    nodes: [],
    connections: [],
    mouse: { x: 0, y: 0 },
    trackingPoint: { x: 0, y: 0, vx: 0, vy: 0 },
    isWaitingForEdgeReduction: false,

    addNode: (node) =>
      set((state) => {
        // Check for duplicate nodes before adding - performance optimized
        const existingNodeIndex = state.nodes.findIndex((n) => n.id === node.id);
        if (existingNodeIndex !== -1) {
          return state; // Don't add duplicate
        }

        return {
          nodes: [...state.nodes, node],
        };
      }),

    removeNode: (nodeId) =>
      set((state) => {
        // Use more efficient filtering
        const nodeIndex = state.nodes.findIndex((n) => n.id === nodeId);
        if (nodeIndex === -1) return state;

        const newNodes = state.nodes.filter((n) => n.id !== nodeId);
        const newConnections = state.connections.filter((conn) => conn.from.id !== nodeId && conn.to.id !== nodeId);

        return {
          nodes: newNodes,
          connections: newConnections,
        };
      }),

    updateNode: (nodeId, updates) =>
      set((state) => {
        // Use map with early return for better performance
        const nodeIndex = state.nodes.findIndex((node) => node.id === nodeId);
        if (nodeIndex === -1) return state;

        const newNodes = [...state.nodes];
        newNodes[nodeIndex] = { ...newNodes[nodeIndex], ...updates };

        return {
          nodes: newNodes,
        };
      }),

    addConnection: (connection) =>
      set((state) => ({
        connections: [...state.connections, connection],
      })),

    removeConnection: (connectionId) =>
      set((state) => {
        const connectionIndex = state.connections.findIndex((c) => c.id === connectionId);
        if (connectionIndex === -1) return state;

        return {
          connections: state.connections.filter((c) => c.id !== connectionId),
        };
      }),

    updateConnection: (connectionId, updates) =>
      set((state) => {
        const connectionIndex = state.connections.findIndex((conn) => conn.id === connectionId);
        if (connectionIndex === -1) return state;

        const newConnections = [...state.connections];
        newConnections[connectionIndex] = { ...newConnections[connectionIndex], ...updates };

        return {
          connections: newConnections,
        };
      }),

    setMouse: (mouse) => set({ mouse }),
    setTrackingPoint: (trackingPoint) => set({ trackingPoint }),
    setIsWaitingForEdgeReduction: (waiting) => set({ isWaitingForEdgeReduction: waiting }),

    clearAll: () =>
      set({
        nodes: [],
        connections: [],
        isWaitingForEdgeReduction: false,
      }),

    // Cleanup method to remove duplicate nodes - optimized for performance
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

        // Also clean connections that reference removed nodes - optimized
        const validNodeIds = new Set(cleanedNodes.map((n) => n.id));
        const cleanedConnections = state.connections.filter(
          (conn) => validNodeIds.has(conn.from.id) && validNodeIds.has(conn.to.id),
        );

        // Only update if changes were made
        if (duplicatesRemoved.length === 0 && cleanedConnections.length === state.connections.length) {
          return state;
        }

        return {
          nodes: cleanedNodes,
          connections: cleanedConnections,
        };
      }),
  })),
);
