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

test("reducer should handle PREMIUM_HOURLY_FORECAST_REQUEST", () => {
  const startAction = {
    type: ActionTypes.PREMIUM_HOURLY_FORECAST_REQUEST,
    payload: {
      user: "test",
      coordinates: { lat: 33.5, lon: 29.8 },
      units: "Imperial",
    },
  };

  expect(reducer(initialState, startAction)).toEqual(StateMock.stateAfterPremiumRequestSend);
});

test("reducer should handle PREMIUM_HOURLY_REQUEST_SUCCESS", () => {
  const startAction = {
    type: ActionTypes.PREMIUM_HOURLY_REQUEST_SUCCESS,
  };

  expect(reducer(StateMock.stateAfterPremiumRequestSend, startAction)).toEqual(
    StateMock.stateAfterPremiumRequestSuccess,
  );
});

test("reducer should handle HOURLY_FORECAST_DATA_FETCHED_ERROR", () => {
  const startAction = {
    type: ActionTypes.HOURLY_FORECAST_DATA_FETCHED_ERROR,
    payload: {
      message: "Some server error.",
    },
  };

  expect(reducer(StateMock.stateAfterPremiumRequestSend, startAction)).toEqual(
    StateMock.stateAfterPremiumRequestError,
  );
});

test("reducer should handle HOURLY_FORECAST_DATA_FETCHED_SUCCESS", () => {
  const startAction = {
    type: ActionTypes.HOURLY_FORECAST_DATA_FETCHED_SUCCESS,
    payload: {
      weatherForecast: ResponseMock.hourlyWeatherForecastData,
    },
  };

  expect(reducer(StateMock.stateAfterPremiumRequestSuccess, startAction)).toEqual(
    StateMock.stateAfterHourlyForecastSuccess,
  );
});

test("reducer should handle HOURLY_FORECAST_DATA_FETCHED_ERROR", () => {
  const startAction = {
    type: ActionTypes.HOURLY_FORECAST_DATA_FETCHED_ERROR,
    payload: {
      message: "Some server error.",
    },
  };

  expect(reducer(StateMock.stateAfterPremiumRequestSuccess, startAction)).toEqual(
    StateMock.stateAfterHourlyForecastError,
  );
});

test("reducer should handle DAY_FORECAST_DATA_FETCHED_SUCCESS", () => {
  const startAction = {
    type: ActionTypes.DAY_FORECAST_DATA_FETCHED_SUCCESS,
    payload: {
      dayForecast: ResponseMock.dayWeatherForecastData,
    },
  };

  expect(reducer(StateMock.stateAfterHourlyForecastSuccess, startAction)).toEqual(
    StateMock.stateAfterDayForecastSuccess,
  );
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
    showHourlyForecast: false,
  });
});
