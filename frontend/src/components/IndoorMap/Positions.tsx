/**
 * This module figures out all the displaying and hiding of all of the different start positions
 * on the maps. 
 * 
 * If the "Edit Position" button is toggled, all of the vertices with an object
 * name of null will be displayed as small circles that can be clicked to switch the start
 * position. 
 * 
 * This module also animates the current start location (the blue dot).
 */

import { graphData } from "@/store/graphData";
import { NavigationContextType } from "@/utils/types";
import { useFloor } from "@/context/FloorContext";

interface PositionsProps {
  positionRadius: number;
  handlePositionClick: (e: React.MouseEvent<SVGPathElement>) => void;
  className: string;
  navigation?: NavigationContextType["navigation"];
}

function Positions({
  positionRadius,
  handlePositionClick,
  className,
  navigation,
}: PositionsProps) {
  const { currentFloor } = useFloor();

  const positionBackgroundColor = "#4285f4";
  const positionBackgroundRadius = positionRadius + 7;
  const positonBackgroundOpacity = 0.2;

  // Find the start vertex (must also be on this floor)
  const startVertex = graphData.vertices.find(
    (v) => v.id === navigation?.start && v.floor === currentFloor
  );

  function isActivePosition(vertexId: string) {
    return navigation?.start === vertexId;
  }

  // Filter vertices to current floor
  const visibleVertices = graphData.vertices.filter(
    (vertex) => vertex.floor === currentFloor
  );

  return (
    <g id="Vertexes">
      {/* Background circle for current position */}
      {startVertex && (
        <circle
          id="background-circle"
          cx={startVertex.cx}
          cy={startVertex.cy}
          fill={positionBackgroundColor}
          opacity={positonBackgroundOpacity}
          r={positionBackgroundRadius}
        />
      )}

      {visibleVertices.map((vertex) => (
        <circle
          onClick={vertex.objectName ? () => {} : handlePositionClick}
          key={vertex.id}
          id={vertex.id}
          className={`position ${vertex.objectName ? "opacity-0" : className} 
                    ${isActivePosition(vertex.id) ? "position-active opacity-100" : ""}`}
          cx={vertex.cx}
          cy={vertex.cy}
          r={positionRadius}
        />
      ))}

      {/* Pulse animation for start position */}
      {startVertex && (
        <circle
          id="circle-animation"
          cx={startVertex.cx}
          cy={startVertex.cy}
          fill="none"
          stroke="white"
          strokeWidth={2}
          r={positionRadius}
        >
          <animate
            attributeName="stroke-width"
            values="1;3;1"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
}

export default Positions;