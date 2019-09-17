import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { Epic } from "redux-observable";
import { ApiService } from "../services/";
import { Actions } from "./actions";
import { State } from "./reducers";
import { DailyForecast, Coordinates } from "../interfaces";

export * from "./actions";
export * from "./epics";
export * from "./reducers";
export * from "./selectors";

export interface WeatherForecastState extends I18nState {
  readonly weatherForecast: State;
}
export type WeatherForecastActions = Actions | I18nActions;
export interface EpicDependencies {
  readonly api: ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
}
export interface PublicApiCallbacks {
  readonly loadingStateDidChange?: (loading: boolean) => void;
  readonly coordinatesStateDidChange?: (coordinates?: Coordinates) => void;
  readonly weatherForecastDidChange?: (coordinates?: Coordinates) => void;
  readonly activeDayDidChange?: (
    weatherForecast: ReadonlyArray<DailyForecast>,
    activeDay: number,
  ) => void;
  readonly allowDaySelectionDidChange?: (allowDaySelection: boolean) => void;
  readonly onError?: (error?: string) => void;
}
export type WeatherForecastEpic = Epic<
  WeatherForecastActions,
  WeatherForecastActions,
  WeatherForecastState,
  EpicDependencies
>;
