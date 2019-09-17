import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { Epic } from "redux-observable";
import { ApiService } from "../services/";
import { Actions } from "./actions";
import { SprayOutlookState } from "./reducers";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import { PostalCode, Coordinates } from "@dtn/types-lib";
import { SprayOutlookThresholds } from "@dtn/api-lib";

export * from "./actions";
export * from "./epics";
export * from "./reducers";
export * from "./selectors";

export interface NamespacedState extends I18nState {
  readonly sprayOutlook: SprayOutlookState;
}

export type SprayOutlookActions = Actions | I18nActions | ZipCodeWidget.ZipCodeActions;

export interface EpicDependencies {
  readonly api: ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
}

export interface PublicApiCallbacks {
  readonly onPostalCodeChange?: (newPostalCode: PostalCode & Coordinates) => void;
  readonly onOutlookChange?: (
    nextRecommendedSprayTime: Date | undefined,
    thresholds: SprayOutlookThresholds,
  ) => void;
}

export type SprayOutlookEpic = Epic<
  SprayOutlookActions,
  SprayOutlookActions,
  NamespacedState,
  EpicDependencies
>;
