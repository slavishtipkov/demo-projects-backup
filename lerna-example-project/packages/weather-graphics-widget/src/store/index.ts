import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { Epic } from "redux-observable";
import { ApiService } from "../services/";
import { Actions } from "./actions";
import { State } from "./reducers";
import { WeatherGraphics } from "../types";

export * from "./actions";
export * from "./epics";
export * from "./reducers";
export * from "./selectors";

export interface StaticWeatherMapState extends I18nState {
  readonly staticWeatherMapState: State;
}
export type StaticWeatherMapActions = Actions | I18nActions;
export interface EpicDependencies {
  readonly api: ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
}
export interface PublicApiCallbacks {
  readonly onWeatherGraphicChange: (newWeatherGraphic: WeatherGraphics) => void;
}
export type StaticWeatherMapEpic = Epic<
  StaticWeatherMapActions,
  StaticWeatherMapActions,
  StaticWeatherMapState,
  EpicDependencies
>;
