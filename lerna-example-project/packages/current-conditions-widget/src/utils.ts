import {
  WORLD_DIRECTIONS,
  CLEAR_WEATHER_CODE,
  SUNNY_WEATHER_CODE,
  MOSTLY_SUNNY_WEATHER_CODE,
} from "./constants";

export const getWindDirection = (windDegree?: number | null) => {
  // Convert wind degrees to match world directions
  if (windDegree !== undefined && windDegree !== null && windDegree >= 0 && windDegree <= 360) {
    const worldDirections = 16;
    const compassDegrees = 360;
    const compassSectors = 32;
    const rowDegrees =
      ((windDegree + compassDegrees / compassSectors) * worldDirections) / compassDegrees;
    const directionCode = Math.floor(rowDegrees % worldDirections);
    if (directionCode >= 0 && directionCode <= 15) {
      return WORLD_DIRECTIONS[directionCode];
    } else {
      return "-";
    }
  } else {
    return "-";
  }
};

export const getClearOrMostlyClearDescription = (
  isNightIconShouldBeShown: boolean,
  weatherCode: number | undefined,
): string => {
  const isClear =
    isNightIconShouldBeShown &&
    (weatherCode === CLEAR_WEATHER_CODE || weatherCode === SUNNY_WEATHER_CODE);
  const isMostlyClear = isNightIconShouldBeShown && weatherCode === MOSTLY_SUNNY_WEATHER_CODE;
  const clearOrMostlyClear = isClear ? "clear" : isMostlyClear ? "mostlyClear" : "";

  return clearOrMostlyClear;
};
