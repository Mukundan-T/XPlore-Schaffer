let initialStartLocation: string | null = null;

export function setInitialStartLocation(value: string) {
  initialStartLocation = value;
}

export function getInitialStartLocation(): string | null {
  return initialStartLocation;
}