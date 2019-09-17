import { of, concat, forkJoin } from "rxjs";
import { filter, map, mergeMap, switchMap, catchError } from "rxjs/operators";
import { PremiumSixFactorsMarketStrategiesEpic } from "./";
import {} from "../interfaces";
import {
  ActionTypes,
  FetchMarketStrategies,
  FetchPremiumMarketStrategiesRequest,
  FetchCharts,
  fetchMarketStrategies,
  fetchMarketStrategiesSuccess,
  fetchMarketStrategiesError,
  fetchPremiumMarketStrategiesRequestSuccess,
  fetchChartsSuccess,
  setErrorMessage,
} from "./actions";
import { getDevice, generateId, setCookie, getCookie, getRandomLength } from "./utils";
import { COOKIE_NAME, COOKIE_EXPIRES_AFTER_DAYS, TEXT_TYPES } from "../constants";

export const marketStrategiesEpic: PremiumSixFactorsMarketStrategiesEpic = (
  action$,
  state$,
  { api },
) => {
  return action$.pipe(
    filter(
      (action): action is FetchMarketStrategies =>
        action.type === ActionTypes.FETCH_MARKET_STRATEGIES,
    ),
    switchMap(action =>
      api.getSixFactorsMarketStrategies(action.payload.commodity).pipe(
        mergeMap(marketStrategiesData => {
          const chartIds = marketStrategiesData.charts.map(c => c.chartId);
          if (Object.keys(chartIds).length > 0) {
            return forkJoin(
              chartIds.map(chartId => {
                return api.getChartById(action.payload.commodity, chartId);
              }),
            ).pipe(
              mergeMap(charts => {
                return forkJoin(
                  TEXT_TYPES.map(type => {
                    return api.getMarketStrategiesText(action.payload.commodity, type);
                  }),
                ).pipe(
                  map(moreInformationTexts =>
                    fetchMarketStrategiesSuccess(
                      marketStrategiesData,
                      charts,
                      moreInformationTexts,
                    ),
                  ),
                  catchError(error => {
                    return of(fetchMarketStrategiesError(`Error: ${error[0].message}`));
                  }),
                );
              }),
              catchError(error => {
                return of(fetchMarketStrategiesError(`Error: ${error[0].message}`));
              }),
            );
          }

          return of(fetchMarketStrategiesError("noDataErrorMessage"));
        }),
        catchError(error => {
          return of(setErrorMessage(`Error: ${error[0].message}`));
        }),
      ),
    ),
  );
};

export const premiumMarketStrategiesEpic: PremiumSixFactorsMarketStrategiesEpic = (
  action$,
  state$,
  { api },
) => {
  return action$.pipe(
    filter(
      (action): action is FetchPremiumMarketStrategiesRequest =>
        action.type === ActionTypes.FETCH_PREMIUM_MARKET_STRATEGIES_REQUEST,
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
        .premiumSixFactorsMarketStrategies(
          action.payload.user,
          action.payload.widgetName,
          idFromCookie,
          device,
          host,
        )
        .pipe(
          mergeMap(() => {
            if (action.payload.commodity) {
              return concat(
                of(fetchPremiumMarketStrategiesRequestSuccess()),
                of(fetchMarketStrategies(action.payload.commodity)),
              );
            } else {
              return concat(of(fetchPremiumMarketStrategiesRequestSuccess()));
            }
          }),
          catchError(error => {
            return of(setErrorMessage(`Error: ${error[0].message}`));
          }),
        );
    }),
  );
};

export const marketStrategiesChartsEpic: PremiumSixFactorsMarketStrategiesEpic = (
  action$,
  state$,
  { api },
) => {
  return action$.pipe(
    filter((action): action is FetchCharts => action.type === ActionTypes.FETCH_CHARTS),
    mergeMap(action =>
      forkJoin(
        action.payload.chartIds.map(chartId => {
          return api.getChartById(action.payload.commodity, chartId);
        }),
      ).pipe(
        map(results => {
          return fetchChartsSuccess(results);
        }),
        catchError(error => {
          return of(setErrorMessage(`Error: ${error[0].message}`));
        }),
      ),
    ),
  );
};
