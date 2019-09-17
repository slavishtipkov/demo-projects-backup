import { Action, ActionCreator } from "redux";
import { Coordinates } from "../interfaces";
import { DailyObservation, DailyForecast } from "@dtn/api-lib";

export type WeatherDataActions = FetchWeatherDataAction | FetchWeatherDataSuccessAction;

export const enum WeatherDataActionTypes {
  FETCH_WEATHER_DATA = "FETCH_WEATHER_DATA",
  FETCH_WEATHER_DATA_SUCCESS = "FETCH_WEATHER_DATA_SUCCESS",
}

export interface FetchWeatherDataAction extends Action<WeatherDataActionTypes> {
  readonly type: WeatherDataActionTypes.FETCH_WEATHER_DATA;
  readonly payload: {
    readonly location: Coordinates;
  };
}

export const fetchWeatherData: ActionCreator<FetchWeatherDataAction> = (
  coordinates: Coordinates,
) => ({
  type: WeatherDataActionTypes.FETCH_WEATHER_DATA,
  payload: { location: coordinates },
});

export interface FetchWeatherDataSuccessAction extends Action<WeatherDataActionTypes> {
  readonly type: WeatherDataActionTypes.FETCH_WEATHER_DATA_SUCCESS;
  readonly payload: {
    readonly observations: ReadonlyArray<DailyObservation>;
    readonly forecast: ReadonlyArray<DailyForecast>;
  };
}

export const fetchWeatherDataSuccess: ActionCreator<FetchWeatherDataSuccessAction> = ({
  observations,
  forecast,
}: {
  readonly observations: ReadonlyArray<DailyObservation>;
  readonly forecast: ReadonlyArray<DailyForecast>;
}) => ({
  type: WeatherDataActionTypes.FETCH_WEATHER_DATA_SUCCESS,
  payload: { observations, forecast },
});
