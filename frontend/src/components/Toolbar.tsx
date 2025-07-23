import { NavigationContext } from "@/pages/Map";
import { NavigationContextType } from "@/utils/types";
import { useContext } from "react";
import { isDesktop } from "react-device-detect";
import EditPositionButton from "./EditPositionButton";
import DesktopRouteDetails from "./DesktopRouteDetails";
import SearchBar from "./SearchBar";
import ResetPos from "./ResetPos";
import Help from "./Help";
import AvoidStairs from "./AvoidStairs";

function Toolbar() {
  const { navigation } = useContext(NavigationContext) as NavigationContextType;

  return (
    <div className="flex space-x-2 mb-4 h-12 items-center relative">
      <SearchBar />
      <EditPositionButton />
      <ResetPos />
      <Help />
      <div className="w-0.2" />  {/* Adds extra horizontal space */}
      <AvoidStairs />
      {navigation.end && isDesktop && <DesktopRouteDetails />}
    </div>
  );
}

export default Toolbar;