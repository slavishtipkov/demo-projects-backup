import { Action, ActionCreator } from "redux";
import { Coordinates } from "@dtn/types-lib";
import { SprayOutlookThresholds, SprayOutlookForecast } from "@dtn/api-lib";

export const enum ActionTypes {
  FETCH_SPRAY_OUTLOOK_FORECAST = "FETCH_SPRAY_OUTLOOK_FORECAST",
  FETCH_SPRAY_OUTLOOK_FORECAST_SUCCESS = "FETCH_SPRAY_OUTLOOK_FORECAST_SUCCESS",
  SET_THRESHOLDS = "SET_THRESHOLDS",
}

export type Actions =
  | FetchSprayOutlookForecastAction
  | FetchSprayOutlookForecastSuccessAction
  | SetThresholdsAction;

export interface FetchSprayOutlookForecastAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_SPRAY_OUTLOOK_FORECAST;
  readonly payload: {
    readonly coordinates: Coordinates;
    readonly thresholds: SprayOutlookThresholds;
  };
}

export const fetchSprayOutlookForecast: ActionCreator<FetchSprayOutlookForecastAction> = (
  coordinates: Coordinates,
  thresholds: SprayOutlookThresholds,
) => ({
  type: ActionTypes.FETCH_SPRAY_OUTLOOK_FORECAST,
  payload: {
    coordinates,
    thresholds,
  },
});

export interface FetchSprayOutlookForecastSuccessAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_SPRAY_OUTLOOK_FORECAST_SUCCESS;
  readonly payload: {
    readonly sprayOutlookForecast: SprayOutlookForecast;
    readonly observedAt: { readonly city: string; readonly time: Date };
  };
}

export const fetchSprayOutlookForecastSuccess: ActionCreator<
  FetchSprayOutlookForecastSuccessAction
> = (
  sprayOutlookForecast: SprayOutlookForecast,
  observedAt: { readonly city: string; readonly time: Date },
) => ({
  type: ActionTypes.FETCH_SPRAY_OUTLOOK_FORECAST_SUCCESS,
  payload: {
    sprayOutlookForecast,
    observedAt,
  },
});

export interface SetThresholdsAction extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_THRESHOLDS;
  readonly payload: {
    readonly thresholds: SprayOutlookThresholds;
  };
}

export const setThresholds: ActionCreator<SetThresholdsAction> = (
  thresholds: SprayOutlookThresholds,
) => ({
  type: ActionTypes.SET_THRESHOLDS,
  payload: {
    thresholds,
  },
});
