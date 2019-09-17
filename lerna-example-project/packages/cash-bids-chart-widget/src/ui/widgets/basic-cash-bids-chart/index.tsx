import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  selectLoading,
  selectError,
  setErrorMessage,
  BasicCashBidsState,
  selectSymbol,
  fetchBasicCashBidsData,
  changeCashBidId,
  BasicCashBidsActions,
  selectUpdatedAt,
  selectChartData,
  selectDuration,
  selectLocation,
  selectCommodity,
  selectSiteId,
  selectDeliveryEndDate,
  selectCashBidId,
  selectShowCurrentBasis,
  selectShow3YearAverageBasis,
  selectShow3YearAverageCashPrice,
} from "../../../store";
import { default as IndexView } from "../../views/index-view";
import { Props as IndexViewProps } from "../../views/index-view";

const mapStateToProps = (state: BasicCashBidsState): Partial<IndexViewProps> => ({
  symbol: selectSymbol(state),
  location: selectLocation(state),
  commodity: selectCommodity(state),
  deliveryEndDate: selectDeliveryEndDate(state),
  updatedAt: selectUpdatedAt(state),
  loading: selectLoading(state),
  error: selectError(state),
  chartData: selectChartData(state),
  duration: selectDuration(state),
  siteId: selectSiteId(state),
  cashBidId: selectCashBidId(state),
  showCurrentBasis: selectShowCurrentBasis(state),
  show3YearAverageBasis: selectShow3YearAverageBasis(state),
  show3YearAverageCashPrice: selectShow3YearAverageCashPrice(state),
});
const mapDispatchToProps = (dispatch: Dispatch<BasicCashBidsActions>): Partial<IndexViewProps> => ({
  fetchBasicCashBids: (cashBidId: number, duration: string, siteId: string) =>
    dispatch(fetchBasicCashBidsData(cashBidId, duration, siteId)),
  setErrorMessage: (error: string) => dispatch(setErrorMessage(error)),
  changeCashBidId: (cashBidId: number) => dispatch(changeCashBidId(cashBidId)),
});

export default connect<
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  BasicCashBidsState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
