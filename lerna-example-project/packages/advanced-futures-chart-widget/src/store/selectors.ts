import { createSelector, Selector } from "reselect";
import { FuturesChartState, State } from "./";
import { SymbolConfig, Quote, SymbolPriceHistory } from "../interfaces";

export const baseSelector: Selector<FuturesChartState, State> = ({ futuresChartState }) =>
  futuresChartState;

export const selectLoading: Selector<FuturesChartState, boolean> = createSelector(
  baseSelector,
  futuresChartState => futuresChartState.loading,
);

export const selectError: Selector<FuturesChartState, string | undefined> = createSelector(
  baseSelector,
  futuresChartState => futuresChartState.error,
);

export const selectWidgetName: Selector<FuturesChartState, string> = createSelector(
  baseSelector,
  futuresChartState => futuresChartState.widgetName,
);

export const selectSymbolConfig: Selector<FuturesChartState, SymbolConfig> = createSelector(
  baseSelector,
  futuresChartState => futuresChartState.symbolConfig,
);

export const selectQuote: Selector<FuturesChartState, Quote | undefined> = createSelector(
  baseSelector,
  futuresChartState => futuresChartState.quote,
);

export const selectSymbolPriceHistory: Selector<
  FuturesChartState,
  SymbolPriceHistory | undefined
> = createSelector(
  baseSelector,
  futuresChartState => futuresChartState.symbolPriceHistory,
);

export const selectInterval: Selector<FuturesChartState, string> = createSelector(
  baseSelector,
  futuresChartState => futuresChartState.interval,
);

export const selectDuration: Selector<FuturesChartState, string> = createSelector(
  baseSelector,
  futuresChartState => futuresChartState.duration,
);

export const selectChartType: Selector<FuturesChartState, string> = createSelector(
  baseSelector,
  futuresChartState => futuresChartState.chartType,
);

export const selectYAxisState: Selector<
  FuturesChartState,
  ReadonlyArray<{
    readonly isDrawn: boolean;
    readonly study: string;
  }>
> = createSelector(
  baseSelector,
  futuresChartState => futuresChartState.yAxisState,
);
