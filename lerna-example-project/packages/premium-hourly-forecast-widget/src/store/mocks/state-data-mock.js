import * as ResponseMock from "./response-data-mock";

export const stateAfterPremiumRequestSend = {
  loading: true,
  weatherForecast: [],
  visibleFields: {
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
  },
  user: "test",
  widgetName: "premium-hourly-forecast-widget",
  days: 1,
  coordinatesFromEpic: false,
  showHourlyForecast: false,
  showStationSelect: true,
  showZipCode: true,
  hasSuccessPremiumRequest: false,
  units: "Imperial",
  coordinates: { lat: 33.5, lon: 29.8 },
  error: undefined,
};

export const stateAfterPremiumRequestSuccess = {
  ...stateAfterPremiumRequestSend,
  hasSuccessPremiumRequest: true,
};

export const stateAfterPremiumRequestError = {
  ...stateAfterPremiumRequestSend,
  coordinates: undefined,
  loading: false,
  error: "Some server error.",
  coordinatesFromEpic: false,
  showHourlyForecast: true,
};

export const stateAfterHourlyForecastSuccess = {
  ...stateAfterPremiumRequestSuccess,
  error: undefined,
  weatherForecast: ResponseMock.hourlyWeatherForecastData,
  showHourlyForecast: true,
};

export const stateAfterHourlyForecastError = {
  ...stateAfterPremiumRequestSuccess,
  coordinates: undefined,
  loading: false,
  error: "Some server error.",
  coordinatesFromEpic: false,
  showHourlyForecast: true,
};

export const stateAfterDayForecastSuccess = {
  ...stateAfterHourlyForecastSuccess,
  loading: false,
  dayForecast: ResponseMock.dayWeatherForecastData,
};

export const stateAfterSelectStation = {
  ...stateAfterDayForecastSuccess,
  loading: true,
  coordinatesFromEpic: true,
  coordinates: { stationId: "Station_id_1" },
};
