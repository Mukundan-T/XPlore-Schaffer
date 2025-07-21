import IndoorMapWrapper from "@/components/IndoorMapWrapper";
import MobileRouteDetails from "@/components/MobileRouteDetails";
import Toolbar from "@/components/Toolbar";
import useMapData from "@/hooks/useMapData";
import { createContext, useEffect, useState } from "react";
import { isDesktop, isMobile } from "react-device-detect";
import { useSearchParams } from "react-router-dom";
import {
  MapDataContextType,
  Navigation,
  NavigationContextType,
} from "../utils/types";
import Sidebar from "@/components/Sidebar";
import { FloorProvider } from "@/context/FloorContext";
//import { startPosition } from "@/components/getDefaultPos";
import { getDefaultPos } from "@/components/getDefaultPos";

export const NavigationContext = createContext<NavigationContextType | null>(
  null
);

export const MapDataContext = createContext<MapDataContextType | null>(null);
export const startPos = getDefaultPos();

function Map() {
  let [searchParams, setSearchParams] = useSearchParams();
  //const defaultPosition = "v199";
  //const startPosition = searchParams.get("position") || defaultPosition;
  //const startPos = getDefaultPos();
  const [navigation, setNavigation] = useState<Navigation>({
    start: startPos, // startPosition,
    end: "",
    avoidStairs: false,
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const navigationValue: NavigationContextType = {
    navigation,
    setNavigation,
    isEditMode,
    setIsEditMode,
  };

  useEffect(() => {
    setSearchParams({ position: navigation.start });
  }, [navigation.start]);

  const mapData = useMapData();
  return (
    <MapDataContext.Provider value={mapData}>
      <NavigationContext.Provider value={navigationValue}>
        <div className="flex bg-gray-100 text-gray-800 relative overflow-hidden w-full h-screen">
          {isDesktop && <Sidebar />}
          <main
            className={`flex w-full ${isDesktop && "-ml-96"} justify-center flex-grow flex-col md:p-10 p-2 transition-all duration-150 ease-in lg:ml-0`}
          >
            <Toolbar />
            <div className="center w-full h-full">
              <IndoorMapWrapper />
            </div>
          </main>
          {navigation.end && isMobile && <MobileRouteDetails />}
        </div>
      </NavigationContext.Provider>
    </MapDataContext.Provider>
  );
}

export default function MapWithFloor() {
  return (
    <FloorProvider>
      <Map />
    </FloorProvider>
  );
}