import { of, concat } from "rxjs";
import { filter, switchMap, catchError, mergeMap, map } from "rxjs/operators";
import { BasicCashBidsEpic } from "./";
import {
  ActionTypes,
  FetchBasicCashBidsData,
  basicCashBidsFetchedSuccess,
  basicCashBidsFetchedError,
  redrawCashBidsDataSuccess,
  redrawCashBidsDataError,
  FetchLocationsForSite,
  fetchLocationsForSiteSuccess,
  fetchLocationsForSiteError,
  FetchCommoditiesForSite,
  fetchCommoditiesForSiteSuccess,
  setErrorMessage,
  FetchDeliveryPeriods,
  fetchDeliveryPeriodsSuccess,
} from "./actions";
import { ERRORS } from "../constants";
import { CashBidChartData, CashBidResponseData } from "../interfaces";

export const basicCashBidsEpic: BasicCashBidsEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchBasicCashBidsData =>
        action.type === ActionTypes.BASIC_CASH_BIDS_REQUEST,
    ),
    switchMap(action =>
      api
        .getCashBidsForSite(
          action.payload.siteId,
          action.payload.locationId,
          action.payload.commodityId,
        )
        .pipe(
          mergeMap((cashBids: ReadonlyArray<CashBidResponseData>) => {
            let cashBidData: CashBidResponseData | undefined;
            if (action.payload.cashBidId) {
              cashBidData = cashBids.find(
                (c: CashBidResponseData) => c.id === action.payload.cashBidId,
              );
            } else if (action.payload.locationId && action.payload.commodityId) {
              cashBidData = cashBids.find(
                (c: CashBidResponseData) =>
                  c.location.id === action.payload.locationId &&
                  c.commodityId === action.payload.commodityId,
              );
            } else if (action.payload.locationId) {
              cashBidData = cashBids.find(
                (c: CashBidResponseData) => c.location.id === action.payload.locationId,
              );
            } else if (action.payload.commodityId) {
              cashBidData = cashBids.find(
                (c: CashBidResponseData) => c.commodityId === action.payload.commodityId,
              );
            } else {
              cashBidData = cashBids[0];
            }
            if (cashBidData) {
              const requestCashBidId = cashBidData.id;
              return api
                .getCashBidsHistoryPrice(
                  requestCashBidId,
                  action.payload.duration,
                  action.payload.siteId,
                  action.payload.range,
                )
                .pipe(
                  mergeMap((res: ReadonlyArray<CashBidChartData>) => {
                    let cashBidData: CashBidResponseData | undefined;
                    if (action.payload.cashBidId) {
                      cashBidData = cashBids.find(
                        (c: CashBidResponseData) => c.id === action.payload.cashBidId,
                      );
                    } else if (action.payload.locationId && action.payload.commodityId) {
                      cashBidData = cashBids.find(
                        (c: CashBidResponseData) =>
                          c.location.id === action.payload.locationId &&
                          c.commodityId === action.payload.commodityId,
                      );
                    } else if (action.payload.locationId) {
                      cashBidData = cashBids.find(
                        (c: CashBidResponseData) => c.location.id === action.payload.locationId,
                      );
                    } else if (action.payload.commodityId) {
                      cashBidData = cashBids.find(
                        (c: CashBidResponseData) => c.commodityId === action.payload.commodityId,
                      );
                    } else {
                      cashBidData = cashBids[0];
                    }
                    if (cashBidData && res.length > 1) {
                      const deliveryPeriods: any = [];
                      cashBids.forEach(c => {
                        if (
                          cashBidData &&
                          c.commodityId === cashBidData.commodityId &&
                          c.location.id === cashBidData.location.id
                        ) {
                          const deliveryPeriod = {
                            cashBidId: c.id,
                            deliveryPeriod: c.deliveryPeriod,
                          };
                          deliveryPeriods.push(deliveryPeriod);
                        }

                        return deliveryPeriods;
                      });

                      return concat(
                        of(
                          basicCashBidsFetchedSuccess(
                            res,
                            deliveryPeriods,
                            res[0].symbol,
                            cashBidData.commodityDisplayName,
                            cashBidData.commodityId,
                            cashBidData.location.name,
                            cashBidData.location.id,
                            cashBidData.deliveryPeriod.end,
                            res[res.length - 1].lastUpdate,
                            cashBidData.id,
                          ),
                        ),
                      );
                    }

                    if (cashBidData && res.length <= 1) {
                      const deliveryPeriods: any = [];
                      cashBids.forEach(c => {
                        if (
                          cashBidData &&
                          c.commodityId === cashBidData.commodityId &&
                          c.location.id === cashBidData.location.id
                        ) {
                          const deliveryPeriod = {
                            cashBidId: c.id,
                            deliveryPeriod: c.deliveryPeriod,
                          };
                          deliveryPeriods.push(deliveryPeriod);
                        }

                        return deliveryPeriods;
                      });
                      return concat(of(basicCashBidsFetchedSuccess([], deliveryPeriods)));
                    }

                    return concat(of(basicCashBidsFetchedSuccess([], [])));
                  }),
                  catchError(error => {
                    console.log(error);
                    return of(basicCashBidsFetchedError(`Error: ${error[0].message}`));
                  }),
                );
            }
            return concat(of(basicCashBidsFetchedSuccess([], [])));
          }),
          catchError(error => {
            console.log(error);
            return of(basicCashBidsFetchedError(`Error: ${error[0].message}`));
          }),
        ),
    ),
  );
};

