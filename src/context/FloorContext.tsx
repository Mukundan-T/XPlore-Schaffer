/**
 * This module is used to get the current floor that the user visually sees on the screen
 * at any given time the application is running.
 */

import React, { createContext, useContext, useState } from "react";

type FloorContextType = {
  currentFloor: string;
  setCurrentFloor: (floor: string) => void;
};

// Create the context
const FloorContext = createContext<FloorContextType | undefined>(undefined);

// Create a provider component
export const FloorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentFloor, setCurrentFloor] = useState("floor1"); // default floor

  return (
    <FloorContext.Provider value={{ currentFloor, setCurrentFloor }}>
      {children}
    </FloorContext.Provider>
  );
};

// Create a custom hook for easy access
export const useFloor = (): FloorContextType => {
  const context = useContext(FloorContext);
  if (!context) {
    throw new Error("useFloor must be used within a FloorProvider");
  }
  return context;
};