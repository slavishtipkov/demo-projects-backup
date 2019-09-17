import { createSelector, Selector } from "reselect";
import { BasicCashBidsState, State } from "./";
import { CashBidChartData } from "../interfaces";

export const baseSelector: Selector<BasicCashBidsState, State> = ({ basicCashBids }) =>
  basicCashBids;

export const selectSymbol: Selector<BasicCashBidsState, string | undefined> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.symbol,
);

export const selectUpdatedAt: Selector<BasicCashBidsState, string | undefined> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.updatedAt,
);

export const selectLoading: Selector<BasicCashBidsState, boolean> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.loading,
);

export const selectChartData: Selector<
  BasicCashBidsState,
  ReadonlyArray<CashBidChartData>
> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.chartData,
);

export const selectError: Selector<BasicCashBidsState, string | undefined> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.error,
);

export const selectDuration: Selector<BasicCashBidsState, string> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.duration,
);

export const selectLocation: Selector<BasicCashBidsState, string | undefined> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.location,
);

export const selectCommodity: Selector<BasicCashBidsState, string | undefined> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.commodity,
);

export const selectDeliveryEndDate: Selector<
  BasicCashBidsState,
  string | undefined
> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.deliveryEndDate,
);

export const selectSiteId: Selector<BasicCashBidsState, string> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.siteId,
);

export const selectCashBidId: Selector<BasicCashBidsState, number> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.cashBidId,
);

export const selectShowCurrentBasis: Selector<BasicCashBidsState, boolean> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.showCurrentBasis,
);

export const selectShow3YearAverageBasis: Selector<BasicCashBidsState, boolean> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.show3YearAverageBasis,
);

export const selectLocationId: Selector<BasicCashBidsState, number | undefined> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.locationId,
);

export const selectCommodityId: Selector<BasicCashBidsState, number | undefined> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.commodityId,
);

export const selectRange: Selector<
  BasicCashBidsState,
  | {
      readonly start: string;
      readonly end: string;
    }
  | undefined
> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.range,
);

export const selectShow3YearAverageCashPrice: Selector<
  BasicCashBidsState,
  boolean
> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.show3YearAverageCashPrice,
);

export const selectLocations: Selector<
  BasicCashBidsState,
  ReadonlyArray<{
    readonly grainBidElevatorIds: ReadonlyArray<number>;
    readonly links: Object;
    readonly id: number;
    readonly name: string;
  }>
> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.locations,
);

export const selectCommodities: Selector<
  BasicCashBidsState,
  ReadonlyArray<{
    readonly commodityName: string;
    readonly id: number;
  }>
> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.commodities,
);

export const selectDeliveryPeriods: Selector<
  BasicCashBidsState,
  ReadonlyArray<{
    readonly cashBidId: number;
    readonly deliveryPeriod: {
      readonly start: string;
      readonly end: string;
    };
  }>
> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.deliveryPeriods,
);

export const selectRedrawChartTime: Selector<BasicCashBidsState, string> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.redrawChartTime,
);

export const selectPreviousRedrawState: Selector<
  BasicCashBidsState,
  string | undefined
> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.previousRedrawState,
);
