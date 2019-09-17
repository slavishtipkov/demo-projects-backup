import * as ResponseMock from "./response-data-mock";

export const stateAfterPremiumRequestSend = {
  weatherForecast: [],
  hourlyObservation: [],
  widgetName: "premium-extended-forecast-widget",
  showDailyForecast: false,
  showStationSelect: true,
  showZipCode: true,
  hasSuccessPremiumRequest: false,
  coordinates: { lat: 38.05, lon: -117.22 },
  days: 10,
  user: "test.user",
  units: "Imperial",
  loading: true,
  error: undefined,
  coordinatesFromEpic: false,
};

export const stateAfterPremiumRequestSuccess = {
  ...stateAfterPremiumRequestSend,
  hasSuccessPremiumRequest: true,
};

export const stateAfterPremiumRequestError = {
  ...stateAfterPremiumRequestSend,
  loading: false,
  error: "Some server error.",
  hasSuccessPremiumRequest: false,
  showDailyForecast: true,
  coordinates: undefined,
};

export const stateAfterDataRequestSuccess = {
  ...stateAfterPremiumRequestSuccess,
  loading: false,
  error: undefined,
  weatherForecast: ResponseMock.weatherForecastResponse,
  hourlyObservation: ResponseMock.hourlyWeatherObservationData,
  showDailyForecast: true,
};

export const stateAfterDataRequestError = {
  ...stateAfterPremiumRequestSuccess,
  coordinates: undefined,
  loading: false,
  error: "Some server error.",
  coordinatesFromEpic: false,
  showDailyForecast: true,
};

export const stateAfterObservedAtSuccess = {
  ...stateAfterDataRequestSuccess,
  observedAt: ResponseMock.observedAtResponse,
  observedAtTime: new Date("2018-09-31T18:29:21"),
};

export const stateAfterFetchZipCodeData = {
  ...stateAfterObservedAtSuccess,
  loading: true,
};

export const stateAfterDayForecastSuccess = {
  ...stateAfterDataRequestSuccess,
  loading: false,
  dayForecast: ResponseMock.dayWeatherForecastData,
};

export const stateAfterSelectStation = {
  ...stateAfterDayForecastSuccess,
  loading: true,
  coordinatesFromEpic: true,
  coordinates: { stationId: "Station_id_1" },
};
