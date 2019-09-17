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
  selectLocationId,
  selectCommodityId,
  selectRange,
  fetchLocationsForSite,
  selectLocations,
  selectCommodities,
  fetchCommoditiesForSite,
  selectDeliveryPeriods,
  fetchDeliveryPeriods,
  changeLocation,
  changeCommodity,
  changeDeliveryEndDate,
  changeAdditionalOptions,
  changeRange,
  redrawCashBidsData,
  setRedrawChartTime,
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
  locationId: selectLocationId(state),
  commodityId: selectCommodityId(state),
  range: selectRange(state),
  locations: selectLocations(state),
  commodities: selectCommodities(state),
  deliveryPeriods: selectDeliveryPeriods(state),
});
const mapDispatchToProps = (dispatch: Dispatch<BasicCashBidsActions>): Partial<IndexViewProps> => ({
  fetchBasicCashBids: (
    cashBidId: number,
    duration: string,
    siteId: string,
    range: {
      readonly start: string;
      readonly end: string;
    },
    locationId?: number,
    commodityId?: number,
  ) =>
    dispatch(fetchBasicCashBidsData(cashBidId, duration, siteId, range, locationId, commodityId)),
  redrawCashBidsData: (
    cashBidId: number,
    duration: string,
    siteId: string,
    range: {
      readonly start: string;
      readonly end: string;
    },
  ) => dispatch(redrawCashBidsData(cashBidId, duration, siteId, range)),
  setErrorMessage: (error: string) => dispatch(setErrorMessage(error)),
  changeCashBidId: (cashBidId: number) => dispatch(changeCashBidId(cashBidId)),
  fetchLocationsForSite: (siteId: string) => dispatch(fetchLocationsForSite(siteId)),
  fetchCommoditiesForSite: (siteId: string, locationId: number) =>
    dispatch(fetchCommoditiesForSite(siteId, locationId)),
  fetchDeliveryPeriods: (siteId: string, locationId: number, commodityId: number) =>
    dispatch(fetchDeliveryPeriods(siteId, locationId, commodityId)),
  changeLocation: (locationId?: number, location?: string) =>
    dispatch(changeLocation(locationId, location)),
  changeCommodity: (commodityId?: number, commodity?: string) =>
    dispatch(changeCommodity(commodityId, commodity)),
  changeDeliveryEndDate: (deliveryEndDate: string, cashBidId: number) =>
    dispatch(changeDeliveryEndDate(deliveryEndDate, cashBidId)),
  changeAdditionalOptions: (additionalOptions: {
    readonly showCurrentBasis: boolean;
    readonly show3YearAverageBasis: boolean;
    readonly show3YearAverageCashPrice: boolean;
  }) => dispatch(changeAdditionalOptions(additionalOptions)),
  changeRange: (range: { readonly start: string; readonly end: string }) =>
    dispatch(changeRange(range)),
  setRedrawChartTime: (redrawChartTime: string, previousRedrawState: string) =>
    dispatch(setRedrawChartTime(redrawChartTime, previousRedrawState)),
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
