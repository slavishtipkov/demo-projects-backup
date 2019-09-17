import { SprayOutlookForecast, SprayOutlookThresholds } from "@dtn/api-lib";
import { Coordinates } from "@dtn/types-lib";
import { Reducer } from "redux";
import { SprayOutlookActions } from "./";
import { ActionTypes } from "./actions";

export interface SprayOutlookState {
  readonly timezone?: string;
  readonly loading?: boolean;
  readonly sprayOutlook?: SprayOutlookForecast;
  readonly observedAtTime?: Date;
  readonly thresholds?: SprayOutlookThresholds;
  readonly coordinates?: Coordinates;
  readonly observedAt?: { readonly city: string; readonly time: Date };
}

export const initialState: SprayOutlookState = {};

export const reducer: Reducer<SprayOutlookState, SprayOutlookActions> = (
  state = initialState,
  action,
) => {
  if (!action) return state;

  switch (action.type) {
    case ActionTypes.FETCH_SPRAY_OUTLOOK_FORECAST_SUCCESS:
      return {
        ...state,
        sprayOutlook: action.payload.sprayOutlookForecast,
        observedAt: action.payload.observedAt,
        loading: false,
      };
    case ActionTypes.FETCH_SPRAY_OUTLOOK_FORECAST:
      return {
        ...state,
        coordinates: action.payload.coordinates,
        thresholds: action.payload.thresholds,
        loading: true,
      };
    case ActionTypes.SET_THRESHOLDS:
      return {
        ...state,
        thresholds: action.payload.thresholds,
      };
    default:
      return state;
  }
};
