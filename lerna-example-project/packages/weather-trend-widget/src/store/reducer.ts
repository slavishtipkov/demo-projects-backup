import { Reducer } from "redux";
import { DailyObservation, DailyForecast } from "@dtn/api-lib";
import { WeatherDataActions, WeatherTrendActions, WeatherDataActionTypes } from ".";

export interface TrendDataState {
  readonly isLoading: boolean;
  readonly observedData?: ReadonlyArray<DailyObservation>;
  readonly forecastData?: ReadonlyArray<DailyForecast>;
}

export const initialState: TrendDataState = { isLoading: false };

export const weatherDataReducer: Reducer<TrendDataState, WeatherTrendActions> = (
  state = initialState,
  action,
) => {
  if (!action) return state;

  switch (action.type) {
    case WeatherDataActionTypes.FETCH_WEATHER_DATA:
      return {
        ...state,
        isLoading: true,
      };
    case WeatherDataActionTypes.FETCH_WEATHER_DATA_SUCCESS:
      return {
        ...state,
        observedData: action.payload.observations,
        forecastData: action.payload.forecast,
        isLoading: false,
      };
    default:
      return state;
  }
};
