/* eslint-env jest */
import { reducer, initialState } from "../reducers";
import { ActionTypes } from "../actions";
import * as StateMock from "../mocks/state-data-mock";
import * as ResponseMock from "../mocks/response-data-mock";

test("reducer is properly initialized", () => {
  expect(reducer()).toBe(initialState);
});

test("reducer should handle FETCH_WEATHER_FORECAST_DATA", () => {
  const startAction = {
    type: ActionTypes.FETCH_WEATHER_FORECAST_DATA,
    payload: {
      coordinates: { lat: 44.82, lon: -93.4 },
      days: 5,
      units: "Imperial",
      showFooter: true,
    },
  };

  expect(reducer(initialState, startAction)).toEqual(StateMock.stateAfterDataRequestSend);
});

test("reducer should handle WEATHER_FORECAST_DATA_FETCHED_SUCCESS", () => {
  const startAction = {
    type: ActionTypes.WEATHER_FORECAST_DATA_FETCHED_SUCCESS,
    payload: {
      weatherForecast: ResponseMock.weatherForecastResponse,
    },
  };

  expect(reducer(StateMock.stateAfterDataRequestSend, startAction)).toEqual(
    StateMock.stateAfterDataRequestSuccess,
  );
});

test("reducer should handle WEATHER_FORECAST_DATA_FETCHED_ERROR", () => {
  const startAction = {
    type: ActionTypes.WEATHER_FORECAST_DATA_FETCHED_ERROR,
    payload: {
      message: "Some server error.",
    },
  };

  expect(reducer(StateMock.stateAfterDataRequestSend, startAction)).toEqual(
    StateMock.stateAfterDataRequestError,
  );
});

test("reducer should handle SET_ALLOW_DAY_SELECTION", () => {
  const startAction = {
    type: ActionTypes.SET_ALLOW_DAY_SELECTION,
    payload: {
      allowDaySelection: true,
    },
  };

  expect(reducer(initialState, startAction)).toEqual({ ...initialState, allowDaySelection: true });
});

test("reducer should handle SELECT_ACTIVE_DAY", () => {
  const startAction = {
    type: ActionTypes.SELECT_ACTIVE_DAY,
    payload: {
      activeDay: 3,
    },
  };

  expect(reducer(initialState, startAction)).toEqual({ ...initialState, activeDay: 3 });
});

test("reducer should handle HIDE_FOOTER", () => {
  const startAction = {
    type: ActionTypes.HIDE_FOOTER,
  };

  expect(reducer(initialState, startAction)).toEqual({ ...initialState, showFooter: false });
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
