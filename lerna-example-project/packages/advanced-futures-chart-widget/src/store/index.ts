import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { Epic } from "redux-observable";
import { ApiService } from "../services/";
import { Actions } from "./actions";
import { State } from "./reducers";
import { Quote, SymbolPriceHistory } from "../interfaces";
import { ChartInterval, ChartType, FuturesSymbol } from "../../../futures-chart-widget/src/types";

export * from "./actions";
export * from "./epics";
export * from "./reducers";
export * from "./selectors";

export interface FuturesChartState extends I18nState {
  readonly futuresChartState: State;
}
export type FuturesChartActions = Actions | I18nActions;
export interface EpicDependencies {
  readonly api: ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
}
export interface PublicApiCallbacks {
  readonly loadingStateDidChange?: (loading: boolean) => void;
  readonly quoteDidChange?: (quote: Quote) => void;
  readonly symbolPriceHistoryDidChange?: (symbolPriceHistory: SymbolPriceHistory) => void;
  readonly chartTypeDidChange?: (chartType: string) => void;
  readonly onError?: (error?: string) => void;
  readonly onChartDisplayChange?: (newDisplayOptions: {
    readonly type: ChartType;
    readonly interval: ChartInterval;
    readonly duration: ChartInterval;
  }) => void;
  readonly onChartUpdate?: (newSymbol: FuturesSymbol) => void;
}
export type FuturesChartEpic = Epic<
  FuturesChartActions,
  FuturesChartActions,
  FuturesChartState,
  EpicDependencies
>;
