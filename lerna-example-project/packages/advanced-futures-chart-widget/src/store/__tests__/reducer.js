/* eslint-env jest */
import { reducer, initialState } from "../reducers";
import { ActionTypes } from "../actions";
import * as StateMock from "../mocks/state-data-mock";
import * as ResponseMock from "../mocks/response-data-mock";

test("reducer is properly initialized", () => {
  expect(reducer()).toBe(initialState);
});

test("reducer should handle CHANGE_CHART_TYPE", () => {
  const startFirstAction = {
    type: ActionTypes.CHANGE_CHART_TYPE,
    payload: {
      chartType: "bar",
    },
  };

  expect(reducer(initialState, startFirstAction)).toEqual({ ...initialState, chartType: "bar" });

  const startSecondAction = {
    type: ActionTypes.CHANGE_CHART_TYPE,
    payload: {
      chartType: "candlesticks",
    },
  };

  expect(reducer(initialState, startSecondAction)).toEqual({
    ...initialState,
    chartType: "candlesticks",
  });
});

test("reducer should handle GET_QUOTE_FOR_SYMBOL", () => {
  const startAction = {
    type: ActionTypes.GET_QUOTE_FOR_SYMBOL,
    payload: {
      symbol: "@C@1",
    },
  };

  expect(reducer(StateMock.stateAfterQuoteRequestSend, startAction)).toEqual(
    StateMock.stateAfterQuoteRequestSend,
  );
});

test("reducer should handle GET_QUOTE_FOR_SYMBOL_SUCCESS", () => {
  const startAction = {
    type: ActionTypes.GET_QUOTE_FOR_SYMBOL_SUCCESS,
    payload: {
      quote: ResponseMock.quotesResponse,
    },
  };

  expect(reducer(StateMock.stateAfterQuoteRequestSend, startAction)).toEqual(
    StateMock.stateAfterQuoteRequestSuccess,
  );
});

test("reducer should handle GET_QUOTE_FOR_SYMBOL_ERROR", () => {
  const startAction = {
    type: ActionTypes.GET_QUOTE_FOR_SYMBOL_ERROR,
    payload: {
      message: "Some server error.",
    },
  };

  expect(reducer(StateMock.stateAfterQuoteRequestSend, startAction)).toEqual(
    StateMock.stateAfterQuoteRequestError,
  );
});

test("reducer should handle GET_PRICE_HISTORY_FOR_SYMBOL", () => {
  const startAction = {
    type: ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL,
    payload: {
      symbol: "@C@1",
      interval: "60-Mi",
      duration: "1-M",
    },
  };

  expect(reducer(StateMock.stateAfterQuoteRequestSuccess, startAction)).toEqual(
    StateMock.stateAfterHistoryPriceRequestSend,
  );
});

test("reducer should handle GET_PRICE_HISTORY_FOR_SYMBOL_SUCCESS", () => {
  const startAction = {
    type: ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL_SUCCESS,
    payload: {
      symbolPriceHistory: ResponseMock.historyPriceResponse,
    },
  };

  expect(reducer(StateMock.stateAfterHistoryPriceRequestSend, startAction)).toEqual(
    StateMock.stateAfterHistoryPriceRequestSuccess,
  );
});

test("reducer should handle GET_PRICE_HISTORY_FOR_SYMBOL_ERROR", () => {
  const startAction = {
    type: ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL_ERROR,
    payload: {
      message: "Some server error.",
    },
  };

  expect(reducer(StateMock.stateAfterHistoryPriceRequestSend, startAction)).toEqual(
    StateMock.stateAfterHistoryPriceRequestError,
  );
});

test("reducer should handle CHANGE_Y_AXIS_STATE", () => {
  const startFirstAction = {
    type: ActionTypes.CHANGE_Y_AXIS_STATE,
    payload: {
      yAxisState: [
        { study: "volume", isDrawn: true },
        { study: "rsi", isDrawn: false },
        { study: "slowStochastic", isDrawn: false },
        { study: "fastStochastic", isDrawn: false },
        { study: "macd", isDrawn: false },
      ],
    },
  };

  expect(reducer(StateMock.stateAfterHistoryPriceRequestSuccess, startFirstAction)).toEqual(
    StateMock.oneYAxisDrawn,
  );

  const startSecondAction = {
    type: ActionTypes.CHANGE_Y_AXIS_STATE,
    payload: {
      yAxisState: [
        { study: "volume", isDrawn: true },
        { study: "rsi", isDrawn: true },
        { study: "slowStochastic", isDrawn: false },
        { study: "fastStochastic", isDrawn: false },
        { study: "macd", isDrawn: false },
      ],
    },
  };

  expect(reducer(StateMock.stateAfterHistoryPriceRequestSuccess, startSecondAction)).toEqual(
    StateMock.twoYAxisDrawn,
  );

  const startThirdAction = {
    type: ActionTypes.CHANGE_Y_AXIS_STATE,
    payload: {
      yAxisState: [
        { study: "volume", isDrawn: true },
        { study: "rsi", isDrawn: true },
        { study: "slowStochastic", isDrawn: true },
        { study: "fastStochastic", isDrawn: false },
        { study: "macd", isDrawn: false },
      ],
    },
  };

  expect(reducer(StateMock.stateAfterHistoryPriceRequestSuccess, startThirdAction)).toEqual(
    StateMock.threeYAxisDrawn,
  );

  const startFourthAction = {
    type: ActionTypes.CHANGE_Y_AXIS_STATE,
    payload: {
      yAxisState: [
        { study: "volume", isDrawn: true },
        { study: "rsi", isDrawn: true },
        { study: "slowStochastic", isDrawn: true },
        { study: "fastStochastic", isDrawn: true },
        { study: "macd", isDrawn: false },
      ],
    },
  };

  expect(reducer(StateMock.stateAfterHistoryPriceRequestSuccess, startFourthAction)).toEqual(
    StateMock.fourYAxisDrawn,
  );

  const startFifthAction = {
    type: ActionTypes.CHANGE_Y_AXIS_STATE,
    payload: {
      yAxisState: [
        { study: "volume", isDrawn: true },
        { study: "rsi", isDrawn: true },
        { study: "slowStochastic", isDrawn: true },
        { study: "fastStochastic", isDrawn: true },
        { study: "macd", isDrawn: true },
      ],
    },
  };

  expect(reducer(StateMock.stateAfterHistoryPriceRequestSuccess, startFifthAction)).toEqual(
    StateMock.allYAxisDrawn,
  );
});
