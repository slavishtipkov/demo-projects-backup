import { ForecastProps } from "./interfaces";

export const ERRORS: {
  readonly noDataErrorMessage: {
    readonly key: string;
    readonly value: string;
  };
  readonly invalidCoordinatesMessage: {
    readonly key: string;
    readonly value: string;
  };
  readonly [key: string]: {
    readonly key: string;
    readonly value: string;
  };
} = {
  noDataErrorMessage: {
    key: "noDataErrorMessage",
    value: "No weather forecast data for the selected coordinates.",
  },
  invalidCoordinatesMessage: {
    key: "invalidCoordinatesMessage",
    value:
      "Invalid coordinates. Latitude should be a number in the range from -90 to 90. Longitude should be a number in the range from -180 to 180.",
  },
};

export const VISIBLE_FIELDS: ForecastProps = {
  temperature: true,
  feelsLike: true,
  precipType: true,
  precipChance: true,
  precipAmount: true,
  humidity: true,
  barometer: true,
  dewPoint: true,
  evapotranspiration: true,
  windDirection: false,
  windSpeed: true,
  sunrise: true,
  sunset: true,
  observation_or_forecast: true,
};

export const CLEAR_WEATHER_CODE = 21;
export const SUNNY_WEATHER_CODE = 22;
export const MOSTLY_SUNNY_WEATHER_CODE = 5;

export const FIRST_WEATHER_CODE = 1;
export const LAST_WEATHER_CODE = 41;

export const WORLD_DIRECTIONS: {
  readonly 0: string;
  readonly 1: string;
  readonly 2: string;
  readonly 3: string;
  readonly 4: string;
  readonly 5: string;
  readonly 6: string;
  readonly 7: string;
  readonly 8: string;
  readonly 9: string;
  readonly 10: string;
  readonly 11: string;
  readonly 12: string;
  readonly 13: string;
  readonly 14: string;
  readonly 15: string;
  readonly [key: string]: string;
} = {
  0: "N",
  1: "NNE",
  2: "NE",
  3: "ENE",
  4: "E",
  5: "ESE",
  6: "SE",
  7: "SSE",
  8: "S",
  9: "SSW",
  10: "SW",
  11: "WSW",
  12: "W",
  13: "WNW",
  14: "NW",
  15: "NNW",
};
