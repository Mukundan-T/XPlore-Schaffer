/**
 * This module defines a bunch of interfaces and their properties, which is then imported
 * wherever necessary.
 */

export interface ObjectItem {
  id: string;
  name: string;
  desc: string;
  categoryId: string;
  categoryName?: string;
  floor: "floor0" | "floor1" | "floor2" | "floor3"; // added
}

export interface Category {
  id: string;
  name: string;
}

export interface Beacon {
  _id: string;
  beacon_id: string;
  rssi: number;
}

export interface Navigation {
  start: string;
  end?: string;
  floorPaths?: Record<string, string>;
  avoidStairs?: boolean;
}

export interface NavigationContextType {
  navigation: Navigation;
  setNavigation: React.Dispatch<React.SetStateAction<Navigation>>;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MapDataContextType {
  objects: ObjectItem[];
  categories: Category[];
  beacons?: Beacon[];
  refetchData: () => void;
}

export interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface BleBeacon {
  name: string;
  id: string;
  rssi: number;
  txPower: number;
  uuids: string[];
}
