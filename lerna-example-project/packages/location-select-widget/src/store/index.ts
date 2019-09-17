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

export interface LocationSelectState extends I18nState {
  readonly locationSelectState: State;
}
export type LocationSelectActions = Actions | I18nActions;
export interface EpicDependencies {
  readonly api: ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
}
export interface PublicApiCallbacks {
  readonly loadingStateDidChange?: (loading: boolean) => void;
  readonly stationsStateDidChange?: (stations?: ReadonlyArray<Station>) => void;
  readonly selectedStationDidChange?: (station?: Station) => void;
  readonly isDropdownExpandedDidChange?: (isDropdownExpanded: boolean) => void;
  readonly onError?: (error?: string) => void;
  readonly isSameStationSelected?: (station?: Station) => void;
}
export type LocationSelectEpic = Epic<
  LocationSelectActions,
  LocationSelectActions,
  LocationSelectState,
  EpicDependencies
>;
