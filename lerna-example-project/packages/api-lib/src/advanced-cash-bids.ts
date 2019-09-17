import { HttpApi } from "./http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export interface AdvancedCashBidChartRes {
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

export interface AdvancedCashBidSiteRes {
  readonly allowTransactions: boolean;
  readonly basisPrice: number;
  readonly cashPrice: number;
  readonly commodityDisplayName: string;
  readonly commodityId: number;
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

export class AdvancedCashBidsApi extends HttpApi {
  getCashBidsHistoryPrice(
    cashBidId: number,
    duration: string,
    siteId: string,
    range: { readonly start: string; readonly end: string },
  ): Observable<ReadonlyArray<AdvancedCashBidChartRes>> {
    const baseUrl = `${this.baseUrl}/markets/sites/${siteId}/cash-bids/${cashBidId}/price-history`;
    let queryParams = ``;
    if (range.start && range.end) {
      queryParams = `?startDate=${range.start}&endDate=${range.end}`;
    } else if (duration) {
      queryParams = `?duration=${duration}`;
    }
    return this.getJson(`${baseUrl}${queryParams}`).pipe(
      map(response => response as ReadonlyArray<AdvancedCashBidChartRes>),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getCashBidsForSite(
    siteId: string,
    locationId?: number,
    commodityId?: number,
  ): Observable<ReadonlyArray<AdvancedCashBidSiteRes>> {
    const baseUrl = `${this.baseUrl}/markets/sites/${siteId}/cash-bids`;
    let queryParams = "";
    if (locationId && commodityId) {
      queryParams = `?locationId=${locationId}&commodityId=${commodityId}`;
    } else if (locationId) {
      queryParams = `?locationId=${locationId}`;
    } else if (commodityId) {
      queryParams = `?commodityId=${commodityId}`;
    }
    return this.getJson(`${baseUrl}${queryParams}`).pipe(
      map(response => response as ReadonlyArray<AdvancedCashBidSiteRes>),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getLocationsForSite(
    siteId: string,
    commodityId?: number,
  ): Observable<
    ReadonlyArray<{
      readonly grainBidElevatorIds: ReadonlyArray<number>;
      readonly links: Object;
      readonly id: number;
      readonly name: string;
    }>
  > {
    const baseUrl = `${this.baseUrl}/markets/sites/${siteId}/locations`;
    let queryParams = "";
    if (commodityId) {
      queryParams = `?commodityId=${commodityId}`;
    }
    return this.getJson(`${baseUrl}${queryParams}`).pipe(
      map(
        response =>
          response as ReadonlyArray<{
            readonly grainBidElevatorIds: ReadonlyArray<number>;
            readonly links: Object;
            readonly id: number;
            readonly name: string;
          }>,
      ),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getCommoditiesForSite(
    siteId: string,
    locationId?: number,
  ): Observable<
    ReadonlyArray<{
      readonly commodityName: string;
      readonly id: number;
    }>
  > {
    const baseUrl = `${this.baseUrl}/markets/sites/${siteId}/commodities`;
    let queryParams = "";
    if (locationId) {
      queryParams = `?locationId=${locationId}`;
    }
    return this.getJson(`${baseUrl}${queryParams}`).pipe(
      map(
        response =>
          response as ReadonlyArray<{
            readonly commodityName: string;
            readonly id: number;
          }>,
      ),
      catchError(error => {
        return throwError(error);
      }),
    );
  }
}
