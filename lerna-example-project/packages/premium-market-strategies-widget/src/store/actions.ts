import { Action, ActionCreator } from "redux";
import { SixFactorsMarketStrategies, SixFactorsMarketsText } from "../interfaces";
import { Commodities } from "@dtn/api-lib";

export const enum ActionTypes {
  FETCH_MARKET_STRATEGIES = "FETCH_MARKET_STRATEGIES",
  FETCH_MARKET_STRATEGIES_SUCCESS = "FETCH_MARKET_STRATEGIES_SUCCESS",
  FETCH_MARKET_STRATEGIES_ERROR = "FETCH_MARKET_STRATEGIES_ERROR",
  FETCH_PREMIUM_MARKET_STRATEGIES_REQUEST = "FETCH_PREMIUM_MARKET_STRATEGIES_REQUEST",
  FETCH_PREMIUM_MARKET_STRATEGIES_REQUEST_SUCCESS = "FETCH_PREMIUM_MARKET_STRATEGIES_REQUEST_SUCCESS",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  FETCH_CHARTS = "FETCH_CHARTS",
  FETCH_CHARTS_SUCCESS = "FETCH_CHARTS_SUCCESS",
  FETCH_CHARTS_ERROR = "FETCH_CHARTS_ERROR",
}

export type Actions =
  | FetchMarketStrategies
  | FetchMarketStrategiesSuccess
  | FetchMarketStrategiesError
  | FetchPremiumMarketStrategiesRequest
  | FetchPremiumMarketStrategiesRequestSuccess
  | SetErrorMessage
  | FetchCharts
  | FetchChartsSuccess
  | FetchChartsError;

export interface FetchMarketStrategies extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_MARKET_STRATEGIES;
  readonly payload: {
    readonly commodity: Commodities;
  };
}

export const fetchMarketStrategies: ActionCreator<FetchMarketStrategies> = (
  commodity: Commodities,
) => ({
  type: ActionTypes.FETCH_MARKET_STRATEGIES,
  payload: {
    commodity,
  },
});

export interface FetchMarketStrategiesSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_MARKET_STRATEGIES_SUCCESS;
  readonly payload: {
    readonly marketStrategiesData: SixFactorsMarketStrategies;
    readonly charts: ReadonlyArray<{ readonly url: string; readonly id: string }>;
    readonly moreInformationTexts: ReadonlyArray<SixFactorsMarketsText>;
  };
}

export const fetchMarketStrategiesSuccess: ActionCreator<FetchMarketStrategiesSuccess> = (
  marketStrategiesData: SixFactorsMarketStrategies,
  charts: ReadonlyArray<{ readonly url: string; readonly id: string }>,
  moreInformationTexts: ReadonlyArray<SixFactorsMarketsText>,
) => ({
  type: ActionTypes.FETCH_MARKET_STRATEGIES_SUCCESS,
  payload: {
    marketStrategiesData,
    charts,
    moreInformationTexts,
  },
});

export interface FetchMarketStrategiesError extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_MARKET_STRATEGIES_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const fetchMarketStrategiesError: ActionCreator<FetchMarketStrategiesError> = (
  errorMessage: string,
) => ({
  type: ActionTypes.FETCH_MARKET_STRATEGIES_ERROR,
  payload: new Error(errorMessage),
  error: true,
});

export interface FetchPremiumMarketStrategiesRequest extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_PREMIUM_MARKET_STRATEGIES_REQUEST;
  readonly payload: {
    readonly user: string;
    readonly widgetName: string;
    readonly commodity: Commodities;
    readonly units?: string;
  };
}

export const fetchPremiumMarketStrategiesRequest: ActionCreator<
  FetchPremiumMarketStrategiesRequest
> = (user: string, widgetName: string, commodity: Commodities, units?: string) => ({
  type: ActionTypes.FETCH_PREMIUM_MARKET_STRATEGIES_REQUEST,
  payload: {
    user,
    widgetName,
    commodity,
    units,
  },
});

export interface FetchPremiumMarketStrategiesRequestSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_PREMIUM_MARKET_STRATEGIES_REQUEST_SUCCESS;
  readonly payload: {
    readonly marketStrategiesData: SixFactorsMarketStrategies;
  };
}

export const fetchPremiumMarketStrategiesRequestSuccess: ActionCreator<
  FetchPremiumMarketStrategiesRequestSuccess
> = (marketStrategiesData: SixFactorsMarketStrategies) => ({
  type: ActionTypes.FETCH_PREMIUM_MARKET_STRATEGIES_REQUEST_SUCCESS,
  payload: {
    marketStrategiesData,
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

export interface FetchCharts extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_CHARTS;
  readonly payload: {
    readonly commodity: Commodities;
    readonly chartIds: ReadonlyArray<string>;
  };
}

export const fetchCharts: ActionCreator<FetchCharts> = (
  commodity: Commodities,
  chartIds: ReadonlyArray<string>,
) => ({
  type: ActionTypes.FETCH_CHARTS,
  payload: {
    commodity,
    chartIds,
  },
});

export interface FetchChartsSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_CHARTS_SUCCESS;
  readonly payload: {
    readonly charts: ReadonlyArray<{ readonly url: string; readonly id: string }>;
  };
}

export const fetchChartsSuccess: ActionCreator<FetchChartsSuccess> = (
  charts: ReadonlyArray<{ readonly url: string; readonly id: string }>,
) => ({
  type: ActionTypes.FETCH_CHARTS_SUCCESS,
  payload: {
    charts,
  },
});

export interface FetchChartsError extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_CHARTS_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const fetchChartsError: ActionCreator<FetchChartsError> = (errorMessage: string) => ({
  type: ActionTypes.FETCH_CHARTS_ERROR,
  payload: new Error(errorMessage),
  error: true,
});
