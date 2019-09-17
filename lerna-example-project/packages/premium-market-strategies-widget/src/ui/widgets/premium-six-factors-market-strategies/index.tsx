import * as React from "react";
import { Units } from "@dtn/i18n-lib";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  fetchMarketStrategies,
  fetchPremiumMarketStrategiesRequest,
  fetchCharts,
  PremiumSixFactorsMarketStrategiesState,
  PremiumSixFactorsMarketStrategiesActions,
  selectUnits,
  selectLoading,
  selectError,
  setErrorMessage,
  selectWidgetName,
  selectUser,
  selectMarketStrategiesData,
  selectHasSuccessPremiumRequest,
  selectDefaultCommodity,
  selectShowCommodities,
  selectCommodities,
  selectCharts,
  selectMoreInformationTexts,
} from "../../../store";
import { default as IndexView } from "../../views/index-view";
import { Props as IndexViewProps } from "../../views/index-view";
import {} from "../../../interfaces";
import { Commodities } from "@dtn/api-lib";

const mapStateToProps = (
  state: PremiumSixFactorsMarketStrategiesState,
): Partial<IndexViewProps> => ({
  loading: selectLoading(state),
  units: selectUnits(state),
  error: selectError(state),
  user: selectUser(state),
  widgetName: selectWidgetName(state),
  defaultCommodity: selectDefaultCommodity(state),
  showCommodities: selectShowCommodities(state),
  marketStrategiesData: selectMarketStrategiesData(state),
  hasSuccessPremiumRequest: selectHasSuccessPremiumRequest(state),
  commodities: selectCommodities(state),
  charts: selectCharts(state),
  moreInformationTexts: selectMoreInformationTexts(state),
});
const mapDispatchToProps = (
  dispatch: Dispatch<PremiumSixFactorsMarketStrategiesActions>,
): Partial<IndexViewProps> => ({
  fetchMarketStrategies: (commodity: Commodities) => dispatch(fetchMarketStrategies(commodity)),
  fetchPremiumMarketStrategiesRequest: (
    user: string,
    widgetName: string,
    commodity: Commodities,
    units?: string,
  ) => dispatch(fetchPremiumMarketStrategiesRequest(user, widgetName, commodity, units)),
  setErrorMessage: (error: string) => dispatch(setErrorMessage(error)),
  fetchCharts: (marketStrategyId: string, chartIds: ReadonlyArray<string>) =>
    dispatch(fetchCharts(marketStrategyId, chartIds)),
});

export default connect<
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  PremiumSixFactorsMarketStrategiesState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
