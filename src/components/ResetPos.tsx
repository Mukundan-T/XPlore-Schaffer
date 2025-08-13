/**
 * Resets the position to the default start location as specified in the URL.
 */

import { MdMyLocation } from "react-icons/md";
import Tooltip from "./ui/Tooltip";
import { NavigationContext } from "@/pages/Map";
import { NavigationContextType } from "@/utils/types";
import { useContext } from "react";
import { resetEdges } from "@/utils/navigationHelper";
import { getDefaultLocation } from "@/store/defaultPosition";
import { useFloor } from "@/context/FloorContext";
import { graphData } from "@/store/graphData";

function ResetPos() {
    const { setNavigation } = useContext(NavigationContext) as NavigationContextType;
    const { currentFloor, setCurrentFloor } = useFloor();
    
    function resetToDefaultPosition() {
      const defaultStart = "v199";
      const startPos = getDefaultLocation();
      let currentVertex = graphData.vertices.find((v) => v.id === startPos);
      let newStartFloor = currentVertex?.floor || currentFloor;

      setCurrentFloor(newStartFloor)
      resetEdges(setNavigation);
      setNavigation({
      start: startPos || defaultStart,
      end: "",
      avoidStairs: false,
      floorPaths: {},
      });
    }

  return (
    <Tooltip content="Reset Position" className="bg-blue-500">
      <button
        data-tooltip-target="tooltip-default"
        className="ml-1 h-12 w-12 bg-blue-500 center rounded text-white"
        onClick={resetToDefaultPosition}
        aria-label="reset position"
      >
        <MdMyLocation size={22} />
      </button>
    </Tooltip>
  );
}

export default ResetPos;