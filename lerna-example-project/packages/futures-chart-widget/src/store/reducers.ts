import { Reducer } from "redux";
import { FuturesChartActions } from "./";
import { ActionTypes } from "./actions";
import { Quote, SymbolConfig, SymbolPriceHistory, HistoricPrice } from "../interfaces";

export interface State {
  readonly loading: boolean;
  readonly error?: string;
  readonly widgetName: string;
  readonly chartData: ReadonlyArray<HistoricPrice>;
  readonly chartType: string;
  readonly symbolConfig: SymbolConfig;
  readonly symbolPriceHistory?: SymbolPriceHistory;
  readonly quote?: Quote;
  readonly interval: string;
  readonly duration: string;
}

export const initialState: State = {
  loading: false,
  widgetName: "futures-chart-widget",
  chartData: [],
  chartType: "line",
  symbolConfig: {
    symbol: "",
    isSymbolVisible: true,
    isDescriptionVisible: true,
  },
  interval: "M",
  duration: "12-M",
};

export const reducer: Reducer<State, FuturesChartActions> = (state = initialState, action) => {
  if (!action) return state;
  switch (action.type) {
    case ActionTypes.SET_ERROR_MESSAGE:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };
    /**
     * GET QUOTE FOR SYMBOL
     */
    case ActionTypes.GET_QUOTE_FOR_SYMBOL:
      return {
        ...state,
        symbol: action.payload.symbol,
        loading: true,
        error: undefined,
      };
    case ActionTypes.GET_QUOTE_FOR_SYMBOL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        quote: action.payload.quote,
      };
    case ActionTypes.GET_QUOTE_FOR_SYMBOL_ERROR:
      return {
        ...state,
        symbol: undefined,
        quote: undefined,
        loading: false,
        error: action.payload.message,
      };
    /**
     * GET PRICE HISTORY FOR SYMBOL
     */
    case ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL:
      return {
        ...state,
        symbol: action.payload.symbol,
        interval: action.payload.interval,
        duration: action.payload.duration,
        loading: true,
        error: undefined,
      };
    case ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        symbolPriceHistory: action.payload.symbolPriceHistory,
      };
    case ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL_ERROR:
      return {
        ...state,
        symbolPriceHistory: undefined,
        loading: false,
        error: action.payload.message,
      };
    /**
     * CHANGE CHART TYPE
     */
    case ActionTypes.CHANGE_CHART_TYPE:
      return {
        ...state,
        chartType: action.payload.chartType,
      };
    default:
      return state;
  }
};
