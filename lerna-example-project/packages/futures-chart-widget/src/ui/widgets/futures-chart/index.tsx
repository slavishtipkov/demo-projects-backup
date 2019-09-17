import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  FuturesChartState,
  FuturesChartActions,
  selectLoading,
  selectError,
  setErrorMessage,
  selectWidgetName,
  selectChartData,
  selectChartType,
  selectSymbolConfig,
  selectQuote,
  selectSymbolPriceHistory,
  getQuoteForSymbol,
  getPriceHistoryForSymbol,
  changeChartType,
  selectInterval,
  selectDuration,
} from "../../../store";
import { default as IndexView } from "../../views/index-view";
import { Props as IndexViewProps } from "../../views/index-view";

const mapStateToProps = (state: FuturesChartState): Partial<IndexViewProps> => ({
  loading: selectLoading(state),
  error: selectError(state),
  widgetName: selectWidgetName(state),
  chartData: selectChartData(state),
  chartType: selectChartType(state),
  symbolConfig: selectSymbolConfig(state),
  quote: selectQuote(state),
  symbolPriceHistory: selectSymbolPriceHistory(state),
  interval: selectInterval(state),
  duration: selectDuration(state),
});

const mapDispatchToProps = (dispatch: Dispatch<FuturesChartActions>): Partial<IndexViewProps> => ({
  getQuoteForSymbol: (symbol: string) => dispatch(getQuoteForSymbol(symbol)),
  getPriceHistoryForSymbol: (symbol: string, interval: string, duration: string) =>
    dispatch(getPriceHistoryForSymbol(symbol, interval, duration)),
  setErrorMessage: (error: string) => dispatch(setErrorMessage(error)),
  changeChartType: (chartType: string) => dispatch(changeChartType(chartType)),
});

export default connect<
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  FuturesChartState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
