import * as React from "react";
import { Units } from "@dtn/i18n-lib";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  fetchPremiumWeatherForecastData,
  selectWeatherForecast,
  selectCoordinates,
  PremiumWeatherForecastState,
  PremiumWeatherForecastActions,
  selectDays,
  selectUnits,
  selectLoading,
  selectError,
  setErrorMessage,
  selectObservedAt,
  selectObservedAtTime,
  selectWidgetName,
  selectUser,
  premiumWeatherForecastRequest,
  selectCoordinatesFromEpic,
  selectShowDailyForecast,
  selectZipCode,
  selectStation,
  selectShowStationSelect,
  selectShowZipCode,
  selectPremiumRequestSuccess,
  selectHourlyData,
  selectTimezone,
} from "../../../store";
import { default as IndexView } from "../../views/index-view";
import { Props as IndexViewProps } from "../../views/index-view";
import { Coordinates, Station } from "../../../interfaces";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as PremiumLocationSelectWidget from "@dtn/premium-location-select-widget";

const mapStateToProps = (state: PremiumWeatherForecastState): Partial<IndexViewProps> => ({
  weatherForecastData: selectWeatherForecast(state),
  coordinates: selectCoordinates(state),
  loading: selectLoading(state),
  days: selectDays(state),
  units: selectUnits(state),
  error: selectError(state),
  observedAt: selectObservedAt(state),
  observedAtTime: selectObservedAtTime(state),
  user: selectUser(state),
  widgetName: selectWidgetName(state),
  coordinatesFromEpic: selectCoordinatesFromEpic(state),
  showDailyForecast: selectShowDailyForecast(state),
  zipCode: selectZipCode(state),
  selectedStation: selectStation(state),
  showStationSelect: selectShowStationSelect(state),
  showZipCode: selectShowZipCode(state),
  hasSuccessPremiumRequest: selectPremiumRequestSuccess(state),
  hourlyObservation: selectHourlyData(state),
  timezone: selectTimezone(state),
});
const mapDispatchToProps = (
  dispatch: Dispatch<PremiumWeatherForecastActions>,
): Partial<IndexViewProps> => ({
  fetchPremiumWeatherForecastData: (
    user: string,
    widgetId: string,
    coordinates?: Coordinates,
    days?: number,
    units?: string,
  ) => dispatch(premiumWeatherForecastRequest(user, widgetId, coordinates, days, units)),
  fetchWeatherForecastData: (coordinates?: Coordinates, days?: number, units?: string) =>
    dispatch(fetchPremiumWeatherForecastData(coordinates, days, units)),
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
  PremiumWeatherForecastState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
