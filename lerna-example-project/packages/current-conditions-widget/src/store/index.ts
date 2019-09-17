import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { Epic } from "redux-observable";
import { ApiService } from "../services/";
import { Actions } from "./actions";
import { State } from "./reducers";
import { DailySurfaceData, HourlySurfaceData, Coordinates } from "../interfaces";

export * from "./actions";
export * from "./epics";
export * from "./reducers";
export * from "./selectors";

export interface CurrentConditionsState extends I18nState {
  readonly currentConditionsState: State;
}

export type CurrentConditionsActions = Actions | I18nActions;

export interface EpicDependencies {
  readonly api: ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
}

export interface PublicApiCallbacks {
  readonly loadingStateDidChange?: (loading?: boolean) => void;
  readonly coordinatesStateDidChange?: (coordinates?: Coordinates) => void;
  readonly currentConditionsDidChange?: (coordinates?: Coordinates) => void;
  readonly onError?: (error?: string) => void;
}

export type CurrentConditionsEpic = Epic<
  CurrentConditionsActions,
  CurrentConditionsActions,
  CurrentConditionsState,
  EpicDependencies
>;
