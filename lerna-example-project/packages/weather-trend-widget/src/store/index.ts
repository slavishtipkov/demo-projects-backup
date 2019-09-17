import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { combineReducers } from "redux";
import { Epic } from "redux-observable";
import { TrendDataState as WeatherDataState, weatherDataReducer } from "./reducer";
import { WeatherDataActions } from "./actions";
import { Api } from "../services";

export * from "./actions";
export * from "./reducer";
export * from "./epics";

export interface WeatherTrendState {
  readonly weatherData: WeatherDataState;
}

export interface NamespacedState extends I18nState {
  readonly weatherTrend: WeatherTrendState;
}

export type WeatherTrendActions = WeatherDataActions | I18nActions;

export const reducer = combineReducers<WeatherTrendState, WeatherTrendActions>({
  weatherData: weatherDataReducer,
});

export const getWeatherTrendState = (state: NamespacedState) => state.weatherTrend;

export type WeatherTrendEpic = Epic<
  WeatherTrendActions,
  WeatherTrendActions,
  NamespacedState,
  {
    readonly api: Api;
  }
>;
