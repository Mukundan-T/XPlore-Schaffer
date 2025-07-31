/**
 * This module is used to get the current start location that the user visually sees on the screen
 * at any given time the application is running.
 */

let currentLocation: string | null = null;

export function setCurrentLocation(value: string) {
  currentLocation = value;
}

export function getCurrentLocation(): string | null {
  return currentLocation;
}