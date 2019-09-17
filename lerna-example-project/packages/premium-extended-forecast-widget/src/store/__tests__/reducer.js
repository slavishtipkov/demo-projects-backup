/* eslint-env jest */
import { reducer, initialState } from "../reducers";
import { ActionTypes } from "../actions";
import * as StateMock from "../mocks/state-data-mock";
import * as ResponseMock from "../mocks/response-data-mock";

jest.mock("@dtn/zip-code-widget", () => {
  return {
    ActionTypes: {
      FETCH_ZIP_CODE_DATA_SUCCESS: "FETCH_ZIP_CODE_DATA_SUCCESS",
      FETCH_ZIP_CODE_DATA: "FETCH_ZIP_CODE_DATA",
      FETCH_ZIP_CODE_DATA_ERROR: "FETCH_ZIP_CODE_DATA_ERROR",
    },
  };
});

jest.mock("@dtn/premium-location-select-widget", () => {
  return {
    ActionTypes: {
      SELECT_SELECTED_STATION: "SELECT_SELECTED_STATION",
    },
  };
});

test("reducer is properly initialized", () => {
  expect(reducer()).toBe(initialState);
});

test("reducer should handle PREMIUM_WEATHER_FORECAST_REQUEST", () => {
  const startAction = {
    type: ActionTypes.PREMIUM_WEATHER_FORECAST_REQUEST,
    payload: {
      coordinates: { lat: 38.05, lon: -117.22 },
      days: 10,
      user: "test.user",
      units: "Imperial",
    },
  };

  expect(reducer(initialState, startAction)).toEqual(StateMock.stateAfterPremiumRequestSend);
});

test("reducer should handle PREMIUM_WEATHER_REQUEST_SUCCESS", () => {
  const startAction = {
    type: ActionTypes.PREMIUM_WEATHER_REQUEST_SUCCESS,
  };

  expect(reducer(StateMock.stateAfterPremiumRequestSend, startAction)).toEqual(
    StateMock.stateAfterPremiumRequestSuccess,
  );
});

test("reducer should handle PREMIUM_WEATHER_REQUEST_ERROR", () => {
  const startAction = {
    type: ActionTypes.PREMIUM_WEATHER_REQUEST_ERROR,
    payload: {
      message: "Some server error.",
    },
  };

  expect(reducer(StateMock.stateAfterPremiumRequestSend, startAction)).toEqual(
    StateMock.stateAfterPremiumRequestError,
  );
});

test("reducer should handle PREMIUM_WEATHER_FORECAST_DATA_FETCHED_SUCCESS", () => {
  const startAction = {
    type: ActionTypes.PREMIUM_WEATHER_FORECAST_DATA_FETCHED_SUCCESS,
    payload: {
      weatherForecast: ResponseMock.weatherForecastResponse,
      hourlyObservation: ResponseMock.hourlyWeatherObservationData,
    },
  };

  expect(reducer(StateMock.stateAfterPremiumRequestSuccess, startAction)).toEqual(
    StateMock.stateAfterDataRequestSuccess,
  );
});

test("reducer should handle PREMIUM_WEATHER_FORECAST_DATA_FETCHED_ERROR", () => {
  const startAction = {
    type: ActionTypes.PREMIUM_WEATHER_FORECAST_DATA_FETCHED_ERROR,
    payload: {
      message: "Some server error.",
    },
  };

  expect(reducer(StateMock.stateAfterPremiumRequestSuccess, startAction)).toEqual(
    StateMock.stateAfterDataRequestError,
  );
});

test("reducer should handle FETCH_OBSERVED_AT_DATA_SUCCESS", () => {
  const constantDate = new Date("2018-09-31T18:29:21");
  Date = jest.fn(() => constantDate); // eslint-disable-line

  const startAction = {
    type: ActionTypes.FETCH_OBSERVED_AT_DATA_SUCCESS,
    payload: {
      observedAt: ResponseMock.observedAtResponse,
    },
  };

  expect(reducer(StateMock.stateAfterDataRequestSuccess, startAction)).toEqual(
    StateMock.stateAfterObservedAtSuccess,
  );
});

test("reducer should handle FETCH_ZIP_CODE_DATA", () => {
  const action = {
    type: "FETCH_ZIP_CODE_DATA",
    payload: {
      zipCode: "33101",
    },
  };

  expect(reducer(StateMock.stateAfterObservedAtSuccess, action)).toEqual(
    StateMock.stateAfterFetchZipCodeData,
  );
});

test("reducer should handle FETCH_ZIP_CODE_DATA_SUCCESS", () => {
  const startAction = {
    type: "FETCH_ZIP_CODE_DATA_SUCCESS",
    payload: {
      address: "Miami, Florida 33122, United States",
      city: "Miami",
      country: "United States",
      lat: 25.8,
      lon: -80.28,
      postalCode: "33122",
      region: "Florida",
    },
  };

  expect(reducer(initialState, startAction)).toEqual({
    ...initialState,
    coordinates: { lat: 25.8, lon: -80.28 },
    coordinatesFromEpic: true,
  });
});

test("reducer should handle FETCH_ZIP_CODE_DATA_ERROR", () => {
  const startAction = {
    type: "FETCH_ZIP_CODE_DATA_ERROR",
  };

  expect(reducer(initialState, startAction)).toEqual({
    ...initialState,
    loading: false,
    showDailyForecast: false,
  });
});

test("reducer should handle SELECT_SELECTED_STATION", () => {
  const startAction = {
    type: "SELECT_SELECTED_STATION",
    payload: {
      selectedStation: {
        stationId: "Station_id_1",
      },
    },
  };

  expect(reducer(StateMock.stateAfterDayForecastSuccess, startAction)).toEqual(
    StateMock.stateAfterSelectStation,
  );
});
