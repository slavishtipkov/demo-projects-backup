import { renderWidget, WidgetFactory } from "@dtn/browser-render-lib";
import { pairwise } from "rxjs/operators";
import { initialState as i18nInitialState, Locales, reducer as i18nReducer } from "@dtn/i18n-lib";
import { BehaviorSubject } from "rxjs";
import { CHART_TYPES, CHART_INTERVALS_DICTIONARY, DROPDOWN_OPTIONS_DICTIONARY } from "../constants";
import * as React from "react";
import { ReducersMapObject } from "redux";
import { ApiService } from "../services";
import {
  initialState,
  PublicApiCallbacks,
  reducer,
  FuturesChartActions,
  FuturesChartEpic,
  FuturesChartState,
  getQuoteForSymbolEpic,
  getPriceHistoryForSymbolEpic,
  selectInterval,
  selectDuration,
  selectChartType,
  selectSymbolConfig,
  selectSymbolPriceHistory,
} from "../store";
import { PremiumFuturesChart } from "../ui/widgets";
import { SymbolConfig } from "../interfaces";
import { Units, FuturesSymbol, ChartInterval, ChartType } from "../types";
import IndexView from "../ui/views/index-view";

export interface WidgetConfig {
  readonly callbacks?: PublicApiCallbacks;
  readonly units: Units;
  readonly symbol: FuturesSymbol;
  readonly showSymbol?: boolean;
  readonly showSymbolDescription?: boolean;
  readonly defaultChartType?: ChartInterval;
  readonly defaultChartInterval?: ChartType;
}

export interface ThemeProp {}

export interface PublicApi {
  readonly setSymbol: (symbol: string) => void;
  readonly setChartDisplay: (displayOptions: {
    readonly type?: ChartType;
    readonly interval?: ChartInterval;
  }) => void;
}

export type CreateAdvancedFuturesChartWidget = WidgetFactory<
  WidgetConfig,
  ThemeProp,
  Promise<PublicApi>
>;

export const createAdvancedFuturesChartWidget: CreateAdvancedFuturesChartWidget = async ({
  container,
  apiKey,
  baseUrl = "https://api.dtn.com",
  symbol,
  showSymbol = true,
  showSymbolDescription = true,
  defaultChartType = "LINE",
  defaultChartInterval = "M",
  units,
  locale = Locales.ENGLISH,
  theme = {},
  callbacks,
}) => {
  let component: any;
  let rootComponent = <PremiumFuturesChart ref={x => (component = x)} theme={theme} />;

  let rootReducer: ReducersMapObject<FuturesChartState, FuturesChartActions | any> = {
    futuresChartState: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<FuturesChartEpic> = [
    getQuoteForSymbolEpic,
    getPriceHistoryForSymbolEpic,
  ];

  let epicDependencies = {
    api: new ApiService({
      token: apiKey,
      locale,
      units,
      baseUrl,
    }),
  };

  const symbolConfig: SymbolConfig = {
    symbol,
    isDescriptionVisible: showSymbolDescription,
    isSymbolVisible: showSymbol,
  };

  let { store } = renderWidget<FuturesChartState, FuturesChartActions, typeof epicDependencies>({
    rootComponent,
    container,
    rootReducer,
    epics,
    epicDependencies,
    initialState: {
      futuresChartState: {
        ...initialState,
        symbolConfig,
        chartType: defaultChartType.toLowerCase(),
        interval: defaultChartInterval,
      },
      i18n: {
        ...i18nInitialState,
        locale,
      },
    },
  });

  let state$ = new BehaviorSubject<FuturesChartState>(store.getState());
  store.subscribe(() => state$.next(store.getState()));

  if (callbacks) {
    state$
      .asObservable()
      .pipe(pairwise())
      .subscribe(([previousState, state]: ReadonlyArray<FuturesChartState>) => {
        const { onChartDisplayChange, onChartUpdate } = callbacks;
        if (
          onChartDisplayChange &&
          (selectChartType(previousState) !== selectChartType(state) ||
            selectInterval(previousState) !== selectInterval(state))
        ) {
          const chartType = selectChartType(state) as ChartType;
          const chartInterval = selectInterval(state);
          const chartDuration = selectDuration(state);

          onChartDisplayChange({
            type: chartType,
            interval: chartInterval,
            duration: chartDuration,
          });
        }

        if (
          onChartUpdate &&
          JSON.stringify(selectSymbolPriceHistory(previousState)) !==
            JSON.stringify(selectSymbolPriceHistory(state))
        ) {
          const symbolPriceHistory = selectSymbolPriceHistory(state);
          if (symbolPriceHistory) {
            onChartUpdate(symbolPriceHistory.symbol);
          }
        }
      });
  }

  const inner: IndexView = component.getWrappedInstance();
  return new Promise<PublicApi>(resolve => {
    resolve({
      setSymbol(symbol: FuturesSymbol): void {
        inner.props.getQuoteForSymbol(symbol);
        inner.props.getPriceHistoryForSymbol(symbol, inner.props.interval, inner.props.duration);
      },
      setChartDisplay(displayOptions: {
        readonly type?: ChartType;
        readonly interval?: ChartInterval;
      }): void {
        if (displayOptions.type) {
          const paramType = displayOptions.type ? displayOptions.type : "bar";
          const newChartType = CHART_TYPES.find(k => k.key === paramType.toLowerCase());
          inner.props.changeChartType(displayOptions.type.toLocaleLowerCase());
          inner.setState({
            dropdownChartTypeSelectedOption: newChartType ? newChartType : CHART_TYPES[0],
          });
        }

        if (displayOptions.interval) {
          inner.props.getPriceHistoryForSymbol(
            symbol,
            displayOptions.interval,
            inner.props.duration,
          );

          const paramInterval = displayOptions.interval ? displayOptions.interval : "w";
          const newInterval = CHART_INTERVALS_DICTIONARY.find(
            i => i.key === paramInterval.toLowerCase(),
          );
          const newDictionary = DROPDOWN_OPTIONS_DICTIONARY[paramInterval.toLowerCase()][0];

          inner.setState({
            dropdownChartIntervalSelectedOption: newInterval
              ? newInterval
              : CHART_INTERVALS_DICTIONARY[0],
            dropdownChartDurationSelectedOption: newDictionary
              ? newDictionary
              : DROPDOWN_OPTIONS_DICTIONARY[`m`][0],
          });
        }
      },
    });
  });
};
