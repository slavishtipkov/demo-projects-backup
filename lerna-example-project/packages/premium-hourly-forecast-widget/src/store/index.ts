import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { Epic } from "redux-observable";
import { ApiService } from "../services/";
import { Actions } from "./actions";
import { State } from "./reducers";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as PremiumLocationSelectWidget from "@dtn/premium-location-select-widget";
import { PostalCode, Coordinates, Station } from "../public/library";

export * from "./actions";
export * from "./epics";
export * from "./reducers";
export * from "./selectors";

export interface HourlyForecastState extends I18nState {
  readonly hourlyForecast: State;
  readonly zipCodeState: ZipCodeWidget.State;
  readonly locationSelectState: PremiumLocationSelectWidget.State;
}
export type HourlyForecastActions =
  | Actions
  | I18nActions
  | ZipCodeWidget.ZipCodeActions
  | PremiumLocationSelectWidget.PremiumLocationSelectActions;
export interface EpicDependencies {
  readonly api: ApiService;
  readonly zipApi: ZipCodeWidget.ApiService;
  readonly locationSelectApi: PremiumLocationSelectWidget.ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
}
export interface PublicApiCallbacks {
  readonly onStationChange: (newStation: Station) => void;
  readonly onPostalCodeChange: (newPostalCode: PostalCode & Coordinates) => void;
  readonly onWeatherChange: (newCoordinates: Coordinates) => void;
}
export type HourlyForecastEpic = Epic<
  HourlyForecastActions,
  HourlyForecastActions,
  HourlyForecastState,
  EpicDependencies
>;
