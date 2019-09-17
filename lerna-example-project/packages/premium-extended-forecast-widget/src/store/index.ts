import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { Epic } from "redux-observable";
import { ApiService } from "../services/";
import { Actions } from "./actions";
import { State } from "./reducers";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as PremiumLocationSelectWidget from "@dtn/premium-location-select-widget";
import { Station, PostalCode, Coordinates } from "../public/library";

export * from "./actions";
export * from "./epics";
export * from "./reducers";
export * from "./selectors";

export interface PremiumWeatherForecastState extends I18nState {
  readonly premiumWeatherForecast: State;
  readonly zipCodeState: ZipCodeWidget.State;
  readonly locationSelectState: PremiumLocationSelectWidget.State;
}
export type PremiumWeatherForecastActions =
  | Actions
  | I18nActions
  | ZipCodeWidget.ZipCodeActions
  | PremiumLocationSelectWidget.PremiumLocationSelectActions;
export interface EpicDependencies {
  readonly api: ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
  readonly zipApi: ZipCodeWidget.ApiService;
  readonly locationSelectApi: PremiumLocationSelectWidget.ApiService;
}
export interface PublicApiCallbacks {
  readonly onStationChange: (newStation: Station) => void;
  readonly onPostalCodeChange: (newPostalCode: PostalCode & Coordinates) => void;
  readonly onWeatherChange: (newCoordinates: Coordinates) => void;
}
export type PremiumWeatherForecastEpic = Epic<
  PremiumWeatherForecastActions,
  PremiumWeatherForecastActions,
  PremiumWeatherForecastState,
  EpicDependencies
>;
