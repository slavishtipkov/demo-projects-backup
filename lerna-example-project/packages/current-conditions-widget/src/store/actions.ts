import { Action, ActionCreator } from "redux";
import { HourlySurfaceData, DailySurfaceData, ObservedAt, Coordinates } from "../interfaces";

export const enum ActionTypes {
  FETCH_CURRENT_CONDITIONS_DATA = "FETCH_CURRENT_CONDITIONS_DATA",
  FETCH_CURRENT_CONDITIONS_DATA_SUCCESS = "FETCH_CURRENT_CONDITIONS_DATA_SUCCESS",
  FETCH_CURRENT_CONDITIONS_DATA_ERROR = "FETCH_CURRENT_CONDITIONS_DATA_ERROR",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  FETCH_OBSERVED_AT_DATA = "FETCH_OBSERVED_AT_DATA",
  FETCH_OBSERVED_AT_DATA_SUCCESS = "FETCH_OBSERVED_AT_DATA_SUCCESS",
  FETCH_OBSERVED_AT_DATA_ERROR = "FETCH_OBSERVED_AT_DATA_ERROR",
  CHANGE_CURRENT_CONDITIONS_BY_OBSERVATION = "CHANGE_CURRENT_CONDITIONS_BY_OBSERVATION",
  CHANGE_CURRENT_CONDITIONS_BY_FORECAST = "CHANGE_CURRENT_CONDITIONS_BY_FORECAST",
}

export type Actions =
  | FetchCurrentConditionsDataAction
  | FetchCurrentConditionsDataSuccessAction
  | FetchCurrentConditionsDataErrorAction
  | SetErrorMessageAction
  | FetchObservedAtData
  | ObservedAtDataSuccess
  | ObservedAtDataError
  | ChangeCurrentConditionsByForecast;

export interface FetchCurrentConditionsDataAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_CURRENT_CONDITIONS_DATA;
  readonly payload: {
    readonly coordinates: Coordinates;
    readonly days: number;
    readonly units: string;
  };
}

export const fetchCurrentConditionsDataAction: ActionCreator<FetchCurrentConditionsDataAction> = (
  coordinates,
  days,
  units,
) => ({
  type: ActionTypes.FETCH_CURRENT_CONDITIONS_DATA,
  payload: {
    coordinates,
    days,
    units,
  },
});

export interface FetchCurrentConditionsDataSuccessAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_CURRENT_CONDITIONS_DATA_SUCCESS;
  readonly payload: {
    readonly currentConditionsByObservation: ReadonlyArray<HourlySurfaceData>;
    readonly currentConditionsByForecast: ReadonlyArray<DailySurfaceData>;
    readonly timezone?: string;
  };
}

export const fetchCurrentConditionsDataSuccessAction: ActionCreator<
  FetchCurrentConditionsDataSuccessAction
> = (
  currentConditionsByObservation: ReadonlyArray<HourlySurfaceData>,
  currentConditionsByForecast: ReadonlyArray<DailySurfaceData>,
  timezone?: string,
) => ({
  type: ActionTypes.FETCH_CURRENT_CONDITIONS_DATA_SUCCESS,
  payload: {
    currentConditionsByObservation,
    currentConditionsByForecast,
    timezone,
  },
});

export interface FetchCurrentConditionsDataErrorAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_CURRENT_CONDITIONS_DATA_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const fetchCurrentConditionsDataErrorAction: ActionCreator<
  FetchCurrentConditionsDataErrorAction
> = (error: string) => ({
  type: ActionTypes.FETCH_CURRENT_CONDITIONS_DATA_ERROR,
  payload: new Error(error),
  error: true,
});

export interface SetErrorMessageAction extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_ERROR_MESSAGE;
  readonly payload: Error;
  readonly error?: boolean;
}

export const setErrorMessageAction: ActionCreator<SetErrorMessageAction> = (error: string) => ({
  type: ActionTypes.SET_ERROR_MESSAGE,
  payload: new Error(error),
  error: true,
});

export interface FetchObservedAtData extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_OBSERVED_AT_DATA;
  readonly payload: {
    readonly coordinates: Coordinates;
  };
}

export const fetchObservedAtData: ActionCreator<FetchObservedAtData> = (
  coordinates: Coordinates,
) => ({
  type: ActionTypes.FETCH_OBSERVED_AT_DATA,
  payload: {
    coordinates,
  },
});

export interface ObservedAtDataSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_OBSERVED_AT_DATA_SUCCESS;
  readonly payload: {
    readonly observedAt: ObservedAt;
  };
}

export const observedAtDataSuccess: ActionCreator<ObservedAtDataSuccess> = (
  observedAt: ObservedAt,
) => ({
  type: ActionTypes.FETCH_OBSERVED_AT_DATA_SUCCESS,
  payload: {
    observedAt,
  },
});

export interface ObservedAtDataError extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_OBSERVED_AT_DATA_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const observedAtDataError: ActionCreator<ObservedAtDataError> = (errorMessage: string) => ({
  type: ActionTypes.FETCH_OBSERVED_AT_DATA_ERROR,
  payload: new Error(errorMessage),
  error: true,
});

export interface ChangeCurrentConditionsByForecast extends Action<ActionTypes> {
  readonly type: ActionTypes.CHANGE_CURRENT_CONDITIONS_BY_FORECAST;
  readonly payload: {
    readonly currentConditionsByForecast: ReadonlyArray<DailySurfaceData>;
  };
}

export const changeCurrentConditionsByForecast: ActionCreator<ChangeCurrentConditionsByForecast> = (
  currentConditionsByForecast: ReadonlyArray<DailySurfaceData>,
) => ({
  type: ActionTypes.CHANGE_CURRENT_CONDITIONS_BY_FORECAST,
  payload: {
    currentConditionsByForecast,
  },
});
