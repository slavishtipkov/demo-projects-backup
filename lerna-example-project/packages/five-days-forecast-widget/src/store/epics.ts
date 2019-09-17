import { Observable, of, concat } from "rxjs";
import { filter, map, mergeMap, switchMap, catchError } from "rxjs/operators";
import { WeatherForecastEpic, WeatherForecastActions } from "./";
import { DailyForecast } from "../interfaces";
import {
  ActionTypes,
  FetchWeatherForecastData,
  FetchObservedAtData,
  weatherForecastFetchedDataSuccess,
  weatherForecastFetchedDataError,
  fetchObservedAtData,
  observedAtDataSuccess,
  observedAtDataError,
} from "./actions";

export const fetchWeatherForecastEpic: WeatherForecastEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchWeatherForecastData =>
        action.type === ActionTypes.FETCH_WEATHER_FORECAST_DATA,
    ),
    switchMap(action =>
      api
        .fetchWeatherForecastData(
          action.payload.coordinates,
          action.payload.days,
          action.payload.units,
        )
        .pipe(
          mergeMap(
            (data: ReadonlyArray<DailyForecast>): Observable<WeatherForecastActions> => {
              if (data.length !== 0) {
                return api.fetchTimezone({ lat: data[0].latitude, lon: data[0].longitude }).pipe(
                  mergeMap((timezone: string) => {
                    if (action.payload.showFooter) {
                      return concat(
                        of(weatherForecastFetchedDataSuccess(data, timezone)),
                        of(fetchObservedAtData({ lat: data[0].latitude, lon: data[0].longitude })),
                      );
                    }
                    return concat(of(weatherForecastFetchedDataSuccess(data, timezone)));
                  }),
                  catchError(error => {
                    return concat(
                      of(weatherForecastFetchedDataSuccess(data, undefined)),
                      of(
                        fetchObservedAtData({
                          lat: data[0].latitude,
                          lon: data[0].longitude,
                        }),
                      ),
                    );
                  }),
                );
              }
              return of(weatherForecastFetchedDataError("noDataErrorMessage"));
            },
          ),
          catchError(error => {
            return of(weatherForecastFetchedDataError(`Error: ${error[0].message}`));
          }),
        ),
    ),
  );
};

export const fetchObservedAtEpic: WeatherForecastEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchObservedAtData => action.type === ActionTypes.FETCH_OBSERVED_AT_DATA,
    ),
    switchMap(action =>
      api.fetchObservedAtData(action.payload.coordinates).pipe(
        map(observedAtDataSuccess),
        catchError(error => {
          return of(observedAtDataError(`Error: ${error[0].message}`));
        }),
      ),
    ),
  );
};
