import { Action, ActionCreator } from "redux";
import { DailyForecast, Coordinates, ObservedAt, HourlyObservationData } from "../interfaces";

export const enum ActionTypes {
  FETCH_PREMIUM_WEATHER_FORECAST_DATA = "FETCH_PREMIUM_WEATHER_FORECAST_DATA",
  PREMIUM_WEATHER_FORECAST_DATA_FETCHED_SUCCESS = "PREMIUM_WEATHER_FORECAST_DATA_FETCHED_SUCCESS",
  PREMIUM_WEATHER_FORECAST_DATA_FETCHED_ERROR = "PREMIUM_WEATHER_FORECAST_DATA_FETCHED_ERROR",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  FETCH_OBSERVED_AT_DATA = "FETCH_OBSERVED_AT_DATA",
  FETCH_OBSERVED_AT_DATA_SUCCESS = "FETCH_OBSERVED_AT_DATA_SUCCESS",
  FETCH_OBSERVED_AT_DATA_ERROR = "FETCH_OBSERVED_AT_DATA_ERROR",
  PREMIUM_WEATHER_FORECAST_REQUEST = "PREMIUM_WEATHER_FORECAST_REQUEST",
  PREMIUM_WEATHER_REQUEST_SUCCESS = "PREMIUM_WEATHER_REQUEST_SUCCESS",
  PREMIUM_WEATHER_REQUEST_ERROR = "PREMIUM_WEATHER_REQUEST_ERROR",
}

export type Actions =
  | FetchPremiumWeatherForecastData
  | PremiumWeatherForecastFetchedDataSuccess
  | PremiumWeatherForecastFetchedDataError
  | SetErrorMessage
  | FetchObservedAtData
  | ObservedAtDataSuccess
  | ObservedAtDataError
  | PremiumWeatherForecastRequest
  | PremiumWeatherRequestSuccess
  | PremiumWeatherRequestError;

export interface FetchPremiumWeatherForecastData extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_PREMIUM_WEATHER_FORECAST_DATA;
  readonly payload: {
    readonly coordinates: Coordinates;
    readonly days?: number;
    readonly units?: string;
  };
}

export const fetchPremiumWeatherForecastData: ActionCreator<FetchPremiumWeatherForecastData> = (
  coordinates: Coordinates,
  days?: number,
  units?: string,
) => ({
  type: ActionTypes.FETCH_PREMIUM_WEATHER_FORECAST_DATA,
  payload: {
    coordinates,
    days,
    units,
  },
});

export interface PremiumWeatherForecastFetchedDataSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.PREMIUM_WEATHER_FORECAST_DATA_FETCHED_SUCCESS;
  readonly payload: {
    readonly weatherForecast: ReadonlyArray<DailyForecast>;
    readonly hourlyObservation: ReadonlyArray<HourlyObservationData>;
    readonly timezone?: string;
  };
}

export const premiumWeatherForecastFetchedDataSuccess: ActionCreator<
  PremiumWeatherForecastFetchedDataSuccess
> = (
  weatherForecast: ReadonlyArray<DailyForecast>,
  hourlyObservation: ReadonlyArray<HourlyObservationData>,
  timezone?: string,
) => ({
  type: ActionTypes.PREMIUM_WEATHER_FORECAST_DATA_FETCHED_SUCCESS,
  payload: {
    weatherForecast,
    hourlyObservation,
    timezone,
  },
});

export interface PremiumWeatherForecastFetchedDataError extends Action<ActionTypes> {
  readonly type: ActionTypes.PREMIUM_WEATHER_FORECAST_DATA_FETCHED_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const premiumWeatherForecastFetchedDataError: ActionCreator<
  PremiumWeatherForecastFetchedDataError
> = (errorMessage: string) => ({
  type: ActionTypes.PREMIUM_WEATHER_FORECAST_DATA_FETCHED_ERROR,
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

export interface PremiumWeatherForecastRequest extends Action<ActionTypes> {
  readonly type: ActionTypes.PREMIUM_WEATHER_FORECAST_REQUEST;
  readonly payload: {
    readonly user: string;
    readonly widgetName: string;
    readonly coordinates: Coordinates;
    readonly days?: number;
    readonly units?: string;
  };
}

export const premiumWeatherForecastRequest: ActionCreator<PremiumWeatherForecastRequest> = (
  user: string,
  widgetName: string,
  coordinates: Coordinates,
  days?: number,
  units?: string,
) => ({
  type: ActionTypes.PREMIUM_WEATHER_FORECAST_REQUEST,
  payload: {
    user,
    widgetName,
    coordinates,
    days,
    units,
  },
});

export interface PremiumWeatherRequestSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.PREMIUM_WEATHER_REQUEST_SUCCESS;
}

export const premiumWeatherRequestSuccess: ActionCreator<PremiumWeatherRequestSuccess> = () => ({
  type: ActionTypes.PREMIUM_WEATHER_REQUEST_SUCCESS,
});

export interface PremiumWeatherRequestError extends Action<ActionTypes> {
  readonly type: ActionTypes.PREMIUM_WEATHER_REQUEST_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const premiumWeatherRequestError: ActionCreator<PremiumWeatherRequestError> = (
  errorMessage: string,
) => ({
  type: ActionTypes.PREMIUM_WEATHER_REQUEST_ERROR,
  payload: new Error(errorMessage),
  error: true,
});
