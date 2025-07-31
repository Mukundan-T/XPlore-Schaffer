/**
 * Implements a checkbox for avoiding stairs on the toolbar. When toggled, the route will
 * only choose elevators to traverse different floors.
 */

import { useContext } from "react";
import { NavigationContext } from "@/pages/Map";
import { NavigationContextType } from "@/utils/types";
import { toast } from "react-toastify";

/**
 * Checkbox for toggling the "Avoid Stairs" navigation option.
 * Updates the global navigation context when toggled.
 */
function AvoidStairs() {
  const { navigation, setNavigation } = useContext(NavigationContext) as NavigationContextType;

  const handleToggle = () => {
    toast.dismiss();
    setNavigation((prev) => ({
      ...prev,
      avoidStairs: !prev.avoidStairs,
      end: "",             // Clear any existing destination
      floorPaths: {},      // Clear previous path drawings
    }));
  };

  return (
    <div className="px-3 py-3.5 border border-gray-200 rounded bg-white flex items-center space-x-2">
      <input
        type="checkbox"
        id="avoidStairs"
        checked={navigation.avoidStairs ?? false}
        onChange={handleToggle}
      />
      <label htmlFor="avoidStairs" className="text-sm">
        Avoid Stairs
      </label>
    </div>
  );
}

export default AvoidStairs;