import { MapsConfigInterface } from "./interfaces";

export const ERRORS: {
  readonly noDataErrorMessage: {
    readonly key: string;
    readonly value: string;
  };
  readonly [key: string]: { readonly key: string; readonly value: string };
} = {
  noDataErrorMessage: {
    key: "noDataErrorMessage",
    value: "No data found",
  },
};

export const DEFAULT_MAPS: MapsConfigInterface = {
  "US Severe Weather Risk": true,
  "US Forecast High Temperatures": true,
  "US Forecast Low Temperatures": true,
  "NA Forecast High Temperatures": true,
  "NA Forecast Low Temperatures": true,
  "US Surface Weather Forecast": true,
  "NA Surface Weather Forecast": true,
};

export const MAP_IDS: {
  readonly [key: string]: string;
} = {
  "US Severe Weather Risk": "severeWeatherForecast",
  "US Forecast High Temperatures": "highTempForecast",
  "US Forecast Low Temperatures": "lowTempForecast",
  "NA Forecast High Temperatures": "highTempForecastNAM",
  "NA Forecast Low Temperatures": "lowTempForecastNAM",
  "US Surface Weather Forecast": "surfaceWeatherForecast24H",
  "NA Surface Weather Forecast": "surfaceWeatherForecast24HNAM",
};

export const MAPS_CONFIG_DICTIONARY: {
  readonly [key: string]: string;
} = {
  US_SEVERE_WEATHER_RISK: "US Severe Weather Risk",
  US_FORECAST_HIGH_TEMPS: "US Forecast High Temperatures",
  US_FORECAST_LOW_TEMPS: "US Forecast Low Temperatures",
  NA_FORECAST_HIGH_TEMPS: "NA Forecast High Temperatures",
  NA_FORECAST_LOW_TEMPS: "NA Forecast Low Temperatures",
  US_SURFACE_WEATHER_FORECAST: "US Surface Weather Forecast",
  NA_SURFACE_WEATHER_FORECAST: "NA Surface Weather Forecast",
};
