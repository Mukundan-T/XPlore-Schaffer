/**
 * This module constructs all the edges connecting the vertices for the floor being viewed on
 * the screen (aka the paths).
 */

import { useFloor } from "@/context/FloorContext";
import { useContext } from "react";
import { NavigationContext } from "@/pages/Map";
import { graphData } from "@/store/graphData";

function Paths() {
  // Get the currently selected floor from context
  const { currentFloor } = useFloor();

  // Get the navigation context (includes navigation state)
  const navContext = useContext(NavigationContext);

  // If context is not yet initialized (e.g., loading), return nothing
  if (!navContext) return null;

  // Destructure floorPaths from navigation state
  const { floorPaths } = navContext.navigation;

  return (
    // Group all edges and navigation paths under an SVG group element
    <g id="Edges">
      {/* Render static graph edges (floor map layout) only for the current floor */}
      {graphData.edges.map((edge) => {
        const { id, from, to, floor } = edge;

        // Find vertex coordinates for the start and end of the edge
        const fromVertex = graphData.vertices.find((v) => v.id === from);
        const toVertex = graphData.vertices.find((v) => v.id === to);

        // Skip if either vertex was not found in the graph data
        if (!fromVertex || !toVertex) return null;

        // Skip rendering this edge if it's not on the current floor
        if (floor !== currentFloor) return null;

        // Construct an SVG "move-to" and "line-to" path command between the two vertices
        const pathD = `M${fromVertex.cx} ${fromVertex.cy}L${toVertex.cx} ${toVertex.cy}`;

        // Return a <path> SVG element for the edge
        return <path key={id} id={id} className="path" d={pathD} />;
      })}

      {/* Render the dynamic navigation path, if any, for the current floor */}
      <path
        id="navigation-route"                          // ID to manipulate via JS if needed
        className="path"                                // Styling class for animations/colors
        d={floorPaths?.[currentFloor] || ""}            // Draw only the path for this floor
        fill="none"                                     // No fill; just stroke/line
      />
    </g>
  );
}

export default Paths;