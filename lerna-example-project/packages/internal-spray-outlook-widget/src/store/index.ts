import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { Epic } from "redux-observable";
import { View } from "../interfaces";
import { ApiService } from "../services/";
import { Actions } from "./actions";
import { State } from "./reducers";

export * from "./actions";
export * from "./epics";
export * from "./reducers";
export * from "./selectors";

export interface SprayOutlookState extends I18nState {
  readonly sprayOutlook: State;
}
export type SprayOutlookActions = Actions | I18nActions;
export interface EpicDependencies {
  readonly api: ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
}
export interface PublicApiCallbacks {
  readonly viewDidChange?: (view: View) => void;
  readonly settingsDidSave?: () => void;
}
export type SprayOutlookEpic = Epic<
  SprayOutlookActions,
  SprayOutlookActions,
  SprayOutlookState,
  EpicDependencies
>;
