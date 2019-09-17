import { createSelector, Selector } from "reselect";
import {} from "../interfaces";
import { PremiumSixFactorsMarketStrategiesState, State } from "./";
import { SixFactorsMarketStrategies, SixFactorsMarketsText } from "../interfaces";
import { premiumMarketStrategiesEpic } from "./epics";
import { ContentTexts, Commodities } from "@dtn/api-lib";

export const baseSelector: Selector<PremiumSixFactorsMarketStrategiesState, State> = ({
  premiumSixFactorsMarketStrategies,
}) => premiumSixFactorsMarketStrategies;

export const selectLoading: Selector<
  PremiumSixFactorsMarketStrategiesState,
  boolean
> = createSelector(
  baseSelector,
  premiumSixFactorsMarketStrategies => premiumSixFactorsMarketStrategies.loading,
);

export const selectUser: Selector<PremiumSixFactorsMarketStrategiesState, string> = createSelector(
  baseSelector,
  premiumSixFactorsMarketStrategies => premiumSixFactorsMarketStrategies.user,
);

export const selectWidgetName: Selector<
  PremiumSixFactorsMarketStrategiesState,
  string
> = createSelector(
  baseSelector,
  premiumSixFactorsMarketStrategies => premiumSixFactorsMarketStrategies.widgetName,
);

export const selectUnits: Selector<
  PremiumSixFactorsMarketStrategiesState,
  string | undefined
> = createSelector(
  baseSelector,
  premiumSixFactorsMarketStrategies => premiumSixFactorsMarketStrategies.units,
);

export const selectDefaultCommodity: Selector<
  PremiumSixFactorsMarketStrategiesState,
  Commodities | undefined
> = createSelector(
  baseSelector,
  premiumSixFactorsMarketStrategies => premiumSixFactorsMarketStrategies.defaultCommodity,
);

export const selectShowCommodities: Selector<
  PremiumSixFactorsMarketStrategiesState,
  boolean | ReadonlyArray<Commodities> | undefined
> = createSelector(
  baseSelector,
  premiumSixFactorsMarketStrategies => premiumSixFactorsMarketStrategies.showCommodities,
);

export const selectMarketStrategiesData: Selector<
  PremiumSixFactorsMarketStrategiesState,
  SixFactorsMarketStrategies | undefined
> = createSelector(
  baseSelector,
  premiumSixFactorsMarketStrategies => premiumSixFactorsMarketStrategies.marketStrategiesData,
);

export const selectError: Selector<
  PremiumSixFactorsMarketStrategiesState,
  string | undefined
> = createSelector(
  baseSelector,
  premiumSixFactorsMarketStrategies => premiumSixFactorsMarketStrategies.error,
);

export const selectHasSuccessPremiumRequest: Selector<
  PremiumSixFactorsMarketStrategiesState,
  boolean
> = createSelector(
  baseSelector,
  premiumSixFactorsMarketStrategies => premiumSixFactorsMarketStrategies.hasSuccessPremiumRequest,
);

export const selectCommodities: Selector<
  PremiumSixFactorsMarketStrategiesState,
  ReadonlyArray<Commodities>
> = createSelector(
  baseSelector,
  premiumSixFactorsMarketStrategies => premiumSixFactorsMarketStrategies.commodities,
);

export const selectCharts: Selector<
  PremiumSixFactorsMarketStrategiesState,
  ReadonlyArray<{ readonly url: string; readonly id: string }>
> = createSelector(
  baseSelector,
  premiumSixFactorsMarketStrategies => premiumSixFactorsMarketStrategies.charts,
);

export const selectMoreInformationTexts: Selector<
  PremiumSixFactorsMarketStrategiesState,
  ReadonlyArray<SixFactorsMarketsText>
> = createSelector(
  baseSelector,
  premiumSixFactorsMarketStrategies => premiumSixFactorsMarketStrategies.moreInformationTexts,
);
