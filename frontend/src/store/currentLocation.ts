let currentLocation: string | null = null;

export function setCurrentLocation(value: string) {
  currentLocation = value;
}

export function getCurrentLocation(): string | null {
  return currentLocation;
}