import { Dispatch, SetStateAction } from "react";
import { graph } from "../algorithms/dijkstra";
import { Navigation, NavigationContextType } from "./types";
import { ObjectItem } from "./types";
import { graphData } from "@/store/graphData";
import { toast } from "react-toastify";
import { rebuildGraph } from "@/algorithms/dijkstra";
import { showFloorSwitchToast } from "./showFloorSwitchToast";
export let routeLength = 0;

// Finds a vertex in the graph that corresponds to a given object name.
const findVertexByObjectId = (vertexId: string) =>
  graphData.vertices.find((v) => v.objectName === vertexId);

// Main navigation function. Finds and renders the path to a selected object.
export function navigateToObject(
  selectedObjectId: string, // name of the destination object
  navigation: NavigationContextType["navigation"], // current navigation state
  setNavigation: NavigationContextType["setNavigation"], // setter for navigation state
  setCurrentFloor: (floor: string) => void // New parameter
) {
  // Find the target vertex based on the object's name
  const target = findVertexByObjectId(selectedObjectId);
  if (!target) {
    console.error("Target not found");
    toast.error("Authorized access only, please ask the Library Service Desk");
    return;
  }

  graph.avoidStairs = navigation.avoidStairs ?? false;
  rebuildGraph(graph.avoidStairs);

  // Calculate the shortest path from current start to target using Dijkstra
  const shortestPath = graph.calculateShortestPath(navigation.start, target.id);

  // Locate the starting vertex
  const startVertex = graphData.vertices.find((v) => v.id === navigation.start);
  if (!startVertex) return;

  // Object to store individual path segments for each floor
  const perFloorPaths: Record<string, string> = {};

  // Start building path segment from the start vertex
  let currentFloor = startVertex.floor;
  let pathSegment = `M${startVertex.cx} ${startVertex.cy}`; // SVG "move to" command

  // Loop through the path and construct SVG path strings floor by floor
  for (let i = 1; i < shortestPath.length; i++) {
    const prevVertex = graphData.vertices.find(v => v.id === shortestPath[i - 1]);
    const currVertex = graphData.vertices.find(v => v.id === shortestPath[i]);
    if (!prevVertex || !currVertex) continue;

    // If the current vertex is on a different floor, start a new path segment
    if (currVertex.floor !== currentFloor) {
      // Toast to notify floor change
      showFloorSwitchToast(currVertex.floor, setCurrentFloor); // show button toast
      // Save the completed path for the current floor
      perFloorPaths[currentFloor] = pathSegment;
      
      // Start a new path segment for the next floor
      pathSegment = `M${currVertex.cx} ${currVertex.cy}`;
      currentFloor = currVertex.floor;
    } else {
      // No floor change — continue appending normally
      pathSegment += ` L${currVertex.cx} ${currVertex.cy}`;
    }

  }

  // Save the final floor segment
  perFloorPaths[currentFloor] = pathSegment;

  // Update the SVG path element on screen for the current floor.
  // Note: This assumes the currently visible floor matches `currentFloor`.
  // In practice, you should retrieve current floor from context instead.
  const navigationRoutePath = document.getElementById("navigation-route");
  const current = currentFloor; // Replace with: const { currentFloor } = useFloor();
  if (navigationRoutePath && perFloorPaths[current]) {
    // Apply path string to the <path> element
    navigationRoutePath.setAttribute("d", perFloorPaths[current]);

    // Trigger animation effects
    navigationRoutePath.classList.remove("path-once", "path-active");
    navigationRoutePath.classList.add("path-once");

    // After animation completes, mark the path as persistent
    navigationRoutePath.addEventListener(
      "animationend",
      () => {
        navigationRoutePath.classList.remove("path-once");
        navigationRoutePath.classList.add("path-active");
      },
      { once: true }
    );
  }

  // Update global navigation state with the full route and segmented paths
  setNavigation((prevNavigation) => ({
    ...prevNavigation,
    end: selectedObjectId,
    floorPaths: perFloorPaths
  }));
}

/**
 * Clears all visible navigation paths and removes path highlighting.
 * Also clears `floorPaths` from navigation state to avoid stale data reuse.
 */
export function resetEdges(
  setNavigation?: Dispatch<SetStateAction<Navigation>>
) {
  // Clear all navigation-route paths across the DOM
  const allRoutes = document.querySelectorAll<SVGPathElement>("#navigation-route");
  allRoutes.forEach((path) => {
    path.setAttribute("d", "");
    path.classList.remove("path-active", "path-once");
  });

  // Remove active classes from static edge paths
  graphData.edges.forEach((edge) => {
    const element = document.getElementById(edge.id);
    if (element) {
      element.classList.remove("path-active", "path-once");
    }
  });

  // Reset navigation.floorPaths so next navigation is clean
  if (setNavigation) {
    setNavigation((prev) => ({
      ...prev,
      end: "", // optionally also reset end
      floorPaths: {}, // clear stale paths
    }));
  }
}

/**
 * Optional helper to navigate through multiple destinations
 * one by one with a timed delay between each.
 */
export function navigateWithDelay(
  objects: ObjectItem[], // array of destinations to visit
  index: number, // current index in the sequence
  delay: number, // delay between steps in milliseconds
  navigation: Navigation, // current navigation state
  setNavigation: Dispatch<SetStateAction<Navigation>>, // setter for navigation state
  setCurrentFloor: (floor: string) => void // Added
) {
  // Base case: stop when all destinations are visited
  if (index < objects.length) {
    const obj = objects[index];

    // Navigate to current object
    navigateToObject(obj.name, navigation, setNavigation, setCurrentFloor);

    // Schedule the next navigation step
    setTimeout(() => {
      navigateWithDelay(objects, index + 1, delay, navigation, setNavigation, setCurrentFloor);
    }, delay);
  }
}