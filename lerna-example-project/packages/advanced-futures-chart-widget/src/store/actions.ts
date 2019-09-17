import { Action, ActionCreator } from "redux";
import { Quote, SymbolPriceHistory } from "../interfaces";

export const enum ActionTypes {
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  GET_QUOTE_FOR_SYMBOL = "GET_QUOTE_FOR_SYMBOL",
  GET_QUOTE_FOR_SYMBOL_SUCCESS = "GET_QUOTE_FOR_SYMBOL_SUCCESS",
  GET_QUOTE_FOR_SYMBOL_ERROR = "GET_QUOTE_FOR_SYMBOL_ERROR",
  GET_PRICE_HISTORY_FOR_SYMBOL = "GET_PRICE_HISTORY_FOR_SYMBOL",
  GET_PRICE_HISTORY_FOR_SYMBOL_SUCCESS = "GET_PRICE_HISTORY_FOR_SYMBOL_SUCCESS",
  GET_PRICE_HISTORY_FOR_SYMBOL_ERROR = "GET_PRICE_HISTORY_FOR_SYMBOL_ERROR",
  CHANGE_CHART_TYPE = "CHANGE_CHART_TYPE",
  TOGGLE_DROPDOWN_CHART_TYPE = "TOGGLE_DROPDOWN_CHART_TYPE",
  CHANGE_Y_AXIS_STATE = "CHANGE_Y_AXIS_STATE",
}

export type Actions =
  | SetErrorMessage
  | GetQuoteForSymbol
  | GetQuoteForSymbolSuccess
  | GetQuoteForSymbolError
  | GetPriceHistoryForSymbol
  | GetPriceHistoryForSymbolSuccess
  | GetPriceHistoryForSymbolError
  | GetPriceHistoryForSymbolError
  | ChangeChartType
  | ChangeYAxisState;

export interface ChangeYAxisState extends Action<ActionTypes> {
  readonly type: ActionTypes.CHANGE_Y_AXIS_STATE;
  readonly payload: {
    readonly yAxisState: ReadonlyArray<{
      readonly isDrawn: boolean;
      readonly study: string;
    }>;
  };
}

export const changeYAxisState: ActionCreator<ChangeYAxisState> = (
  yAxisState: ReadonlyArray<{
    readonly isDrawn: boolean;
    readonly study: string;
  }>,
) => ({
  type: ActionTypes.CHANGE_Y_AXIS_STATE,
  payload: {
    yAxisState,
  },
});

export interface SetErrorMessage extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_ERROR_MESSAGE;
  readonly payload: Error;
  readonly error?: boolean;
}

export const setErrorMessage: ActionCreator<SetErrorMessage> = (error: string) => ({
  type: ActionTypes.SET_ERROR_MESSAGE,
  payload: new Error(error),
  error: true,
});

/**************************************************************
 *            GET QUOTE FOR SYMBOL ACTIONS BLOCK
 **************************************************************/
export interface GetQuoteForSymbol extends Action<ActionTypes> {
  readonly type: ActionTypes.GET_QUOTE_FOR_SYMBOL;
  readonly payload: {
    readonly symbol: string;
  };
}

export const getQuoteForSymbol: ActionCreator<GetQuoteForSymbol> = (symbol: string) => ({
  type: ActionTypes.GET_QUOTE_FOR_SYMBOL,
  payload: {
    symbol,
  },
});

export interface GetQuoteForSymbolSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.GET_QUOTE_FOR_SYMBOL_SUCCESS;
  readonly payload: {
    readonly quote: Quote;
  };
}

export const getQuoteForSymbolSuccess: ActionCreator<GetQuoteForSymbolSuccess> = (
  quote: Quote,
) => ({
  type: ActionTypes.GET_QUOTE_FOR_SYMBOL_SUCCESS,
  payload: {
    quote,
  },
});

export interface GetQuoteForSymbolError extends Action<ActionTypes> {
  readonly type: ActionTypes.GET_QUOTE_FOR_SYMBOL_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const getQuoteForSymbolError: ActionCreator<GetQuoteForSymbolError> = (
  errorMessage: string,
) => ({
  type: ActionTypes.GET_QUOTE_FOR_SYMBOL_ERROR,
  payload: new Error(errorMessage),
  error: true,
});

/**************************************************************
 *            GET PRICE HISTORY ACTIONS BLOCK
 **************************************************************/
export interface GetPriceHistoryForSymbol extends Action<ActionTypes> {
  readonly type: ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL;
  readonly payload: {
    readonly symbol: string;
    readonly interval: string;
    readonly duration: string;
  };
}

export const getPriceHistoryForSymbol: ActionCreator<GetPriceHistoryForSymbol> = (
  symbol: string,
  interval: string,
  duration: string,
) => ({
  type: ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL,
  payload: {
    symbol,
    interval,
    duration,
  },
});

export interface GetPriceHistoryForSymbolSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL_SUCCESS;
  readonly payload: {
    readonly symbolPriceHistory: SymbolPriceHistory;
  };
}

export const getPriceHistoryForSymbolSuccess: ActionCreator<GetPriceHistoryForSymbolSuccess> = (
  symbolPriceHistory: SymbolPriceHistory,
) => ({
  type: ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL_SUCCESS,
  payload: {
    symbolPriceHistory,
  },
});

export interface GetPriceHistoryForSymbolError extends Action<ActionTypes> {
  readonly type: ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const getPriceHistoryForSymbolError: ActionCreator<GetPriceHistoryForSymbolError> = (
  errorMessage: string,
) => ({
  type: ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL_ERROR,
  payload: new Error(errorMessage),
  error: true,
});

export interface ChangeChartType extends Action<ActionTypes> {
  readonly type: ActionTypes.CHANGE_CHART_TYPE;
  readonly payload: {
    readonly chartType: string;
  };
}

export const changeChartType: ActionCreator<ChangeChartType> = (chartType: string) => ({
  type: ActionTypes.CHANGE_CHART_TYPE,
  payload: {
    chartType,
  },
});
