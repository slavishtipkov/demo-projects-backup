import { Action, ActionCreator } from "redux";
import { DailyForecast, Coordinates, ObservedAt } from "../interfaces";

export const enum ActionTypes {
  FETCH_WEATHER_FORECAST_DATA = "FETCH_WEATHER_FORECAST_DATA",
  WEATHER_FORECAST_DATA_FETCHED_SUCCESS = "WEATHER_FORECAST_DATA_FETCHED_SUCCESS",
  WEATHER_FORECAST_DATA_FETCHED_ERROR = "WEATHER_FORECAST_DATA_FETCHED_ERROR",
  SELECT_ACTIVE_DAY = "SELECT_SELECT_ACTIVE_DAY_DAY",
  SET_ALLOW_DAY_SELECTION = "SET_ALLOW_DAY_SELECTION",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  FETCH_OBSERVED_AT_DATA = "ETCH_OBSERVED_AT_DATA",
  FETCH_OBSERVED_AT_DATA_SUCCESS = "FETCH_OBSERVED_AT_DATA_SUCCESS",
  FETCH_OBSERVED_AT_DATA_ERROR = "FETCH_OBSERVED_AT_DATA_ERROR",
  HIDE_FOOTER = "HIDE_FOOTER",
}

export type Actions =
  | FetchWeatherForecastData
  | WeatherForecastFetchedDataSuccess
  | WeatherForecastFetchedDataError
  | SelectActiveDay
  | SetAllowDaySelection
  | SetErrorMessage
  | FetchObservedAtData
  | ObservedAtDataSuccess
  | ObservedAtDataError
  | HideFooter;

export interface FetchWeatherForecastData extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_WEATHER_FORECAST_DATA;
  readonly payload: {
    readonly coordinates: Coordinates;
    readonly days?: number;
    readonly units?: string;
    readonly showFooter?: boolean;
  };
}

export const fetchWeatherForecastData: ActionCreator<FetchWeatherForecastData> = (
  coordinates: Coordinates,
  days?: number,
  units?: string,
  showFooter?: boolean,
) => ({
  type: ActionTypes.FETCH_WEATHER_FORECAST_DATA,
  payload: {
    coordinates,
    days,
    units,
    showFooter,
  },
});

export interface WeatherForecastFetchedDataSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.WEATHER_FORECAST_DATA_FETCHED_SUCCESS;
  readonly payload: {
    readonly weatherForecast: ReadonlyArray<DailyForecast>;
    readonly timezone?: string;
  };
}

export const weatherForecastFetchedDataSuccess: ActionCreator<WeatherForecastFetchedDataSuccess> = (
  weatherForecast: ReadonlyArray<DailyForecast>,
  timezone?: string,
) => ({
  type: ActionTypes.WEATHER_FORECAST_DATA_FETCHED_SUCCESS,
  payload: {
    weatherForecast,
    timezone,
  },
});

export interface WeatherForecastFetchedDataError extends Action<ActionTypes> {
  readonly type: ActionTypes.WEATHER_FORECAST_DATA_FETCHED_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const weatherForecastFetchedDataError: ActionCreator<WeatherForecastFetchedDataError> = (
  errorMessage: string,
) => ({
  type: ActionTypes.WEATHER_FORECAST_DATA_FETCHED_ERROR,
  payload: new Error(errorMessage),
  error: true,
});

export interface SelectActiveDay extends Action<ActionTypes> {
  readonly type: ActionTypes.SELECT_ACTIVE_DAY;
  readonly payload: {
    readonly activeDay: number;
  };
}

export const selectActiveDayAction: ActionCreator<SelectActiveDay> = (activeDay: number) => ({
  type: ActionTypes.SELECT_ACTIVE_DAY,
  payload: {
    activeDay,
  },
});

export interface SetAllowDaySelection extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_ALLOW_DAY_SELECTION;
  readonly payload: {
    readonly allowDaySelection: boolean;
  };
}

export const selectAllowDaySelectionAction: ActionCreator<SetAllowDaySelection> = (
  allowDaySelection: boolean,
) => ({
  type: ActionTypes.SET_ALLOW_DAY_SELECTION,
  payload: {
    allowDaySelection,
  },
});

export interface SetErrorMessage extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_ERROR_MESSAGE;
  readonly payload: Error;
  readonly error?: boolean;
}

export const setErrorMessage: ActionCreator<SetErrorMessage> = (error: string) => ({
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

export interface HideFooter extends Action<ActionTypes> {
  readonly type: ActionTypes.HIDE_FOOTER;
}

export const hideFooter: ActionCreator<HideFooter> = () => ({
  type: ActionTypes.HIDE_FOOTER,
});
