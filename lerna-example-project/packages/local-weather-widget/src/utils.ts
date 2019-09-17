export const hideWidget = (container: HTMLElement) => {
  container.style.display = "none";
};

export const showWidget = (container: HTMLElement) => {
  container.style.display = "block";
};

export const areCoordinatesValid = (coordinates: {
  readonly lat: number;
  readonly lon: number;
}): boolean => {
  return (
    coordinates &&
    (coordinates.lat > -90 &&
      coordinates.lat < 90 &&
      coordinates.lon > -180 &&
      coordinates.lon < 180)
  );
};
