export type Units = "Imperial" | "Metric";
export type SiteId = string;
export type CashBidId = number;
export type showCurrentBasis = boolean;
export type show3YearAverageBasis = boolean;
export type show3YearAverageCashPrice = boolean;
// tslint:disable-next-line:interface-over-type-literal
export type PortalCashBid = { readonly siteId: SiteId; readonly cashBidId: CashBidId };
// tslint:disable-next-line:interface-over-type-literal
export type DefaultCashBidId = { readonly cashBidId: CashBidId; readonly range?: string };
// tslint:disable-next-line:interface-over-type-literal
export type DefaultCashBidLocationAndCommodity = {
  readonly locationId?: number;
  readonly commodityId?: number;
  readonly range?: string;
};
