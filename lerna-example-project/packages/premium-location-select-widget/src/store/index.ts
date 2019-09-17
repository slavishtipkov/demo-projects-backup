import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { Epic } from "redux-observable";
import { ApiService } from "../services/";
import { Actions } from "./actions";
import { State } from "./reducers";
import { Station } from "../interfaces";

export * from "./actions";
export * from "./epics";
export * from "./reducers";
export * from "./selectors";

export interface PremiumLocationSelectState extends I18nState {
  readonly locationSelectState: State;
}
export type PremiumLocationSelectActions = Actions | I18nActions;
export interface EpicDependencies {
  readonly locationSelectApi: ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
}
export interface PublicApiCallbacks {
  readonly loadingStateDidChange?: (loading: boolean) => void;
  readonly stationsStateDidChange?: (stations?: ReadonlyArray<Station>) => void;
  readonly selectedStationDidChange?: (station?: Station) => void;
  readonly isDropdownExpandedDidChange?: (isDropdownExpanded: boolean) => void;
  readonly onError?: (error?: string) => void;
}
export type PremiumLocationSelectEpic = Epic<
  PremiumLocationSelectActions,
  PremiumLocationSelectActions,
  PremiumLocationSelectState,
  EpicDependencies
>;
