/**
 * This module is used to get the default location that the URL sets the application to at the start
 * of the website session.
 */

let initialDefaultLocation: string | null = null;

export function setDefaultLocation(value: string) {
  initialDefaultLocation = value;
}

export function getDefaultLocation(): string | null {
  return initialDefaultLocation;
}