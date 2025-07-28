/**
 * The main module that controls the map backgrounds. Displays the appropriate map based on the floor
 * selected, and the routes, positions, modals, and everything related to the maps. 
 */

import React, { useContext, useState } from "react";
import { isMobile } from "react-device-detect";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { MapDataContext, NavigationContext } from "../pages/Map";
import "../styles/map.css";
import {
  MapDataContextType,
  NavigationContextType,
  ObjectItem,
} from "../utils/types";
import { MapBackground, Paths, Positions, Objects } from "./IndoorMap";
import Controls from "./MapControls";
import ObjectDetailsModal from "./Modals/ObjectDetailsModal";
import { navigateToObject } from "@/utils/navigationHelper";
import { toast } from "react-toastify";
import { useFloor } from "@/context/FloorContext";
import apiService from "@/services/apiService";
import { logClick } from "@/services/mapServices";
import { getCurrentLocation } from "@/store/currentLocation";

function IndoorMapWrapper() {
  const [modalOpen, setModalOpen] = useState(false);
  const [object, setObject] = useState<ObjectItem>({} as ObjectItem);
  const positionRadius = isMobile ? 10 : 8;
  const { navigation, setNavigation, isEditMode, setIsEditMode } = useContext(
    NavigationContext
  ) as NavigationContextType;
  const { objects } = useContext(MapDataContext) as MapDataContextType;
  const { currentFloor, setCurrentFloor } = useFloor();

  async function handleObjectClick(e: React.MouseEvent<SVGPathElement>) {
    if (!isEditMode) {
      const targetId = (e.target as HTMLElement).id;
      const selectedObject = objects.find((obj) => obj.name === targetId);
      if (selectedObject?.id) {
        setObject(selectedObject);
        logClick(targetId);
        setModalOpen(true);
      } else {
        toast.error("Object not found");
      }
    }
  }
  
  const handlePositionClick = (e: React.MouseEvent<SVGPathElement>) => {
    if (isEditMode) {
      const vertexId = (e.target as HTMLElement).id;
      setNavigation({ start: vertexId });
      setIsEditMode(false);
    }
  };

  async function handleNavigationClick() {
    setModalOpen(false);
    try {
      // Log search to the backend
        await apiService.post("/searches", {
          query: object.name,
          userLocation: getCurrentLocation()
        });
      }
      catch (err) {
        console.error("Error logging search:", err);
      }
    toast.dismiss();
    navigateToObject(object.name, navigation, setNavigation, setCurrentFloor, currentFloor);
  }
  return (
    <div className="relative w-full h-full bg-white center">
      <ObjectDetailsModal
        open={modalOpen}
        object={object}
        onClose={() => setModalOpen((cur) => !cur)}
        objectNavigation={handleNavigationClick}
      />

      <TransformWrapper
        centerOnInit
        minScale={isMobile ? 0.4 : 1}
        doubleClick={{ mode: "reset" }}
        initialScale={isMobile ? 0.4 : 1}
        smooth={true}
        wheel={{ smoothStep: 0.01 }}
      >
        <TransformComponent wrapperClass="bg-white">
          <MapBackground>
            {/*Objects are the clickable areas on the map e.g. Rooms, Desks, ...*/}
            <Objects
              handleObjectClick={handleObjectClick}
              className={isEditMode ? "" : "hover:cursor-pointer hover:opacity-50"}
              currentFloor={currentFloor}
              
            />
            {/*Edges are the lines on the map aka the paths*/}
            <Paths />
            {/*Vertexes are the circles on the map aka the positions*/}
            <Positions
              positionRadius={positionRadius}
              handlePositionClick={handlePositionClick}
              className={
                isEditMode
                  ? "opacity-100 cursor-pointer hover:fill-[#488af4] "
                  : "opacity-0"
              }
              navigation={navigation}
            />
          </MapBackground>
        </TransformComponent>
        <Controls />
      </TransformWrapper>
    </div>
  );
}

export default IndoorMapWrapper;
