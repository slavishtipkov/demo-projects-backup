import { Reducer } from "redux";
import {
  Coordinates,
  HourlySurfaceData,
  DailySurfaceData,
  ForecastProps,
  ObservedAt,
} from "../interfaces";
import { CurrentConditionsActions } from "./";
import { ActionTypes } from "./actions";

export interface State {
  readonly coordinates?: Coordinates;
  readonly currentConditionsByObservation?: ReadonlyArray<HourlySurfaceData>;
  readonly currentConditionsByForecast?: ReadonlyArray<DailySurfaceData>;
  readonly timezone?: string;
  readonly loading: boolean;
  readonly error?: string;
  readonly days?: number;
  readonly visibleFields?: ForecastProps;
  readonly units?: string;
  readonly observedAt?: ObservedAt;
  readonly observedAtTime?: Date;
  readonly showCurrentObservation?: boolean;
}

export const initialState: State = {
  loading: false,
};

export const reducer: Reducer<State, CurrentConditionsActions> = (state = initialState, action) => {
  if (!action) return state;
  switch (action.type) {
    case ActionTypes.FETCH_CURRENT_CONDITIONS_DATA:
      return {
        ...state,
        coordinates: action.payload.coordinates,
        loading: true,
        error: undefined,
      };
    case ActionTypes.FETCH_CURRENT_CONDITIONS_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        currentConditionsByObservation: action.payload.currentConditionsByObservation,
        currentConditionsByForecast: action.payload.currentConditionsByForecast,
        timezone: action.payload.timezone,
      };
    case ActionTypes.FETCH_CURRENT_CONDITIONS_DATA_ERROR:
      return {
        ...state,
        coordinates: {
          lat: undefined,
          lon: undefined,
          stationId: undefined,
        },
        loading: false,
        error: action.payload.message,
      };
    case ActionTypes.SET_ERROR_MESSAGE:
      return {
        ...state,
        error: action.payload.message,
      };
    case ActionTypes.FETCH_OBSERVED_AT_DATA:
      return {
        ...state,
        coordinates: action.payload.coordinates,
      };
    case ActionTypes.FETCH_OBSERVED_AT_DATA_SUCCESS:
      return {
        ...state,
        observedAt: action.payload.observedAt,
        observedAtTime: new Date(),
      };
    case ActionTypes.FETCH_OBSERVED_AT_DATA_ERROR:
      return {
        ...state,
        error: action.payload.message,
      };
    case ActionTypes.CHANGE_CURRENT_CONDITIONS_BY_FORECAST:
      return {
        ...state,
        currentConditionsByForecast: action.payload.currentConditionsByForecast,
      };
    default:
      return state;
  }
};
