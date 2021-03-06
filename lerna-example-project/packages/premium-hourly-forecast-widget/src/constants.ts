import { VisibleFields, RequiredVisibleFields } from "./interfaces";

export const ERRORS: {
  readonly noDataErrorMessage: {
    readonly key: string;
    readonly value: string;
  };
  readonly invalidCoordinatesMessage: {
    readonly key: string;
    readonly value: string;
  };
  readonly wrongConfigMessage: {
    readonly key: string;
    readonly value: string;
  };
  readonly [key: string]: { readonly key: string; readonly value: string };
} = {
  noDataErrorMessage: {
    key: "noDataErrorMessage",
    value: "Error: No weather forecast data for the selected coordinates.",
  },
  invalidCoordinatesMessage: {
    key: "invalidCoordinatesMessage",
    value:
      "Error: Invalid coordinates. Latitude should be a number in the range from -90 to 90. Longitude should be a number in the range from -180 to 180.",
  },
  wrongConfigMessage: {
    key: "wrongConfigMessage",
    value:
      "Error: Invalid widget configuration. Please provide valid zip/postal code, station or coordinates.",
  },
};

export const DEFAULT_VISIBLE_FIELDS: VisibleFields = {
  day: true,
  hour: true,
  condition: true,
  skyCover: true,
  temp_feelsLike: true,
  windDirections: true,
  windSpeeds: true,
  dewPoint: true,
  humidity: true,
  precipType: true,
  precipChance: true,
  precipAmount: true,
};

export const REQUIRED_VISIBLE_FIELDS: RequiredVisibleFields = {
  day: true,
  hour: true,
  condition: true,
};

export const ALLOWED_HOURS = 24;
export const ALLOWED_DAYS_FORECAST = 2;
export const ALLOWED_HOURS_TO_DAYS_FORECAST = 1;
export const FIRST_WEATHER_CODE = 1;
export const LAST_WEATHER_CODE = 41;

export const CLEAR_WEATHER_CODE = 21;
export const SUNNY_WEATHER_CODE = 22;
export const MOSTLY_SUNNY_WEATHER_CODE = 5;

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

export const COOKIE_NAME = "dtnPremiumRequestId";
export const COOKIE_EXPIRES_AFTER_DAYS = 1826;
