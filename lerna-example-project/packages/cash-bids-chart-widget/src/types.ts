export type Units = "Imperial" | "Metric";
export type SiteId = string;
export type CashBidId = number;
export type showCurrentBasis = boolean;
export type show3YearAverageBasis = boolean;
export type show3YearAverageCashPrice = boolean;
// tslint:disable-next-line:interface-over-type-literal
export type PortalCashBid = { readonly siteId: SiteId; readonly cashBidId: CashBidId };
