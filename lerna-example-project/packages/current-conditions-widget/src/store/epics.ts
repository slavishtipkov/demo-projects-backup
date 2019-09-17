import { concat, of, Observable } from "rxjs";
import { filter, map, mergeMap, switchMap, catchError } from "rxjs/operators";
import { CurrentConditionsEpic, CurrentConditionsActions } from "./";
import { HourlySurfaceData, DailySurfaceData } from "../interfaces";
import {
  ActionTypes,
  FetchObservedAtData,
  fetchObservedAtData,
  observedAtDataSuccess,
  observedAtDataError,
  FetchCurrentConditionsDataAction,
  fetchCurrentConditionsDataSuccessAction,
  fetchCurrentConditionsDataErrorAction,
  fetchCurrentConditionsDataAction,
} from "./actions";

export const fetchCurrentConditionsEpic: CurrentConditionsEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchCurrentConditionsDataAction =>
        action.type === ActionTypes.FETCH_CURRENT_CONDITIONS_DATA,
    ),
    switchMap(action =>
      api.fetchHourlyForecastsByObservation(action.payload.coordinates, action.payload.units).pipe(
        mergeMap(data => {
          if (data.length !== 0) {
            return api
              .fetchDailyForecastsByForecast(
                action.payload.coordinates,
                action.payload.days,
                action.payload.units,
              )
              .pipe(
                mergeMap(
                  (dailyData): Observable<CurrentConditionsActions> => {
                    if (dailyData.length !== 0) {
                      return api
                        .fetchTimezone({ lat: data[0].latitude, lon: data[0].longitude })
                        .pipe(
                          mergeMap(timezone => {
                            return concat(
                              of(
                                fetchCurrentConditionsDataSuccessAction(data, dailyData, timezone),
                              ),
                              of(
                                fetchObservedAtData({
                                  lat: data[0].latitude,
                                  lon: data[0].longitude,
                                }),
                              ),
                            );
                          }),
                          catchError(error => {
                            return concat(
                              of(
                                fetchCurrentConditionsDataSuccessAction(data, dailyData, undefined),
                              ),
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

                    return of(fetchCurrentConditionsDataErrorAction("noDataErrorMessage"));
                  },
                ),
                catchError(error => {
                  return of(fetchCurrentConditionsDataErrorAction(`Error: ${error[0].message}`));
                }),
              );
          }
          return of(fetchCurrentConditionsDataErrorAction("noDataErrorMessage"));
        }),
        catchError(error => {
          return of(fetchCurrentConditionsDataErrorAction(`Error: ${error[0].message}`));
        }),
      ),
    ),
  );
};

export const fetchObservedAtEpic: CurrentConditionsEpic = (action$, state$, { api }) => {
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
