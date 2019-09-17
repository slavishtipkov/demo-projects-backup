import * as React from "react";
import { Units } from "@dtn/i18n-lib";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  fetchHourlyForecastData,
  selectHourlyForecast,
  selectCoordinates,
  HourlyForecastState,
  HourlyForecastActions,
  selectDays,
  selectUnits,
  selectLoading,
  selectError,
  setErrorMessage,
  selectObservedAt,
  fetchObservedAtData,
  selectObservedAtTime,
  selectVisibleFields,
  selectDayForecast,
  selectWidgetName,
  selectUser,
  premiumHourlyForecastRequest,
  selectCoordinatesFromEpic,
  selectShowHourlyForecast,
  selectZipCode,
  selectStation,
  selectShowStationSelect,
  selectShowZipCode,
  selectPremiumRequestSuccess,
  selectTimezone,
} from "../../../store";
import { default as IndexView } from "../../views/index-view";
import { Props as IndexViewProps } from "../../views/index-view";
import { Coordinates, Station } from "../../../interfaces";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as PremiumLocationSelectWidget from "@dtn/premium-location-select-widget";

const mapStateToProps = (state: HourlyForecastState): Partial<IndexViewProps> => ({
  weatherForecastData: selectHourlyForecast(state),
  dayForecastData: selectDayForecast(state),
  coordinates: selectCoordinates(state),
  user: selectUser(state),
  widgetName: selectWidgetName(state),
  visibleFields: selectVisibleFields(state),
  loading: selectLoading(state),
  days: selectDays(state),
  units: selectUnits(state),
  error: selectError(state),
  observedAt: selectObservedAt(state),
  observedAtTime: selectObservedAtTime(state),
  coordinatesFromEpic: selectCoordinatesFromEpic(state),
  showHourlyForecast: selectShowHourlyForecast(state),
  zipCode: selectZipCode(state),
  selectedStation: selectStation(state),
  showStationSelect: selectShowStationSelect(state),
  showZipCode: selectShowZipCode(state),
  hasSuccessPremiumRequest: selectPremiumRequestSuccess(state),
  timezone: selectTimezone(state),
});
const mapDispatchToProps = (
  dispatch: Dispatch<HourlyForecastActions>,
): Partial<IndexViewProps> => ({
  fetchPremiumHourlyForecastData: (
    user: string,
    widgetName: string,
    coordinates?: Coordinates,
    days?: number,
    units?: string,
  ) => dispatch(premiumHourlyForecastRequest(user, widgetName, coordinates, days, units)),
  fetchHourlyForecastData: (coordinates: Coordinates, days: number, units?: string) =>
    dispatch(fetchHourlyForecastData(coordinates, days, units)),
  setErrorMessage: (error: string) => dispatch(setErrorMessage(error)),
  getZipCodeByCoordinates: (coordinates: Coordinates) =>
    dispatch(ZipCodeWidget.getZipCode(coordinates)),
  setZipCode: (zipCode: string) => dispatch(ZipCodeWidget.fetchZipCodeDataAction({ zipCode })),
  selectStation: (station: Station) =>
    dispatch(PremiumLocationSelectWidget.selectSelectedStationAction(station)),
});

export default connect<
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  HourlyForecastState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
