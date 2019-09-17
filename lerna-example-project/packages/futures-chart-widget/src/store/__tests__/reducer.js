/* eslint-env jest */
import { reducer, initialState } from "../reducers";
import { ActionTypes } from "../actions";
import * as StateMock from "../mocks/state-data-mock";
import * as ResponseMock from "../mocks/response-data-mock";

test("reducer is properly initialized", () => {
  expect(reducer()).toBe(initialState);
});

test("reducer should handle GET_QUOTE_FOR_SYMBOL", () => {
  const startAction = {
    type: ActionTypes.GET_QUOTE_FOR_SYMBOL,
    payload: {
      symbol: "@C@1",
    },
  };

  expect(reducer(initialState, startAction)).toEqual(StateMock.stateAfterGetQuoteForSymbolSend);
});

test("reducer should handle GET_QUOTE_FOR_SYMBOL_SUCCESS", () => {
  const startAction = {
    type: ActionTypes.GET_QUOTE_FOR_SYMBOL_SUCCESS,
    payload: {
      quote: ResponseMock.quotesResponse,
    },
  };

  expect(reducer(StateMock.stateAfterGetQuoteForSymbolSend, startAction)).toEqual(
    StateMock.stateAfterGetQuoteForSymbolSuccess,
  );
});

test("reducer should handle GET_QUOTE_FOR_SYMBOL_ERROR", () => {
  const startAction = {
    type: ActionTypes.GET_QUOTE_FOR_SYMBOL_ERROR,
    payload: {
      message: "Some server error.",
    },
  };

  expect(reducer(initialState, startAction)).toEqual(StateMock.stateAfterGetQuoteForSymbolError);
});

test("reducer should handle GET_PRICE_HISTORY_FOR_SYMBOL", () => {
  const startAction = {
    type: ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL,
    payload: {
      symbol: "@C@1",
      interval: "7-D",
      duration: "D",
    },
  };

  expect(reducer(StateMock.stateAfterGetQuoteForSymbolSuccess, startAction)).toEqual(
    StateMock.stateAfterGetPriceHistoryForSymbolSend,
  );
});

test("reducer should handle GET_PRICE_HISTORY_FOR_SYMBOL_SUCCESS", () => {
  const startAction = {
    type: ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL_SUCCESS,
    payload: {
      symbolPriceHistory: ResponseMock.historyPriceResponse,
    },
  };

  expect(reducer(StateMock.stateAfterGetPriceHistoryForSymbolSend, startAction)).toEqual(
    StateMock.stateAfterGetPriceHistoryForSymbolSuccess,
  );
});

test("reducer should handle GET_PRICE_HISTORY_FOR_SYMBOL_ERROR", () => {
  const startAction = {
    type: ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL_ERROR,
    payload: {
      message: "Some server error.",
    },
  };

  expect(reducer(initialState, startAction)).toEqual(
    StateMock.stateAfterGetPriceHistoryForSymbolError,
  );
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
