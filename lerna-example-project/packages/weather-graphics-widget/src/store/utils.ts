import { MapsConfigInterface } from "../interfaces";

export const getActiveMap = (maps: MapsConfigInterface, defaultMap?: string): string => {
  if (defaultMap && maps[defaultMap]) {
    return defaultMap;
  } else {
    const activeMaps = Object.keys(maps).filter(k => maps[k] === true);
    return activeMaps[0];
  }
};
