import * as ResponseMock from "./response-data-mock";

export const stateAfterDataRequestSend = {
  loading: true,
  coordinates: { lat: 44.82, lon: -93.4 },
  error: undefined,
};

export const stateAfterDataRequestSuccess = {
  ...stateAfterDataRequestSend,
  loading: false,
  error: undefined,
  currentConditionsByObservation: ResponseMock.currentForecastResponseByObservation,
  currentConditionsByForecast: ResponseMock.currentForecastResponseByForecast,
};

export const stateAfterDataRequestError = {
  ...stateAfterDataRequestSend,
  loading: false,
  coordinates: {
    lat: undefined,
    lon: undefined,
    stationId: undefined,
  },
  error: "Some server error.",
};

export const stateAfterObservedAtSuccess = {
  ...stateAfterDataRequestSuccess,
  observedAt: ResponseMock.observedAtResponse,
  observedAtTime: new Date("2018-09-31T18:29:21"),
};

export const stateAfterChangeCurrentConditions = {
  ...stateAfterObservedAtSuccess,
  currentConditionsByForecast: ResponseMock.newCurrentForecastResponse,
};
