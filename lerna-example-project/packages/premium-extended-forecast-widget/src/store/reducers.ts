import { Reducer } from "redux";
import {
  DailyForecast,
  Coordinates,
  ObservedAt,
  Station,
  HourlyObservationData,
} from "../interfaces";
import { PremiumWeatherForecastActions } from "./";
import { ActionTypes } from "./actions";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as PremiumLocationSelectWidget from "@dtn/premium-location-select-widget";

export interface State {
  readonly coordinates?: Coordinates;
  readonly days?: number;
  readonly units?: string;
  readonly weatherForecast: ReadonlyArray<DailyForecast>;
  readonly hourlyObservation: ReadonlyArray<HourlyObservationData>;
  readonly loading: boolean;
  readonly error?: string;
  readonly observedAt?: ObservedAt;
  readonly observedAtTime?: Date;
  readonly user: string;
  readonly widgetName: string;
  readonly coordinatesFromEpic: boolean;
  readonly showDailyForecast: boolean;
  readonly zipCode?: string;
  readonly selectedStation?: Station;
  readonly showStationSelect: boolean;
  readonly showZipCode: boolean;
  readonly hasSuccessPremiumRequest: boolean;
  readonly timezone?: string;
}

export const initialState: State = {
  weatherForecast: [],
  hourlyObservation: [],
  loading: false,
  user: "",
  widgetName: "premium-extended-forecast-widget",
  coordinatesFromEpic: false,
  showDailyForecast: false,
  showStationSelect: true,
  showZipCode: true,
  hasSuccessPremiumRequest: false,
};

export const reducer: Reducer<State, PremiumWeatherForecastActions> = (
  state = initialState,
  action,
) => {
  if (!action) return state;

  switch (action.type) {
    case ActionTypes.PREMIUM_WEATHER_FORECAST_REQUEST:
      return {
        ...state,
        coordinates: action.payload.coordinates,
        days: action.payload.days,
        units: action.payload.units,
        user: action.payload.user,
        loading: true,
        error: undefined,
        coordinatesFromEpic: false,
      };
    case ActionTypes.PREMIUM_WEATHER_REQUEST_SUCCESS:
      return {
        ...state,
        hasSuccessPremiumRequest: true,
      };
    case ActionTypes.PREMIUM_WEATHER_REQUEST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
        hasSuccessPremiumRequest: false,
        showDailyForecast: true,
        coordinates: undefined,
      };
    case ActionTypes.PREMIUM_WEATHER_FORECAST_DATA_FETCHED_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        weatherForecast: action.payload.weatherForecast,
        hourlyObservation: action.payload.hourlyObservation,
        timezone: action.payload.timezone,
        showDailyForecast: true,
      };
    case ActionTypes.PREMIUM_WEATHER_FORECAST_DATA_FETCHED_ERROR:
      return {
        ...state,
        coordinates: undefined,
        loading: false,
        error: action.payload.message,
        coordinatesFromEpic: false,
        showDailyForecast: true,
      };
    case ActionTypes.SET_ERROR_MESSAGE:
      return {
        ...state,
        error: action.payload.message,
        coordinatesFromEpic: false,
        showDailyForecast: true,
        loading: false,
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
    case ZipCodeWidget.ActionTypes.FETCH_ZIP_CODE_DATA_SUCCESS:
      const { lat, lon } = action.payload;
      return {
        ...state,
        coordinates: { lat, lon },
        coordinatesFromEpic: true,
      };
    case ZipCodeWidget.ActionTypes.FETCH_ZIP_CODE_DATA:
      return {
        ...state,
        loading: true,
      };
    case ZipCodeWidget.ActionTypes.FETCH_ZIP_CODE_DATA_ERROR:
      return {
        ...state,
        loading: false,
        showDailyForecast: false,
      };
    case PremiumLocationSelectWidget.ActionTypes.SELECT_SELECTED_STATION:
      const { selectedStation } = action.payload;
      return {
        ...state,
        loading: true,
        coordinatesFromEpic: true,
        coordinates: { stationId: selectedStation.stationId },
      };
    case ActionTypes.FETCH_PREMIUM_WEATHER_FORECAST_DATA:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};
