import floor0 from "@/assets/img/Schaffer_Basement.svg";
import floor1 from "@/assets/img/Schaffer_1st_Floor.svg";
import floor2 from "@/assets/img/Schaffer_2nd_Floor.svg";
import floor3 from "@/assets/img/Schaffer_3rd_Floor.svg";
import { useFloor } from "@/context/FloorContext";
import { ReactNode } from "react";

interface MapBackgroundProps {
  children: ReactNode;
}

function MapBackground({ children }: MapBackgroundProps) {
  const { currentFloor } = useFloor();

  const floorMap = {
    floor0,
    floor1,
    floor2,
    floor3,
  };

  const viewBoxMap: Record<keyof typeof floorMap, string> = {
    floor0: "0 0 2100 1260",
    floor1: "0 0 2100 1260",
    floor2: "0 0 2100 1260",
    floor3: "0 0 1600 1260",
  };

  const selectedImage = floorMap[currentFloor as keyof typeof floorMap];
  const selectedViewBox = viewBoxMap[currentFloor as keyof typeof viewBoxMap];

  return (
    <svg viewBox={selectedViewBox} className="lg:h-[85vh] lg:w-[75vw] h-[85dvh]">
      <image id="background" width="100%" height="100%" href={selectedImage} />
      {children}
    </svg>
  );
}

export default MapBackground;