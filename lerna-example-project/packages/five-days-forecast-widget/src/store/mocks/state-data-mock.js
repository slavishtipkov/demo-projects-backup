import * as ResponseMock from "../mocks/response-data-mock";

export const stateAfterDataRequestSend = {
  weatherForecast: [],
  days: 5,
  allowDaySelection: false,
  showFooter: true,
  coordinates: { lat: 44.82, lon: -93.4 },
  units: "Imperial",
  loading: true,
  error: undefined,
  activeDay: 0,
};

export const stateAfterDataRequestSuccess = {
  ...stateAfterDataRequestSend,
  loading: false,
  weatherForecast: ResponseMock.weatherForecastResponse,
};

export const stateAfterDataRequestError = {
  ...stateAfterDataRequestSend,
  coordinates: {
    lat: undefined,
    lon: undefined,
    stationId: undefined,
  },
  loading: false,
  error: "Some server error.",
  activeDay: 0,
  days: 5,
  showFooter: true,
};

export const stateAfterObservedAtSuccess = {
  ...stateAfterDataRequestSuccess,
  observedAt: ResponseMock.observedAtResponse,
  observedAtTime: new Date("2018-09-31T18:29:21"),
};
