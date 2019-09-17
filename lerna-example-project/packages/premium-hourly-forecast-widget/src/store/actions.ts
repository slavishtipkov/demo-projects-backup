import { Action, ActionCreator } from "redux";
import { HourlyForecast, Coordinates, ObservedAt, DayForecast } from "../interfaces";

export const enum ActionTypes {
  FETCH_HOURLY_FORECAST_DATA = "FETCH_HOURLY_FORECAST_DATA",
  HOURLY_FORECAST_DATA_FETCHED_SUCCESS = "HOURLY_FORECAST_DATA_FETCHED_SUCCESS",
  HOURLY_FORECAST_DATA_FETCHED_ERROR = "HOURLY_FORECAST_DATA_FETCHED_ERROR",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  FETCH_OBSERVED_AT_DATA = "ETCH_OBSERVED_AT_DATA",
  FETCH_OBSERVED_AT_DATA_SUCCESS = "FETCH_OBSERVED_AT_DATA_SUCCESS",
  FETCH_OBSERVED_AT_DATA_ERROR = "FETCH_OBSERVED_AT_DATA_ERROR",
  FETCH_DAY_FORECAST_DATA = "FETCH_DAY_FORECAST_DATA",
  DAY_FORECAST_DATA_FETCHED_SUCCESS = "DAY_FORECAST_DATA_FETCHED_SUCCESS",
  DAY_FORECAST_DATA_FETCHED_ERROR = "DAY_FORECAST_DATA_FETCHED_ERROR",
  PREMIUM_HOURLY_FORECAST_REQUEST = "PREMIUM_HOURLY_FORECAST_REQUEST",
  PREMIUM_HOURLY_REQUEST_SUCCESS = "PREMIUM_HOURLY_REQUEST_SUCCESS",
  PREMIUM_HOURLY_REQUEST_ERROR = "PREMIUM_HOURLY_REQUEST_ERROR",
}

export type Actions =
  | FetchHourlyForecastData
  | HourlyForecastFetchedSuccess
  | HourlyForecastFetchedError
  | SetErrorMessage
  | FetchObservedAtData
  | ObservedAtDataSuccess
  | ObservedAtDataError
  | FetchDayForecastData
  | DayForecastFetchedSuccess
  | DayForecastFetchedError
  | PremiumHourlyForecastRequest
  | PremiumHourlyRequestSuccess
  | PremiumHourlyRequestError;

export interface FetchHourlyForecastData extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_HOURLY_FORECAST_DATA;
  readonly payload: {
    readonly coordinates: Coordinates;
    readonly days?: number;
    readonly units?: string;
  };
}

export const fetchHourlyForecastData: ActionCreator<FetchHourlyForecastData> = (
  coordinates: Coordinates,
  days?: number,
  units?: string,
) => ({
  type: ActionTypes.FETCH_HOURLY_FORECAST_DATA,
  payload: {
    coordinates,
    days,
    units,
  },
});

export interface HourlyForecastFetchedSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.HOURLY_FORECAST_DATA_FETCHED_SUCCESS;
  readonly payload: {
    readonly weatherForecast: ReadonlyArray<HourlyForecast>;
  };
}

export const hourlyForecastFetchedSuccess: ActionCreator<HourlyForecastFetchedSuccess> = (
  weatherForecast: ReadonlyArray<HourlyForecast>,
) => ({
  type: ActionTypes.HOURLY_FORECAST_DATA_FETCHED_SUCCESS,
  payload: {
    weatherForecast,
  },
});

export interface HourlyForecastFetchedError extends Action<ActionTypes> {
  readonly type: ActionTypes.HOURLY_FORECAST_DATA_FETCHED_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const hourlyForecastFetchedError: ActionCreator<HourlyForecastFetchedError> = (
  errorMessage: string,
) => ({
  type: ActionTypes.HOURLY_FORECAST_DATA_FETCHED_ERROR,
  payload: new Error(errorMessage),
  error: true,
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

export interface FetchDayForecastData extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_DAY_FORECAST_DATA;
  readonly payload: {
    readonly coordinates: Coordinates;
    readonly days?: number;
    readonly units?: string;
  };
}

export const fetchDayForecastData: ActionCreator<FetchDayForecastData> = (
  coordinates: Coordinates,
  days?: number,
  units?: string,
) => ({
  type: ActionTypes.FETCH_DAY_FORECAST_DATA,
  payload: {
    coordinates,
    days,
    units,
  },
});

export interface DayForecastFetchedSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.DAY_FORECAST_DATA_FETCHED_SUCCESS;
  readonly payload: {
    readonly dayForecast: ReadonlyArray<DayForecast>;
    readonly timezone: string;
  };
}

export const dayForecastFetchedSuccess: ActionCreator<DayForecastFetchedSuccess> = (
  dayForecast: ReadonlyArray<DayForecast>,
  timezone: string,
) => ({
  type: ActionTypes.DAY_FORECAST_DATA_FETCHED_SUCCESS,
  payload: {
    dayForecast,
    timezone,
  },
});

export interface DayForecastFetchedError extends Action<ActionTypes> {
  readonly type: ActionTypes.DAY_FORECAST_DATA_FETCHED_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const dayForecastFetchedError: ActionCreator<DayForecastFetchedError> = (
  errorMessage: string,
) => ({
  type: ActionTypes.DAY_FORECAST_DATA_FETCHED_ERROR,
  payload: new Error(errorMessage),
  error: true,
});

export interface PremiumHourlyForecastRequest extends Action<ActionTypes> {
  readonly type: ActionTypes.PREMIUM_HOURLY_FORECAST_REQUEST;
  readonly payload: {
    readonly user: string;
    readonly widgetName: string;
    readonly coordinates: Coordinates;
    readonly days?: number;
    readonly units?: string;
  };
}

export const premiumHourlyForecastRequest: ActionCreator<PremiumHourlyForecastRequest> = (
  user: string,
  widgetName: string,
  coordinates: Coordinates,
  days?: number,
  units?: string,
) => ({
  type: ActionTypes.PREMIUM_HOURLY_FORECAST_REQUEST,
  payload: {
    user,
    widgetName,
    coordinates,
    days,
    units,
  },
});

export interface PremiumHourlyRequestSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.PREMIUM_HOURLY_REQUEST_SUCCESS;
}

export const premiumHourlyRequestSuccess: ActionCreator<PremiumHourlyRequestSuccess> = () => ({
  type: ActionTypes.PREMIUM_HOURLY_REQUEST_SUCCESS,
});

export interface PremiumHourlyRequestError extends Action<ActionTypes> {
  readonly type: ActionTypes.PREMIUM_HOURLY_REQUEST_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const premiumHourlyRequestError: ActionCreator<PremiumHourlyRequestError> = (
  errorMessage: string,
) => ({
  type: ActionTypes.PREMIUM_HOURLY_REQUEST_ERROR,
  payload: new Error(errorMessage),
  error: true,
});
