import * as THREE from 'three';
import { isValidConnection } from '../utils';
import { NetworkNode, NetworkConnection } from '../types';

describe('isValidConnection', () => {
  const createMockNode = (
    id: string,
    position: THREE.Vector3,
  ): NetworkNode => ({
    id,
    position,
    connections: [],
    createdAt: Date.now(),
    isRemoving: false,
    isSpawning: false,
    spawnStartTime: Date.now(),
  });

  const createMockConnection = (
    fromId: string,
    toId: string,
  ): NetworkConnection => {
    const fromNode = createMockNode(fromId, new THREE.Vector3(0, 0, 0));
    const toNode = createMockNode(toId, new THREE.Vector3(1, 1, 1));

    return {
      id: `connection_${fromId}_${toId}`,
      from: fromNode,
      to: toNode,
      createdAt: Date.now(),
      opacity: 0.8,
      isAnimating: true,
      animationProgress: 0,
    };
  };

  it('should prevent connections between the same node', () => {
    const node1 = createMockNode('node1', new THREE.Vector3(0, 0, 0));

    const result = isValidConnection(node1, node1);
    expect(result).toBe(false);
  });

  it('should prevent duplicate connections between two nodes', () => {
    const node1 = createMockNode('node1', new THREE.Vector3(0, 0, 0));
    const node2 = createMockNode('node2', new THREE.Vector3(1, 1, 1));

    const existingConnection = createMockConnection('node1', 'node2');

    // Add connection to node1's connections array (simulating existing connection)
    node1.connections.push(existingConnection);

    // Should prevent duplicate connection from node1 to node2
    const result1 = isValidConnection(node1, node2);
    expect(result1).toBe(false);

    // Create fresh nodes for bidirectional test
    const node3 = createMockNode('node3', new THREE.Vector3(0, 0, 0));
    const node4 = createMockNode('node4', new THREE.Vector3(1, 1, 1));
    const connection2 = createMockConnection('node3', 'node4');

    // Add connection to node4's connections array (reverse direction)
    node4.connections.push(connection2);

    // Should also prevent duplicate connection from node3 to node4 (bidirectional check)
    const result2 = isValidConnection(node3, node4);
    expect(result2).toBe(false);
  });

  it('should allow valid connections between different nodes', () => {
    const node1 = createMockNode('node1', new THREE.Vector3(0, 0, 0));
    const node2 = createMockNode('node2', new THREE.Vector3(1, 1, 1));

    // Existing connection between node1 and node3
    const existingConnection = createMockConnection('node1', 'node3');
    node1.connections.push(existingConnection);

    // Should allow new connection between node1 and node2
    const result = isValidConnection(node1, node2);
    expect(result).toBe(true);
  });
});
