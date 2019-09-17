const MOISTURE_PALLETTE = {
  dark: "#003e6a",
  medium: "#2164b0",
  light: "#54c7da",
};

const TEMPERATURE_PALLETTE = {
  dark: "#6d0020",
  medium: "#f26222",
  light: "#ffe000",
};

const DEFAULT_PALLETTE = {
  dark: "#005336",
  medium: "#008076",
  light: "#c4d82d",
};

export const getColorForWeatherFieldKey = (key: string, index: number) => {
  let color;
  if (key.indexOf("emperature") > -1) {
    if (index === 0) {
      color = TEMPERATURE_PALLETTE.light;
    } else if (index === 1) {
      color = TEMPERATURE_PALLETTE.medium;
    } else {
      color = TEMPERATURE_PALLETTE.dark;
    }
  } else if (key.indexOf("oisture") > -1) {
    if (index === 0) {
      color = MOISTURE_PALLETTE.light;
    } else if (index === 1) {
      color = MOISTURE_PALLETTE.medium;
    } else {
      color = MOISTURE_PALLETTE.dark;
    }
  } else {
    if (index === 0) {
      color = DEFAULT_PALLETTE.light;
    } else if (index === 1) {
      color = DEFAULT_PALLETTE.medium;
    } else {
      color = DEFAULT_PALLETTE.dark;
    }
  }
  return color;
};

export const getUnitKeyForWeatherField = (key: string) => {
  let unitKey;
  if (key.indexOf("Depth") > -1) {
    unitKey = "depth";
  } else if (key.indexOf("emperature") > -1) {
    unitKey = "temperature";
  } else if (key.indexOf("oisture") > -1) {
    unitKey = "moisture";
  } else {
    unitKey = "speed";
  }
  return unitKey;
};
