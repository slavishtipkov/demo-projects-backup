import { of, concat, Observable } from "rxjs";
import { filter, map, switchMap, catchError, mergeMap } from "rxjs/operators";
import { HourlyForecastEpic, HourlyForecastActions } from "./";
import {
  ActionTypes,
  FetchHourlyForecastData,
  FetchObservedAtData,
  hourlyForecastFetchedSuccess,
  hourlyForecastFetchedError,
  observedAtDataSuccess,
  observedAtDataError,
  fetchObservedAtData,
  fetchDayForecastData,
  dayForecastFetchedError,
  dayForecastFetchedSuccess,
  FetchDayForecastData,
  PremiumHourlyForecastRequest,
  fetchHourlyForecastData,
  premiumHourlyRequestSuccess,
  premiumHourlyRequestError,
} from "./actions";
import { HourlyForecast } from "../interfaces";
import { ALLOWED_DAYS_FORECAST } from "../constants";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as PremiumLocationSelectWidget from "@dtn/premium-location-select-widget";
import { getDevice, generateId, setCookie, getCookie, getRandomLength } from "./utils";
import { COOKIE_NAME, COOKIE_EXPIRES_AFTER_DAYS } from "../constants";

export const premiumHourlyForecastEpic: HourlyForecastEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is PremiumHourlyForecastRequest =>
        action.type === ActionTypes.PREMIUM_HOURLY_FORECAST_REQUEST,
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
        .premiumHourlyWeatherRequest(
          action.payload.user,
          action.payload.widgetName,
          idFromCookie,
          device,
          host,
        )
        .pipe(
          mergeMap(() => {
            return concat(
              of(premiumHourlyRequestSuccess()),
              of(
                fetchHourlyForecastData(
                  action.payload.coordinates,
                  action.payload.days,
                  action.payload.units,
                ),
              ),
            );
          }),
          catchError(error => {
            return of(premiumHourlyRequestError(`Error: ${error[0].message}`));
          }),
        );
    }),
  );
};

export const fetchHourlyForecastEpic: HourlyForecastEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchHourlyForecastData =>
        action.type === ActionTypes.FETCH_HOURLY_FORECAST_DATA,
    ),
    switchMap(action =>
      api
        .fetchHourlyWeatherForecastData(
          action.payload.coordinates,
          action.payload.days,
          action.payload.units,
        )
        .pipe(
          mergeMap(
            (data): Observable<HourlyForecastActions> => {
              if (data.length !== 0) {
                return concat(
                  of(hourlyForecastFetchedSuccess(data)),
                  of(
                    fetchDayForecastData(
                      { lat: data[0].latitude, lon: data[0].longitude },
                      ALLOWED_DAYS_FORECAST,
                      action.payload.units,
                    ),
                  ),
                  of(fetchObservedAtData({ lat: data[0].latitude, lon: data[0].longitude })),
                );
              }
              return of(hourlyForecastFetchedError("noDataErrorMessage"));
            },
          ),
          catchError(error => {
            return of(hourlyForecastFetchedError(`Error: ${error[0].message}`));
          }),
        ),
    ),
  );
};

export const fetchDayForecastEpic: HourlyForecastEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchDayForecastData =>
        action.type === ActionTypes.FETCH_DAY_FORECAST_DATA,
    ),
    switchMap(action =>
      api
        .fetchDayForecastData(action.payload.coordinates, action.payload.days, action.payload.units)
        .pipe(
          mergeMap(data => {
            return api.fetchTimezoneByCoordinates(action.payload.coordinates).pipe(
              switchMap(timezone => {
                return of(dayForecastFetchedSuccess(data, timezone));
              }),
              catchError(err => of(dayForecastFetchedSuccess(data, undefined))),
            );
          }),
          catchError(err => of(dayForecastFetchedError(err))),
        ),
    ),
  );
};

export const fetchObservedAtEpic: HourlyForecastEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchObservedAtData => action.type === ActionTypes.FETCH_OBSERVED_AT_DATA,
    ),
    switchMap(action =>
      api.fetchObservedAtData(action.payload.coordinates).pipe(map(observedAtDataSuccess)),
    ),
  );
};

export const clearZipCodeValueEpic: HourlyForecastEpic = (action$, state$, { api }) => {
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

export const clearLocationStationEpic: HourlyForecastEpic = (action$, state$, { api }) => {
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