export const redrawCashBidsEpic: BasicCashBidsEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchBasicCashBidsData =>
        action.type === ActionTypes.REDRAW_CASH_BIDS_DATA,
    ),
    switchMap(action =>
      api
        .getCashBidsForSite(
          action.payload.siteId,
          action.payload.locationId,
          action.payload.commodityId,
        )
        .pipe(
          mergeMap((cashBids: ReadonlyArray<CashBidResponseData>) => {
            let cashBidData = cashBids.find(
              (c: CashBidResponseData) => c.id === action.payload.cashBidId,
            );
            if (cashBidData) {
              const requestCashBidId = cashBidData.id;
              return api
                .getCashBidsHistoryPrice(
                  requestCashBidId,
                  action.payload.duration,
                  action.payload.siteId,
                  action.payload.range,
                )
                .pipe(
                  mergeMap((res: ReadonlyArray<CashBidChartData>) => {
                    let cashBidData = cashBids.find(
                      (c: CashBidResponseData) => c.id === action.payload.cashBidId,
                    );
                    const deliveryPeriods: any = [];
                    if (cashBidData !== undefined && res.length > 1) {
                      cashBids.forEach(c => {
                        if (
                          cashBidData &&
                          c.commodityId === cashBidData.commodityId &&
                          c.location.id === cashBidData.location.id
                        ) {
                          const deliveryPeriod = {
                            cashBidId: c.id,
                            deliveryPeriod: c.deliveryPeriod,
                          };
                          deliveryPeriods.push(deliveryPeriod);
                        }

                        return deliveryPeriods;
                      });

                      return concat(
                        of(
                          redrawCashBidsDataSuccess(
                            res,
                            deliveryPeriods,
                            res[0].symbol,
                            cashBidData.commodityDisplayName,
                            cashBidData.commodityId,
                            cashBidData.location.name,
                            cashBidData.location.id,
                            cashBidData.deliveryPeriod.end,
                            res[res.length - 1].lastUpdate,
                          ),
                        ),
                      );
                    }

                    if (cashBidData && res.length <= 1) {
                      cashBids.forEach(c => {
                        if (
                          cashBidData &&
                          c.commodityId === cashBidData.commodityId &&
                          c.location.id === cashBidData.location.id
                        ) {
                          const deliveryPeriod = {
                            cashBidId: c.id,
                            deliveryPeriod: c.deliveryPeriod,
                          };
                          deliveryPeriods.push(deliveryPeriod);
                        }

                        return deliveryPeriods;
                      });
                      return concat(of(redrawCashBidsDataSuccess([], deliveryPeriods)));
                    }

                    return concat(of(redrawCashBidsDataSuccess([], deliveryPeriods)));
                  }),
                  catchError(error => {
                    return of(redrawCashBidsDataError(`Error: ${error[0].message}`));
                  }),
                );
            }
            return concat(of(redrawCashBidsDataSuccess([], [])));
          }),
          catchError(error => {
            return of(basicCashBidsFetchedError(`Error: ${error[0].message}`));
          }),
        ),
    ),
  );
};

export const locationsCashBidEpic: BasicCashBidsEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchLocationsForSite =>
        action.type === ActionTypes.FETCH_LOCATIONS_FOR_SITE,
    ),
    switchMap(action =>
      api.getLocationsForSite(action.payload.siteId).pipe(
        map(locations => {
          return fetchLocationsForSiteSuccess(locations);
        }),
        catchError(error => {
          return of(fetchLocationsForSiteError(`Error: ${error[0].message}`));
        }),
      ),
    ),
  );
};

export const commoditiesCashBidEpic: BasicCashBidsEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchCommoditiesForSite =>
        action.type === ActionTypes.FETCH_COMMODITIES_FOR_SITE,
    ),
    switchMap(action =>
      api.getCommoditiesForSite(action.payload.siteId, action.payload.locationId).pipe(
        map(commodities => {
          return fetchCommoditiesForSiteSuccess(commodities);
        }),
        catchError(error => {
          return of(setErrorMessage(`Error: ${error[0].message}`));
        }),
      ),
    ),
  );
};

export const deliveryPeriodCashBidEpic: BasicCashBidsEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchDeliveryPeriods =>
        action.type === ActionTypes.FETCH_DELIVERY_PERIODS,
    ),
    switchMap(action =>
      api
        .getCashBidsForSite(
          action.payload.siteId,
          action.payload.locationId,
          action.payload.commodityId,
        )
        .pipe(
          map(cashBids => {
            const deliveryPeriods: any = [];
            cashBids.forEach((c: CashBidResponseData) => {
              if (
                c.commodityId === action.payload.commodityId &&
                c.location.id === action.payload.locationId
              ) {
                const deliveryPeriod = {
                  cashBidId: c.id,
                  deliveryPeriod: c.deliveryPeriod,
                };
                deliveryPeriods.push(deliveryPeriod);
              }

              return deliveryPeriods;
            });

            return fetchDeliveryPeriodsSuccess(deliveryPeriods);
          }),
          catchError(error => {
            return of(setErrorMessage(`Error: ${error[0].message}`));
          }),
        ),
    ),
  );
};
