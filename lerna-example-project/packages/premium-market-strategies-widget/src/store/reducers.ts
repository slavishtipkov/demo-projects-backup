import { Reducer } from "redux";
import { PremiumSixFactorsMarketStrategiesActions } from "./";
import { ActionTypes } from "./actions";
import { SixFactorsMarketStrategies, SixFactorsMarketsText } from "../interfaces";
import { Commodities } from "@dtn/api-lib";

export interface State {
  readonly units?: string;
  readonly loading: boolean;
  readonly user: string;
  readonly widgetName: string;
  readonly defaultCommodity?: Commodities;
  readonly showCommodities?: boolean | ReadonlyArray<Commodities>;
  readonly marketStrategiesData?: SixFactorsMarketStrategies;
  readonly error?: string;
  readonly hasSuccessPremiumRequest: boolean;
  readonly commodities: ReadonlyArray<Commodities>;
  readonly charts: ReadonlyArray<{ readonly url: string; readonly id: string }>;
  readonly moreInformationTexts: ReadonlyArray<SixFactorsMarketsText>;
}

export const initialState: State = {
  loading: false,
  user: "",
  widgetName: "premium-market-strategies-widget",
  hasSuccessPremiumRequest: false,
  commodities: [],
  charts: [],
  moreInformationTexts: [],
};

export const reducer: Reducer<State, PremiumSixFactorsMarketStrategiesActions> = (
  state = initialState,
  action,
) => {
  if (!action) return state;

  switch (action.type) {
    case ActionTypes.FETCH_MARKET_STRATEGIES:
      return {
        ...state,
        loading: true,
        defaultCommodity: action.payload.commodity,
      };
    case ActionTypes.FETCH_MARKET_STRATEGIES_SUCCESS:
      return {
        ...state,
        loading: false,
        marketStrategiesData: action.payload.marketStrategiesData,
        charts: action.payload.charts,
        moreInformationTexts: action.payload.moreInformationTexts,
      };
    case ActionTypes.FETCH_MARKET_STRATEGIES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    case ActionTypes.FETCH_PREMIUM_MARKET_STRATEGIES_REQUEST:
      return {
        ...state,
        loading: true,
        defaultCommodity: action.payload.commodity,
        user: action.payload.user,
        widgetName: action.payload.widgetName,
        units: action.payload.units,
        hasSuccessPremiumRequest: true,
      };
    case ActionTypes.FETCH_PREMIUM_MARKET_STRATEGIES_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        marketStrategiesData: action.payload.marketStrategiesData,
      };
    case ActionTypes.SET_ERROR_MESSAGE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    case ActionTypes.FETCH_CHARTS:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.FETCH_CHARTS_SUCCESS:
      return {
        ...state,
        loading: false,
        charts: action.payload.charts,
      };
    case ActionTypes.FETCH_CHARTS_ERROR:
      return {
        ...state,
        loading: false,
        charts: [],
        error: action.payload.message,
      };
    default:
      return state;
  }
};
