import { Reducer } from "redux";
import { DailyForecast, Coordinates, ObservedAt } from "../interfaces";
import { WeatherForecastActions } from "./";
import { ActionTypes } from "./actions";

export interface State {
  readonly coordinates?: Coordinates;
  readonly days?: number;
  readonly units?: string;
  readonly weatherForecast: ReadonlyArray<DailyForecast>;
  readonly timezone?: string;
  readonly activeDay: number;
  readonly loading: boolean;
  readonly error?: string;
  readonly allowDaySelection: boolean;
  readonly observedAt?: ObservedAt;
  readonly observedAtTime?: Date;
  readonly showFooter?: boolean;
}

export const initialState: State = {
  weatherForecast: [],
  days: 5,
  loading: false,
  activeDay: 0,
  allowDaySelection: false,
  showFooter: true,
};

export const reducer: Reducer<State, WeatherForecastActions> = (state = initialState, action) => {
  if (!action) return state;

  switch (action.type) {
    case ActionTypes.FETCH_WEATHER_FORECAST_DATA:
      return {
        ...state,
        coordinates: action.payload.coordinates,
        days: action.payload.days,
        units: action.payload.units,
        showFooter: action.payload.showFooter,
        loading: true,
        error: undefined,
        activeDay: 0,
      };
    case ActionTypes.WEATHER_FORECAST_DATA_FETCHED_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        activeDay: 0,
        weatherForecast: action.payload.weatherForecast,
        timezone: action.payload.timezone,
      };
    case ActionTypes.WEATHER_FORECAST_DATA_FETCHED_ERROR:
      return {
        ...state,
        coordinates: {
          lat: undefined,
          lon: undefined,
          stationId: undefined,
        },
        loading: false,
        error: action.payload.message,
        activeDay: 0,
        days: 5,
        showFooter: true,
      };
    case ActionTypes.SELECT_ACTIVE_DAY:
      return {
        ...state,
        activeDay: action.payload.activeDay,
      };
    case ActionTypes.SET_ALLOW_DAY_SELECTION:
      return {
        ...state,
        allowDaySelection: action.payload.allowDaySelection,
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
        showFooter: true,
      };
    case ActionTypes.HIDE_FOOTER:
      return {
        ...state,
        showFooter: false,
      };
    default:
      return state;
  }
};
