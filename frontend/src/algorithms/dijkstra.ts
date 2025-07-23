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

// Main class to encapsulate Dijkstra’s algorithm logic
class DijkstraCalculator {
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
    let smallest: NodeId | null = null;

    // Initialize distances and fill the priority queue
    for (const vertex in this.adjacencyList) {
      distances[vertex] = vertex === start ? 0 : Infinity; // Distance to start = 0, else Infinity
      previous[vertex] = null;
      nodes.enqueue(vertex, distances[vertex]); // Add to the queue
    }

    // Main loop — process each node until the queue is empty
    while (nodes.values.length) {
      const next = nodes.dequeue(); // Get the next closest node
      if (!next) break;
      smallest = next.id;

      // If we've reached the destination node, build the path
      if (smallest === finish) {
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest]!; // Move backward through previous nodes
        }
        path.push(start); // Add the start node
        break;
      }

      // Only continue if the node is reachable
      if (distances[smallest] !== Infinity) {
        for (const neighbor of this.adjacencyList[smallest]) {
          const candidate = distances[smallest] + neighbor.weight; // Compute new tentative distance
          if (candidate < distances[neighbor.id]) {
            // If shorter path found:
            distances[neighbor.id] = candidate;
            previous[neighbor.id] = smallest;
            nodes.enqueue(neighbor.id, candidate); // Re-add neighbor with updated priority
          }
        }
      }
    }

    // Return the reversed path (from start to finish)
    return path.reverse();
  }
}

// Create an instance of the DijkstraCalculator for use in navigation
export const graph = new DijkstraCalculator();

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
    const length = calculateDistance(fromVertex, toVertex);
    if (!stairsInvolved || !graph.avoidStairs) {
      graph.addEdge(from, to, length);
    }
    //graph.addEdge(from, to, length); // Add edge with calculated weight
  }
});

// Helper function to compute Euclidean distance between two vertices,
// with an added penalty if the nodes are on different floors (to discourage cross-floor travel)
function calculateDistance(v1: VertexData, v2: VertexData): number {
  const dx = v2.cx - v1.cx; // horizontal distance
  const dy = v2.cy - v1.cy; // vertical distance
  const floorPenalty = v1.floor !== v2.floor ? 10000 : 0; // large cost to simulate elevator/stairs
  return Math.sqrt(dx * dx + dy * dy) + floorPenalty;
}

// NEW
export function rebuildGraph(avoidStairs: boolean) {
  graph.clear(); // You’ll need to implement this if it doesn’t exist
  graphData.vertices.forEach(v => graph.addVertex(v.id));

  graphData.edges.forEach(({ from, to }) => {
    const fromVertex = graphData.vertices.find((v) => v.id === from);
    const toVertex = graphData.vertices.find((v) => v.id === to);
    const stairsInvolved =
      fromVertex?.objectName === "Stairs" || toVertex?.objectName === "Stairs";

    if (fromVertex && toVertex && (!avoidStairs || !stairsInvolved)) {
      const weight = calculateDistance(fromVertex, toVertex);
      graph.addEdge(from, to, weight);
    }
  });
}