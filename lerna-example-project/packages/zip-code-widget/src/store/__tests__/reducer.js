/* eslint-env jest */
import { reducer, initialState } from "../reducers";
import { ActionTypes } from "../actions";
import * as StateMock from "../mocks/state-data-mock";
import * as ResponseMock from "../mocks/response-data-mock";

test("reducer is properly initialized", () => {
  expect(reducer()).toBe(initialState);
});

test("reducer should handle FETCH_ZIP_CODE_DATA", () => {
  const startAction = {
    type: ActionTypes.FETCH_ZIP_CODE_DATA,
    payload: {
      zipCode: "33101",
    },
  };

  expect(reducer(initialState, startAction)).toEqual(StateMock.stateAfterZipRequestSend);
});

test("reducer should handle FETCH_ZIP_CODE_DATA_SUCCESS", () => {
  const startAction = {
    type: ActionTypes.FETCH_ZIP_CODE_DATA_SUCCESS,
    payload: ResponseMock.zipResponseData,
  };

  expect(reducer(StateMock.stateAfterZipRequestSend, startAction)).toEqual(
    StateMock.stateAfterZipRequestSuccess,
  );
});

test("reducer should handle FETCH_ZIP_CODE_DATA_ERROR", () => {
  const startAction = {
    type: ActionTypes.FETCH_ZIP_CODE_DATA_ERROR,
    payload: {
      message: "Some server error.",
    },
  };

  expect(reducer(StateMock.stateAfterZipRequestSend, startAction)).toEqual(
    StateMock.stateAfterZipRequestError,
  );
});

test("reducer should handle REMOVE_ZIP_CODE_VALUE and SET_ZIP_CODE", () => {
  const startFirstAction = {
    type: ActionTypes.REMOVE_ZIP_CODE_VALUE,
  };

  expect(reducer(StateMock.stateAfterZipRequestSuccess, startFirstAction)).toEqual(
    StateMock.stateAfterRemoveZipValue,
  );

  const startSecondAction = {
    type: ActionTypes.SET_ZIP_CODE,
    payload: {
      zipCode: "33101",
    },
  };

  expect(reducer(StateMock.stateAfterRemoveZipValue, startSecondAction)).toEqual(
    StateMock.stateAfterSetZipValue,
  );
});
