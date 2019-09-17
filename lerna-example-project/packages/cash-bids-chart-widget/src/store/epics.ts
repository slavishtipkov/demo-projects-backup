import { of, concat } from "rxjs";
import { filter, switchMap, catchError, mergeMap } from "rxjs/operators";
import { BasicCashBidsEpic } from "./";
import {
  ActionTypes,
  FetchBasicCashBidsData,
  basicCashBidsFetchedSuccess,
  basicCashBidsFetchedError,
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
        .getCashBidsHistoryPrice(
          action.payload.cashBidId,
          action.payload.duration,
          action.payload.siteId,
        )
        .pipe(
          mergeMap((res: ReadonlyArray<CashBidChartData>) => {
            return api.getCashBidsForSite(action.payload.siteId).pipe(
              mergeMap((cashBids: ReadonlyArray<CashBidResponseData>) => {
                const cashBidData = cashBids.find(
                  (c: CashBidResponseData) => c.id === action.payload.cashBidId,
                );
                if (cashBidData && res.length > 1) {
                  return concat(
                    of(
                      basicCashBidsFetchedSuccess(
                        res,
                        res[0].symbol,
                        cashBidData.commodityDisplayName,
                        cashBidData.location.name,
                        cashBidData.deliveryPeriod.end,
                        res[res.length - 1].lastUpdate,
                      ),
                    ),
                  );
                }
                return concat(of(basicCashBidsFetchedSuccess([])));
              }),
              catchError(error => {
                return of(basicCashBidsFetchedError(`Error: ${error[0].message}`));
              }),
            );
          }),
          catchError(error => {
            return of(basicCashBidsFetchedError(`Error: ${error[0].message}`));
          }),
        ),
    ),
  );
};
