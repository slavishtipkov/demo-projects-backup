import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { Epic } from "redux-observable";
import { ApiService } from "../services/";
import { Actions } from "./actions";
import { State } from "./reducers";
import { CoordinatesDataObject } from "../interfaces";

export * from "./actions";
export * from "./epics";
export * from "./reducers";
export * from "./selectors";

export interface ZipCodeState extends I18nState {
  readonly zipCodeState: State;
}
export type ZipCodeActions = Actions | I18nActions;
export interface EpicDependencies {
  readonly zipApi: ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
}
export interface PublicApiCallbacks {
  readonly loadingStateDidChange?: (loadingState?: boolean) => void;
  readonly zipCodeDidChange?: (zipCode?: string) => void;
  readonly coordinatesDidChange?: (coordinates?: CoordinatesDataObject) => void;
  readonly onError?: (err?: string) => void;
}
export type ZipCodeEpic = Epic<ZipCodeActions, ZipCodeActions, ZipCodeState, EpicDependencies>;
