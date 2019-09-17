import { filter, map, mergeMap, switchMap, catchError } from "rxjs/operators";
import { FuturesChartEpic } from "./";
import {
  ActionTypes,
  GetQuoteForSymbol,
  setErrorMessage,
  getQuoteForSymbolSuccess,
  GetPriceHistoryForSymbol,
  getPriceHistoryForSymbolSuccess,
} from "./actions";
import { of } from "rxjs/internal/observable/of";
import { Quote, SymbolPriceHistory } from "../interfaces";
import { normalizeApiResponse } from "./utils";

export const getQuoteForSymbolEpic: FuturesChartEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is GetQuoteForSymbol => action.type === ActionTypes.GET_QUOTE_FOR_SYMBOL,
    ),
    switchMap(action =>
      api.getQuoteForSymbol(action.payload.symbol).pipe(
        switchMap((data: ReadonlyArray<Quote>) => of(getQuoteForSymbolSuccess(data[0]))),
        catchError(error => {
          return of(setErrorMessage(`Error: ${error[0].message}`));
        }),
      ),
    ),
  );
};

export const getPriceHistoryForSymbolEpic: FuturesChartEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is GetPriceHistoryForSymbol =>
        action.type === ActionTypes.GET_PRICE_HISTORY_FOR_SYMBOL,
    ),
    switchMap(action =>
      api
        .getPriceHistoryForSymbol(
          action.payload.symbol,
          action.payload.interval,
          action.payload.duration,
        )
        .pipe(
          switchMap(data => of(getPriceHistoryForSymbolSuccess(normalizeApiResponse(data[0])))),
          catchError(error => {
            return of(setErrorMessage(`Error: ${error[0].message}`));
          }),
        ),
    ),
  );
};
