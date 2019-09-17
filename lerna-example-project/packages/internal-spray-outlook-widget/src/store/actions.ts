import { Action, ActionCreator } from "redux";
import {
  GetThresholdSettings,
  Location,
  StationOutlook,
  ThresholdSettings,
  View,
} from "../interfaces";

export const enum ActionTypes {
  FETCH_SPRAY_OUTLOOK = "FETCH_SPRAY_OUTLOOK",
  SPRAY_OUTLOOK_FETCHED = "SPRAY_OUTLOOK_FETCHED",
  FETCH_THRESHOLD_SETTINGS = "FETCH_THRESHOLD_SETTINGS",
  THRESHOLD_SETTINGS_FETCHED = "THRESHOLD_SETTINGS_FETCHED",
  FETCH_THRESHOLD_DEFAULTS = "FETCH_THRESHOLD_DEFAULTS",
  THRESHOLD_DEFAULTS_FETCHED = "THRESHOLD_DEFAULTS_FETCHED",
  SAVE_THRESHOLD_SETTINGS = "SAVE_THRESHOLD_SETTINGS",
  THRESHOLD_SETTINGS_SAVED = "SAVE_THRESHOLD_SETTINGS_SAVED",
  CHANGE_VIEW = "CHANGE_VIEW",
}

export type Actions =
  | ThresholdSettingsSavedAction
  | ChangeViewAction
  | ThresholdDefaultsFetchedAction
  | FetchSprayOutlookAction
  | ThresholdDefaultsFetchedAction
  | FetchThresholdDefaultsAction
  | SprayOutlookFetchedAction
  | FetchThresholdDefaultsAction
  | SaveThresholdSettingsAction
  | ThresholdSettingsFetchedAction
  | FetchThresholdSettingsAction;

export interface FetchSprayOutlookAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_SPRAY_OUTLOOK;
  readonly payload: {
    readonly locations: ReadonlyArray<Location>;
    readonly numberOfDays: number;
    readonly includeHours: boolean;
  };
}

export const fetchSprayOutlookAction: ActionCreator<FetchSprayOutlookAction> = ({
  locations,
  numberOfDays = 7,
  includeHours = true,
}: {
  readonly locations: ReadonlyArray<Location>;
  readonly numberOfDays: number;
  readonly includeHours: boolean;
}) => ({
  type: ActionTypes.FETCH_SPRAY_OUTLOOK,
  payload: {
    locations,
    numberOfDays,
    includeHours,
  },
});

export interface SprayOutlookFetchedAction extends Action<ActionTypes> {
  readonly type: ActionTypes.SPRAY_OUTLOOK_FETCHED;
  readonly payload: {
    readonly sprayOutlook: ReadonlyArray<StationOutlook>;
  };
}

export const sprayOutlookFetchedAction: ActionCreator<SprayOutlookFetchedAction> = (
  sprayOutlook: ReadonlyArray<StationOutlook>,
) => ({
  type: ActionTypes.SPRAY_OUTLOOK_FETCHED,
  payload: {
    sprayOutlook,
  },
});

export interface FetchThresholdSettingsAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_THRESHOLD_SETTINGS;
}

export const fetchThresholdSettingsAction: ActionCreator<FetchThresholdSettingsAction> = () => ({
  type: ActionTypes.FETCH_THRESHOLD_SETTINGS,
});

export interface ThresholdSettingsFetchedAction extends Action<ActionTypes> {
  readonly type: ActionTypes.THRESHOLD_SETTINGS_FETCHED;
  readonly payload: {
    readonly settings: GetThresholdSettings;
  };
}

export const thresholdSettingsFetchedAction: ActionCreator<ThresholdSettingsFetchedAction> = (
  settings: GetThresholdSettings,
) => ({
  type: ActionTypes.THRESHOLD_SETTINGS_FETCHED,
  payload: {
    settings,
  },
});

export interface FetchThresholdDefaultsAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_THRESHOLD_DEFAULTS;
}

export const fetchThresholdDefaultsAction: ActionCreator<FetchThresholdDefaultsAction> = () => ({
  type: ActionTypes.FETCH_THRESHOLD_DEFAULTS,
});

export interface ThresholdDefaultsFetchedAction extends Action<ActionTypes> {
  readonly type: ActionTypes.THRESHOLD_DEFAULTS_FETCHED;
  readonly payload: {
    readonly defaults: GetThresholdSettings;
  };
}

export const thresholdDefaultsFetchedAction: ActionCreator<ThresholdDefaultsFetchedAction> = (
  defaults: GetThresholdSettings,
) => ({
  type: ActionTypes.THRESHOLD_DEFAULTS_FETCHED,
  payload: {
    defaults,
  },
});

export interface SaveThresholdSettingsAction extends Action<ActionTypes> {
  readonly type: ActionTypes.SAVE_THRESHOLD_SETTINGS;
  readonly payload: {
    readonly settings: ThresholdSettings;
  };
}

export const saveThresholdSettingsAction: ActionCreator<SaveThresholdSettingsAction> = (
  settings: ThresholdSettings,
) => ({
  type: ActionTypes.SAVE_THRESHOLD_SETTINGS,
  payload: {
    settings,
  },
});

export interface ThresholdSettingsSavedAction extends Action<ActionTypes> {
  readonly type: ActionTypes.THRESHOLD_SETTINGS_SAVED;
  readonly payload: {
    readonly settings: GetThresholdSettings;
  };
}

export const thresholdSettingsSavedAction: ActionCreator<ThresholdSettingsSavedAction> = (
  settings: GetThresholdSettings,
) => ({
  type: ActionTypes.THRESHOLD_SETTINGS_SAVED,
  payload: {
    settings,
  },
});

export interface ChangeViewAction extends Action<ActionTypes> {
  readonly type: ActionTypes.CHANGE_VIEW;
  readonly payload: View;
}

export const changeViewAction: ActionCreator<ChangeViewAction> = (view: View) => ({
  type: ActionTypes.CHANGE_VIEW,
  payload: view,
});
