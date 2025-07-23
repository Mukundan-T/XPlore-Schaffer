let initialDefaultLocation: string | null = null;

export function setDefaultLocation(value: string) {
  initialDefaultLocation = value;
}

export function getDefaultLocation(): string | null {
  return initialDefaultLocation;
}