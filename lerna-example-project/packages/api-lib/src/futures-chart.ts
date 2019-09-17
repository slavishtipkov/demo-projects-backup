import { HttpApi } from "./http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export interface Symbol {
  readonly description: string;
  readonly marketName: string;
  readonly symbol: string;
  readonly tickerSymbol: string;
  readonly vendor: string;
}

export interface Quote {
  readonly symbol: Symbol;
  readonly tradeDateTime: string;
  readonly close: number;
  readonly last: number;
  readonly previous: number;
  readonly low: number;
  readonly high: number;
  readonly cumVolume: number;
}

export interface HistoricPrice {
  readonly oi: number;
  readonly startDateTime: string;
  readonly open: {
    readonly number: number;
    readonly text: string;
  };
  readonly close: {
    readonly number: number;
    readonly text: string;
  };
  readonly low: {
    readonly number: number;
    readonly text: string;
  };
  readonly high: {
    readonly number: number;
    readonly text: string;
  };
  readonly volume: number;
}

export interface SymbolPriceHistory {
  readonly description: string;
  readonly historicPrices: ReadonlyArray<HistoricPrice>;
  readonly marketName: string;
  readonly priceInterval: string;
  readonly symbol: string;
  readonly tickerSymbol: string;
  readonly vendor: string;
}

export class FuturesChartApi extends HttpApi {
  getQuoteForSymbol(symbol: string): Observable<ReadonlyArray<Quote>> {
    let apiUrl = `${this.baseUrl}/markets/symbols/${symbol}/quotes`;
    return this.getJson<ReadonlyArray<Quote>>(apiUrl).pipe(
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getPriceHistoryForSymbol(
    symbol: string,
    interval: string,
    duration: string,
  ): Observable<ReadonlyArray<SymbolPriceHistory>> {
    let apiUrl = `${
      this.baseUrl
    }/markets/symbols/${symbol}/price-history?interval=${interval}&duration=${duration}`;
    return this.getJson<ReadonlyArray<SymbolPriceHistory>>(apiUrl).pipe(
      catchError(error => {
        return throwError(error);
      }),
    );
  }
}
