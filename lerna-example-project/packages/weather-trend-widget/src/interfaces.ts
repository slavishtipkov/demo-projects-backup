import { Units } from "@dtn/i18n-lib";

export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export type WeatherFields =
  | "AVERAGE_WIND_CHILL"
  | "MAXIMUM_WIND_CHILL"
  | "MININUM_WIND_CHILL"
  | "MAXIMUM_FEELS_LIKE"
  | "MINIMUM_FEELS_LIKE"
  | "AVERAGE_FEELS_LIKE"
  | "AVERAGE_TEMPERATURE"
  | "MAXIMUM_TEMPERATURE"
  | "MINIMUM_TEMPERATURE"
  | "SOIL_DEPTH_AVERAGE_TEMPERATURE"
  | "SOIL_DEPTH_AVERAGE_MOISTURE";

export interface WeatherFieldsMap {
  readonly AVERAGE_WIND_CHILL: "avgWindChill";
  readonly AVERAGE_TEMPERATURE: "avgTemperature";
  readonly AVERAGE_FEELS_LIKE: "avgFeelsLike";
  readonly AVERAGE_WIND_SPEED: "avgWindSpeed";
  readonly SOIL_DEPTH_AVERAGE_TEMPERATURE: "soil.[].avgTemperature";
  readonly SOIL_DEPTH_AVERAGE_MOISTURE: "soil.[].avgMoisture";
  readonly [k: string]: string;
}

export const WEATHER_FIELDS_MAP: WeatherFieldsMap = {
  AVERAGE_WIND_CHILL: "avgWindChill",
  AVERAGE_TEMPERATURE: "avgTemperature",
  AVERAGE_FEELS_LIKE: "avgFeelsLike",
  AVERAGE_WIND_SPEED: "avgWindSpeed",
  SOIL_DEPTH_AVERAGE_TEMPERATURE: "soil.[].avgTemperature",
  SOIL_DEPTH_AVERAGE_MOISTURE: "soil.[].avgMoisture",
};

export interface WeatherUnitsMap {
  readonly [k: string]: { readonly [u in Units]: string };
}

export const WEATHER_UNITS_MAP: WeatherUnitsMap = {
  avgWindChill: {
    [Units.IMPERIAL]: "˚F",
    [Units.METRIC]: "˚C",
  },
  avgTemperature: {
    [Units.IMPERIAL]: "˚F",
    [Units.METRIC]: "˚C",
  },
  avgFeelsLike: {
    [Units.IMPERIAL]: "˚F",
    [Units.METRIC]: "˚C",
  },
  avgWindSpeed: {
    [Units.IMPERIAL]: "MPH",
    [Units.METRIC]: "KM/H",
  },
  "soil.[].avgTemperature": {
    [Units.IMPERIAL]: "˚F",
    [Units.METRIC]: "˚C",
  },
  "soil.[].avgMoisture": {
    [Units.IMPERIAL]: "hmu",
    [Units.METRIC]: "hmu",
  },
};
