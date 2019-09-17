import { HttpApi } from "./http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export interface CashBidChartRes {
  readonly basis?: number | null;
  readonly basis3YrAvg?: number | null;
  readonly cashBidId: number;
  readonly cashPrice?: number | null;
  readonly cashPrice3YrAvg?: number | null;
  readonly convertToUnit: string;
  readonly convertedBasis: number;
  readonly convertedBasis3YrAvg?: number | null;
  readonly convertedCashPrice: number;
  readonly convertedCashPrice3YrAvg?: number | null;
  readonly dateTimeStamp: string;
  readonly lastUpdate: string;
  readonly primaryUnits: string;
  readonly symbol: string;
  readonly unitConversionRate: number;
  readonly useUnitConversionRate: boolean;

  readonly [key: string]: string | boolean | null | undefined | number;
}

export interface CashBidSiteRes {
  readonly allowTransactions: boolean;
  readonly basisPrice: number;
  readonly cashPrice: number;
  readonly commodityDisplayName: string;
  readonly contractDeliveryLabel: string;
  readonly contractMonthCode: string;
  readonly currency: string;
  readonly deliveryPeriod: {
    readonly end: string;
    readonly start: string;
  };
  readonly futuresChange: string;
  readonly futuresQuote: string;
  readonly id: number;
  readonly location: {
    readonly id: number;
    readonly name: string;
  };
  readonly realTime: boolean;
  readonly settlePrice: string;
  readonly symbol: string;
  readonly unitOfMeasure: string;
}

export class BasicCashBidsApi extends HttpApi {
  getCashBidsHistoryPrice(
    cashBidId: number,
    duration: string,
    siteId: string,
  ): Observable<ReadonlyArray<CashBidChartRes>> {
    const baseUrl = `${this.baseUrl}/markets/sites/${siteId}/cash-bids/${cashBidId}/price-history`;
    const queryParams = `?duration=${duration}`;
    return this.getJson(`${baseUrl}${queryParams}`).pipe(
      map(response => response as ReadonlyArray<CashBidChartRes>),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getCashBidsForSite(siteId: string): Observable<ReadonlyArray<CashBidSiteRes>> {
    const baseUrl = `${this.baseUrl}/markets/sites/${siteId}/cash-bids`;
    const queryParams = ``;
    return this.getJson(`${baseUrl}${queryParams}`).pipe(
      map(response => response as ReadonlyArray<CashBidSiteRes>),
      catchError(error => {
        return throwError(error);
      }),
    );
  }
}
