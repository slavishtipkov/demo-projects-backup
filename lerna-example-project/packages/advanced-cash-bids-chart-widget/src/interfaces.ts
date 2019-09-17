import { Moment } from "moment-timezone";

export interface DisplayDate {
  readonly month: string;
  readonly day: string;
  readonly year: string;
}

export interface CashBidData {
  readonly cashPrice?: number | null;
  readonly basis?: number | null;
  readonly cashPrice3YrAvg?: number | null;
  readonly basis3YrAvg?: number | null;
}

export interface CashBidChartData {
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

export interface CashBidResponseData {
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
