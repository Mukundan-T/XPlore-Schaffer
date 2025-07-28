/**
 * This module contains the wayfinding algorithm's logic, which finds the
 * shortest path from one location to another using the A* algorithm.
 */

// Import the graph structure which contains vertices and edges of the map
import { graphData, VertexData } from "@/store/graphData";

// Define a type alias for node IDs (for clarity)
type NodeId = string;

// Define the shape of a node in the priority queue
interface Node {
    id: NodeId;
    priority: number; // smaller priority = higher priority
}

// A simple priority queue using an array and sorting (inefficient for large graphs but fine here)
class PriorityQueue {
    values: Node[] = [];

    // Add a node with a given priority to the queue
    enqueue(id: NodeId, priority: number) {
        this.values.push({ id, priority });
        // Sort the queue so that the node with the lowest priority is at the front
        this.values.sort((a, b) => a.priority - b.priority);
    }

    // Remove and return the node with the highest priority (lowest number)
    dequeue() {
        return this.values.shift();
    }
}

// Main class to encapsulate the A* algorithm logic
class AStarCalculator {
    // The adjacency list maps node IDs to arrays of neighbor nodes and edge weights
    adjacencyList: { [key: NodeId]: { id: NodeId; weight: number }[] } = {};
    avoidStairs: boolean = false; // default to false

    // Add a new vertex to the adjacency list if not already present
    addVertex(vertex: NodeId) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }

    // Add an undirected edge between two vertices with a given weight
    addEdge(vertex1: NodeId, vertex2: NodeId, weight = 1) {
        this.adjacencyList[vertex1].push({ id: vertex2, weight });
        this.adjacencyList[vertex2].push({ id: vertex1, weight });
    }

    clear() {
        this.adjacencyList = {};
    }

    // Compute the shortest path between a start and finish node
    calculateShortestPath(start: NodeId, finish: NodeId): string[] {
        const nodes = new PriorityQueue(); // Queue for processing nodes by shortest tentative distance
        const distances: { [key: NodeId]: number } = {}; // Map of distances from start to each node
        const previous: { [key: NodeId]: NodeId | null } = {}; // Map to reconstruct path
        const path: string[] = []; // Final path to return

        let finishVertex = graphData.vertices.find(v => v.id === finish);

        // Initialize distances and fill the priority queue
        for (const vertex in this.adjacencyList) {
            distances[vertex] = vertex === start ? 0 : Infinity; // Distance to start = 0, else Infinity
            previous[vertex] = null;
            const vertexData = graphData.vertices.find(v => v.id === vertex);
            const h = vertexData && finishVertex ? heuristic(vertexData, finishVertex) : 0;
            const priority = distances[vertex] + h;
            nodes.enqueue(vertex, priority); // Add to the queue
        }

        // Main loop — process each node until the queue is empty
        while (nodes.values.length) {
            const next = nodes.dequeue(); // Get the next closest node
            if (!next) break;
            let current = next.id;

            // If we've reached the destination node, build the path
            if (current === finish) {
                while (previous[current]) {
                    path.push(current);
                    current = previous[current]!; // Move backward through previous nodes
                }
                path.push(start); // Add the start node
                break;
            }

            for (const neighbor of this.adjacencyList[current]) {
                const tentativeG = distances[current] + neighbor.weight;
                if (tentativeG < distances[neighbor.id]) {
                    distances[neighbor.id] = tentativeG;
                    previous[neighbor.id] = current;

                    const neighborData = graphData.vertices.find(v => v.id === neighbor.id);
                    const h = neighborData && finishVertex ? heuristic(neighborData, finishVertex) : 0;

                    nodes.enqueue(neighbor.id, tentativeG + h);
                }
            }
        }
        // Return the reversed path (from start to finish)
        return path.reverse();
    }
}

// Create an instance of the A*Calculator for use in navigation
export const graph = new AStarCalculator();

// Add all vertices from the dataset into the graph
graphData.vertices.forEach((vertex) => {
  graph.addVertex(vertex.id);
});

// Add edges to the graph, calculating the distance (weight) between the nodes
graphData.edges.forEach(({ from, to }) => {
  const fromVertex = graphData.vertices.find((v) => v.id === from);
  const toVertex = graphData.vertices.find((v) => v.id === to);

  // Skip edge if stairs are to be avoided
  const stairsInvolved =
    fromVertex?.objectName === "Stairs" || toVertex?.objectName === "Stairs";

  if (fromVertex && toVertex) {
    // Calculate actual spatial distance, including penalty if nodes are on different floors
    const length = heuristic(fromVertex, toVertex);
    if (!stairsInvolved || !graph.avoidStairs) {
      graph.addEdge(from, to, length);
    }
  }
});

// Helper function to compute Euclidean distance between two vertices,
// with an added penalty if the nodes are on different floors (to discourage cross-floor travel)
function heuristic(v1: VertexData, v2: VertexData): number {
  const dx = v2.cx - v1.cx; // horizontal distance
  const dy = v2.cy - v1.cy; // vertical distance
  const floorPenalty = v1.floor !== v2.floor ? 10000 : 0; // large cost to simulate elevator/stairs
  return Math.sqrt(dx * dx + dy * dy) + floorPenalty;
}

// Rebuild the graph depending on avoidStairs' state
export function rebuildGraph(avoidStairs: boolean) {
  graph.clear();
  graphData.vertices.forEach(v => graph.addVertex(v.id));

  graphData.edges.forEach(({ from, to }) => {
    const fromVertex = graphData.vertices.find((v) => v.id === from);
    const toVertex = graphData.vertices.find((v) => v.id === to);
    const stairsInvolved =
      fromVertex?.objectName === "Stairs" || toVertex?.objectName === "Stairs";

    if (fromVertex && toVertex && (!avoidStairs || !stairsInvolved)) {
      const weight = heuristic(fromVertex, toVertex);
      graph.addEdge(from, to, weight);
    }
  });
}