import { forkJoin } from "rxjs";
import { filter, map, switchMap, withLatestFrom } from "rxjs/operators";
import { FetchWeatherDataAction, WeatherDataActionTypes, WeatherTrendEpic } from "./";
import { fetchWeatherDataSuccess } from "./actions";

export const fetchObservedData: WeatherTrendEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchWeatherDataAction =>
        action.type === WeatherDataActionTypes.FETCH_WEATHER_DATA,
    ),
    withLatestFrom(state$),
    switchMap(([action]) => {
      return forkJoin([
        api.fetchDailyObservation(action.payload.location, 180),
        api.fetchDailyForecast(action.payload.location, 10),
      ]).pipe(
        map(([observations, forecast]) => fetchWeatherDataSuccess({ observations, forecast })),
      );
    }),
  );
};
