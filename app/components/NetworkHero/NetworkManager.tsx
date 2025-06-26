import React, { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { TIMING, LIMITS, ANIMATION_CONFIG } from './constants';
import { useNetworkStore } from './store';
import {
  generateRandomPosition,
  findNearbyNodes,
  isValidConnection,
  createNodeId,
  createConnectionId,
} from './utils';
import { NetworkNode, NetworkConnection } from './types';

export const NetworkManager: React.FC = () => {
  const lastNodeCreationRef = useRef(0);
  const lastConnectionAttemptRef = useRef(0);
  const lastCleanupRef = useRef(0);
  const frameConnectionsRef = useRef<NetworkConnection[]>([]);

  const {
    nodes,
    connections,
    isWaitingForEdgeReduction,
    addNode,
    removeNode,
    updateNode,
    addConnection,
    removeConnection,
    setIsWaitingForEdgeReduction,
    removeDuplicateNodes,
  } = useNetworkStore();

  // Helper to check if connection is valid with frame-level tracking
  const isValidConnectionWithFrameTracking = useCallback(
    (node1: NetworkNode, node2: NetworkNode): boolean => {
      // Combine global connections with frame-local connections for validation
      const allConnections = [...connections, ...frameConnectionsRef.current];
      return isValidConnection(node1, node2, allConnections);
    },
    [connections],
  );

  const createNewNode = useCallback(() => {
    const now = Date.now();
    if (now - lastNodeCreationRef.current < TIMING.nodeCreationInterval) return;
    if (nodes.length >= LIMITS.maxNodes) return;

    const position = generateRandomPosition(nodes);

    const node: NetworkNode = {
      id: createNodeId(),
      position,
      connections: [],
      createdAt: now,
      isRemoving: false,
      isSpawning: true,
      spawnStartTime: now,
    };

    addNode(node);
    lastNodeCreationRef.current = now;

    // Try to connect to nearby nodes (matching original logic)
    if (connections.length < LIMITS.maxConnections) {
      const nearbyNodes = findNearbyNodes(position, nodes);
      let currentConnectionCount = connections.length;

      // Process connections one at a time to avoid race conditions
      for (const nearbyNode of nearbyNodes) {
        // Check current connection count to respect limits
        if (currentConnectionCount >= LIMITS.maxConnections) break;

        if (
          !nearbyNode.isRemoving &&
          isValidConnectionWithFrameTracking(node, nearbyNode) &&
          Math.random() < ANIMATION_CONFIG.newNodeConnectionProbability
        ) {
          const connection: NetworkConnection = {
            id: createConnectionId(),
            from: node,
            to: nearbyNode,
            createdAt: now,
            opacity: 0.8,
            isAnimating: true,
            animationProgress: 0,
          };

          // Add to store first
          addConnection(connection);

          // Track in frame-local list to prevent duplicates within the same frame
          frameConnectionsRef.current.push(connection);

          // Update node connections through store to maintain consistency
          updateNode(node.id, {
            connections: [...node.connections, connection],
          });
          updateNode(nearbyNode.id, {
            connections: [...nearbyNode.connections, connection],
          });

          // Increment local count to prevent duplicate connections in same loop
          currentConnectionCount++;
        }
      }
    }
  }, [
    connections.length,
    nodes,
    addNode,
    addConnection,
    updateNode,
    isValidConnectionWithFrameTracking,
  ]);

  const attemptConnections = useCallback(() => {
    const now = Date.now();
    if (
      now - lastConnectionAttemptRef.current <
      TIMING.connectionAttemptInterval
    )
      return;
    if (
      connections.length >= LIMITS.maxConnections ||
      isWaitingForEdgeReduction
    )
      return;

    const availableNodes = nodes.filter(
      (node) =>
        !node.isRemoving &&
        !node.isSpawning &&
        node.connections.length < LIMITS.maxConnectionsPerNode,
    );

    if (availableNodes.length < 2) return;

    // Match original: pick random node, find nearby nodes with distance 6, pick random nearby
    const fromNode =
      availableNodes[Math.floor(Math.random() * availableNodes.length)];
    const nearbyNodes = findNearbyNodes(fromNode.position, availableNodes, 6);

    if (nearbyNodes.length > 0) {
      const toNode =
        nearbyNodes[Math.floor(Math.random() * nearbyNodes.length)];

      // Match original: 50% probability and additional checks
      if (
        !toNode.isRemoving &&
        isValidConnectionWithFrameTracking(fromNode, toNode) &&
        Math.random() < ANIMATION_CONFIG.randomConnectionProbability
      ) {
        const connection: NetworkConnection = {
          id: createConnectionId(),
          from: fromNode,
          to: toNode,
          createdAt: now,
          opacity: 0.8,
          isAnimating: true,
          animationProgress: 0,
        };

        addConnection(connection);
        lastConnectionAttemptRef.current = now;

        // Track in frame-local list to prevent duplicates within the same frame
        frameConnectionsRef.current.push(connection);

        // Update node connections through store to maintain consistency
        updateNode(fromNode.id, {
          connections: [...fromNode.connections, connection],
        });
        updateNode(toNode.id, {
          connections: [...toNode.connections, connection],
        });
      }
    }
  }, [
    connections.length,
    isWaitingForEdgeReduction,
    nodes,
    addConnection,
    updateNode,
    isValidConnectionWithFrameTracking,
  ]);

  const updateAnimations = useCallback(() => {
    const now = Date.now();

    // Update node animations
    nodes.forEach((node) => {
      let needsUpdate = false;
      const updates: Partial<NetworkNode> = {};

      // Handle spawning animation
      if (node.isSpawning) {
        const spawnProgress =
          (now - node.spawnStartTime) / TIMING.spawnCoreDuration;
        if (spawnProgress >= 1) {
          updates.isSpawning = false;
          needsUpdate = true;
        }
      }

      // Handle aging and fading - match original timing
      const age = now - node.createdAt;
      const nodeFadeStartAge = TIMING.nodeMaxAge / 2; // Start fading at half lifetime

      if (age > nodeFadeStartAge && !node.isRemoving) {
        updates.isRemoving = true;
        updates.fadeStartTime = now;
        needsUpdate = true;
      }

      // Handle removal
      if (node.isRemoving && node.fadeStartTime) {
        const fadeProgress =
          (now - node.fadeStartTime) / TIMING.nodeFadeDuration;
        if (fadeProgress >= 1) {
          // Remove all connections for this node
          node.connections.forEach((conn) => {
            removeConnection(conn.id);
          });
          removeNode(node.id);
          return;
        }
      }

      if (needsUpdate) {
        updateNode(node.id, updates);
      }
    });

    // Mid-life edge generation: at 1/3 of node lifetime, attempt additional connections
    let currentConnectionCount = connections.length;

    nodes.forEach((node) => {
      if (!node.isRemoving && currentConnectionCount < LIMITS.maxConnections) {
        const age = now - node.createdAt;
        const midLifePoint = TIMING.nodeMaxAge / 3;
        const connectionWindow = 2000;

        // Check if node is in its mid-life connection window
        if (age >= midLifePoint && age <= midLifePoint + connectionWindow) {
          const nearbyNodes = findNearbyNodes(node.position, nodes, 8);

          // Process connections one at a time to avoid race conditions
          for (const nearbyNode of nearbyNodes) {
            // Check current connection count to respect limits
            if (currentConnectionCount >= LIMITS.maxConnections) break;

            if (
              !nearbyNode.isRemoving &&
              isValidConnectionWithFrameTracking(node, nearbyNode) &&
              Math.random() < ANIMATION_CONFIG.midLifeConnectionProbability
            ) {
              const connection: NetworkConnection = {
                id: createConnectionId(),
                from: node,
                to: nearbyNode,
                createdAt: now,
                opacity: 0.8,
                isAnimating: true,
                animationProgress: 0,
              };

              // Add to store first
              addConnection(connection);

              // Track in frame-local list to prevent duplicates within the same frame
              frameConnectionsRef.current.push(connection);

              // Update node connections through store to maintain consistency
              updateNode(node.id, {
                connections: [...node.connections, connection],
              });
              updateNode(nearbyNode.id, {
                connections: [...nearbyNode.connections, connection],
              });

              // Increment local count to prevent duplicate connections
              currentConnectionCount++;
            }
          }
        }
      }
    });

    // Update connection animations
    // Note: Animation progress is handled in Connection.tsx component
    // This is just for cleanup of completed connections
    connections.forEach((connection) => {
      // Remove connections whose nodes are both fading or removed
      const fromNodeExists = nodes.find((n) => n.id === connection.from.id);
      const toNodeExists = nodes.find((n) => n.id === connection.to.id);

      if (!fromNodeExists || !toNodeExists) {
        removeConnection(connection.id);
        return;
      }

      // Handle connection fade-out based on node states
      const fromNode = fromNodeExists;
      const toNode = toNodeExists;

      if (
        (fromNode.isRemoving && fromNode.fadeStartTime) ||
        (toNode.isRemoving && toNode.fadeStartTime)
      ) {
        let fromFadeMultiplier = 1;
        let toFadeMultiplier = 1;

        if (fromNode.isRemoving && fromNode.fadeStartTime) {
          const fadeAge = now - fromNode.fadeStartTime;
          fromFadeMultiplier = Math.max(
            0,
            1 - fadeAge / TIMING.nodeFadeDuration,
          );
        }

        if (toNode.isRemoving && toNode.fadeStartTime) {
          const fadeAge = now - toNode.fadeStartTime;
          toFadeMultiplier = Math.max(0, 1 - fadeAge / TIMING.nodeFadeDuration);
        }

        const connectionOpacity = Math.min(
          fromFadeMultiplier,
          toFadeMultiplier,
        );

        if (connectionOpacity <= 0) {
          removeConnection(connection.id);
        }
      }
    });

    // Manage connection count with proper threshold logic like original
    const currentEdgeCount = connections.length;
    const resumeThreshold = 10;

    // Check edge count and manage waiting state (matches original)
    if (
      currentEdgeCount >= LIMITS.maxConnections &&
      !isWaitingForEdgeReduction
    ) {
      setIsWaitingForEdgeReduction(true);
    }

    // If we're waiting and edges have reduced enough, resume
    if (
      isWaitingForEdgeReduction &&
      currentEdgeCount <= LIMITS.maxConnections - resumeThreshold
    ) {
      setIsWaitingForEdgeReduction(false);
    }
  }, [
    nodes,
    connections,
    isWaitingForEdgeReduction,
    updateNode,
    removeNode,
    removeConnection,
    setIsWaitingForEdgeReduction,
    addConnection,
    isValidConnectionWithFrameTracking,
  ]);

  useFrame(() => {
    // Reset frame-local connection tracking at the start of each frame
    frameConnectionsRef.current = [];

    // Always update animations for smooth visual feedback
    updateAnimations();

    // Run node creation and connection logic with time-based checks (not frame-based)
    createNewNode(); // Has its own timing check inside using Date.now()
    attemptConnections(); // Has its own timing check inside using Date.now()

    // Periodic cleanup of duplicate nodes (every 5 seconds)
    const now = Date.now();
    if (now - lastCleanupRef.current > 5000) {
      removeDuplicateNodes();
      lastCleanupRef.current = now;
    }
  });

  return null;
};
