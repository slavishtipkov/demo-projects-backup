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

export const selectShow3YearAverageCashPrice: Selector<
  BasicCashBidsState,
  boolean
> = createSelector(
  baseSelector,
  basicCashBids => basicCashBids.show3YearAverageCashPrice,
);
