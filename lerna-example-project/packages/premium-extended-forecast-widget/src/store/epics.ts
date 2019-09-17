import { of, concat } from "rxjs";
import { filter, map, mergeMap, switchMap, catchError } from "rxjs/operators";
import { PremiumWeatherForecastEpic } from "./";
import { DailyForecast, HourlyObservationData } from "../interfaces";
import {
  ActionTypes,
  FetchPremiumWeatherForecastData,
  FetchObservedAtData,
  premiumWeatherForecastFetchedDataSuccess,
  premiumWeatherForecastFetchedDataError,
  fetchObservedAtData,
  observedAtDataSuccess,
  observedAtDataError,
  PremiumWeatherForecastRequest,
  fetchPremiumWeatherForecastData,
  premiumWeatherRequestSuccess,
  premiumWeatherRequestError,
} from "./actions";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as PremiumLocationSelectWidget from "@dtn/premium-location-select-widget";
import { getDevice, generateId, setCookie, getCookie, getRandomLength } from "./utils";
import { COOKIE_NAME, COOKIE_EXPIRES_AFTER_DAYS } from "../constants";

export const fetchPremiumWeatherForecastEpic: PremiumWeatherForecastEpic = (
  action$,
  state$,
  { api },
) => {
  return action$.pipe(
    filter(
      (action): action is FetchPremiumWeatherForecastData =>
        action.type === ActionTypes.FETCH_PREMIUM_WEATHER_FORECAST_DATA,
    ),
    switchMap(action =>
      api
        .fetchWeatherForecastData(
          action.payload.coordinates,
          action.payload.days,
          action.payload.units,
        )
        .pipe(
          mergeMap(dailyData => {
            if (dailyData.length !== 0) {
              return api
                .fetchHourlyObservationData(action.payload.coordinates, action.payload.units)
                .pipe(
                  mergeMap((hourlyData: ReadonlyArray<HourlyObservationData>) => {
                    return api
                      .fetchTimezoneDataByCoordinates({
                        lat: dailyData[0].latitude,
                        lon: dailyData[0].longitude,
                      })
                      .pipe(
                        mergeMap(timezone => {
                          return concat(
                            of(
                              premiumWeatherForecastFetchedDataSuccess(
                                dailyData,
                                hourlyData,
                                timezone,
                              ),
                            ),
                            of(
                              fetchObservedAtData({
                                lat: dailyData[0].latitude,
                                lon: dailyData[0].longitude,
                              }),
                            ),
                          );
                        }),
                        catchError(error => {
                          return concat(
                            of(
                              premiumWeatherForecastFetchedDataSuccess(
                                dailyData,
                                hourlyData,
                                undefined,
                              ),
                            ),
                            of(
                              fetchObservedAtData({
                                lat: dailyData[0].latitude,
                                lon: dailyData[0].longitude,
                              }),
                            ),
                          );
                        }),
                      );
                  }),
                  catchError(error => {
                    return of(premiumWeatherForecastFetchedDataError(`Error: ${error[0].message}`));
                  }),
                );
            }
            return of(premiumWeatherForecastFetchedDataError("noDataErrorMessage"));
          }),
          catchError(error => {
            return of(premiumWeatherForecastFetchedDataError(`Error: ${error[0].message}`));
          }),
        ),
    ),
  );
};

export const premiumWeatherForecastEpic: PremiumWeatherForecastEpic = (
  action$,
  state$,
  { api },
) => {
  return action$.pipe(
    filter(
      (action): action is PremiumWeatherForecastRequest =>
        action.type === ActionTypes.PREMIUM_WEATHER_FORECAST_REQUEST,
    ),
    switchMap(action => {
      const id = generateId(getRandomLength());
      const host = window.location.hostname;
      const device = getDevice();

      let idFromCookie = getCookie(COOKIE_NAME);
      if (idFromCookie === "") {
        setCookie(COOKIE_NAME, id, COOKIE_EXPIRES_AFTER_DAYS);
        idFromCookie = id;
      }

      return api
        .premiumWeatherForecastRequest(
          action.payload.user,
          action.payload.widgetName,
          idFromCookie,
          device,
          host,
        )
        .pipe(
          mergeMap(() => {
            return concat(
              of(premiumWeatherRequestSuccess()),
              of(
                fetchPremiumWeatherForecastData(
                  action.payload.coordinates,
                  action.payload.days,
                  action.payload.units,
                ),
              ),
            );
          }),
          catchError(error => {
            return of(premiumWeatherRequestError(`Error: ${error[0].message}`));
          }),
        );
    }),
  );
};

export const fetchObservedAtEpic: PremiumWeatherForecastEpic = (action$, state$, { api }) => {
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

export const clearZipCodeValueEpic: PremiumWeatherForecastEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is PremiumLocationSelectWidget.SelectSelectedStationAction =>
        action.type === PremiumLocationSelectWidget.ActionTypes.SELECT_SELECTED_STATION,
    ),
    mergeMap(() => {
      return of(ZipCodeWidget.removeZipCodeValue());
    }),
  );
};

export const clearLocationStationEpic: PremiumWeatherForecastEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is ZipCodeWidget.FetchZipCodeDataAction =>
        action.type === ZipCodeWidget.ActionTypes.FETCH_ZIP_CODE_DATA,
    ),
    mergeMap(() => {
      return of(PremiumLocationSelectWidget.removeSelectedStationAction());
    }),
  );
};
