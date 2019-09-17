import { Reducer } from "redux";
import {
  HourlyForecast,
  Coordinates,
  ObservedAt,
  VisibleFields,
  DayForecast,
  Station,
} from "../interfaces";
import { HourlyForecastActions } from "./";
import { ActionTypes } from "./actions";
import { DEFAULT_VISIBLE_FIELDS, ALLOWED_HOURS_TO_DAYS_FORECAST } from "../constants";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as PremiumLocationSelectWidget from "@dtn/premium-location-select-widget";

export interface State {
  readonly coordinates?: Coordinates;
  readonly user: string;
  readonly widgetName: string;
  readonly days: number;
  readonly units?: string;
  readonly weatherForecast?: ReadonlyArray<HourlyForecast>;
  readonly visibleFields: VisibleFields;
  readonly loading: boolean;
  readonly error?: string;
  readonly observedAt?: ObservedAt;
  readonly observedAtTime?: Date;
  readonly dayForecast?: ReadonlyArray<DayForecast>;
  readonly coordinatesFromEpic: boolean;
  readonly showHourlyForecast: boolean;
  readonly zipCode?: string;
  readonly selectedStation?: Station;
  readonly showStationSelect: boolean;
  readonly showZipCode: boolean;
  readonly hasSuccessPremiumRequest: boolean;
  readonly timezone?: string;
}

export const initialState: State = {
  loading: false,
  weatherForecast: [],
  visibleFields: DEFAULT_VISIBLE_FIELDS,
  user: "",
  widgetName: "premium-hourly-forecast-widget",
  days: ALLOWED_HOURS_TO_DAYS_FORECAST,
  coordinatesFromEpic: false,
  showHourlyForecast: false,
  showStationSelect: true,
  showZipCode: true,
  hasSuccessPremiumRequest: false,
};

export const reducer: Reducer<State, HourlyForecastActions> = (state = initialState, action) => {
  if (!action) return state;

  switch (action.type) {
    case ActionTypes.PREMIUM_HOURLY_FORECAST_REQUEST:
      return {
        ...state,
        user: action.payload.user,
        coordinates: action.payload.coordinates,
        units: action.payload.units,
        loading: true,
        error: undefined,
        coordinatesFromEpic: false,
      };
    case ActionTypes.PREMIUM_HOURLY_REQUEST_SUCCESS:
      return {
        ...state,
        hasSuccessPremiumRequest: true,
      };
    case ActionTypes.HOURLY_FORECAST_DATA_FETCHED_SUCCESS:
      return {
        ...state,
        error: undefined,
        weatherForecast: action.payload.weatherForecast,
        showHourlyForecast: true,
      };
    case ActionTypes.FETCH_HOURLY_FORECAST_DATA:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.HOURLY_FORECAST_DATA_FETCHED_ERROR:
      return {
        ...state,
        coordinates: undefined,
        loading: false,
        error: action.payload.message,
        coordinatesFromEpic: false,
        showHourlyForecast: true,
      };
    case ActionTypes.SET_ERROR_MESSAGE:
      return {
        ...state,
        coordinates: undefined,
        loading: false,
        error: action.payload.message,
        coordinatesFromEpic: false,
        showHourlyForecast: true,
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
    case ActionTypes.FETCH_DAY_FORECAST_DATA:
      return {
        ...state,
        dayForecast: undefined,
      };
    case ActionTypes.DAY_FORECAST_DATA_FETCHED_SUCCESS:
      return {
        ...state,
        loading: false,
        dayForecast: action.payload.dayForecast,
        timezone: action.payload.timezone,
      };
    case ActionTypes.DAY_FORECAST_DATA_FETCHED_ERROR:
      return {
        ...state,
        loading: false,
        dayForecast: undefined,
      };
    case ActionTypes.PREMIUM_HOURLY_REQUEST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
        hasSuccessPremiumRequest: false,
        showHourlyForecast: true,
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
        showHourlyForecast: false,
      };
    case PremiumLocationSelectWidget.ActionTypes.SELECT_SELECTED_STATION:
      const { selectedStation } = action.payload;
      return {
        ...state,
        loading: true,
        coordinatesFromEpic: true,
        coordinates: { stationId: selectedStation.stationId },
      };
    default:
      return state;
  }
};
