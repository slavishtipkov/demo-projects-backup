/* eslint-env jest */
import { reducer, initialState } from "../reducers";
import { ActionTypes } from "../actions";
import * as StateMock from "../mocks/state-data-mock";
import * as ResponseMock from "../mocks/response-data-mock";

test("reducer is properly initialized", () => {
  expect(reducer()).toBe(initialState);
});

test("reducer should handle FETCH_CURRENT_CONDITIONS_DATA", () => {
  const startAction = {
    type: ActionTypes.FETCH_CURRENT_CONDITIONS_DATA,
    payload: {
      coordinates: { lat: 44.82, lon: -93.4 },
    },
  };

  expect(reducer(initialState, startAction)).toEqual(StateMock.stateAfterDataRequestSend);
});

test("reducer should handle FETCH_CURRENT_CONDITIONS_DATA_SUCCESS", () => {
  const startAction = {
    type: ActionTypes.FETCH_CURRENT_CONDITIONS_DATA_SUCCESS,
    payload: {
      currentConditionsByForecast: ResponseMock.currentForecastResponseByForecast,
      currentConditionsByObservation: ResponseMock.currentForecastResponseByObservation,
    },
  };

  expect(reducer(StateMock.stateAfterDataRequestSend, startAction)).toEqual(
    StateMock.stateAfterDataRequestSuccess,
  );
});

test("reducer should handle FETCH_CURRENT_CONDITIONS_DATA_ERROR", () => {
  const startAction = {
    type: ActionTypes.FETCH_CURRENT_CONDITIONS_DATA_ERROR,
    payload: {
      message: "Some server error.",
    },
  };

  expect(reducer(StateMock.stateAfterDataRequestSend, startAction)).toEqual(
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

test("reducer should handle CHANGE_CURRENT_CONDITIONS_BY_FORECAST", () => {
  const startAction = {
    type: ActionTypes.CHANGE_CURRENT_CONDITIONS_BY_FORECAST,
    payload: {
      currentConditionsByForecast: ResponseMock.newCurrentForecastResponse,
    },
  };

  expect(reducer(StateMock.stateAfterObservedAtSuccess, startAction)).toEqual(
    StateMock.stateAfterChangeCurrentConditions,
  );
});
