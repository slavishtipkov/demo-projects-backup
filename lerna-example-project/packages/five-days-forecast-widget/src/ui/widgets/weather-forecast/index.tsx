import * as React from "react";
import { Units } from "@dtn/i18n-lib";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  fetchWeatherForecastData,
  selectWeatherForecast,
  selectCoordinates,
  WeatherForecastState,
  WeatherForecastActions,
  selectDays,
  selectUnits,
  selectActiveDay,
  selectAllowDaySelection,
  selectActiveDayAction,
  selectAllowDaySelectionAction,
  selectLoading,
  selectError,
  setErrorMessage,
  selectObservedAt,
  selectObservedAtTime,
  selectShowFooter,
  hideFooter,
  selectTimezone,
} from "../../../store";
import { default as IndexView } from "../../views/index-view";
import { Props as IndexViewProps } from "../../views/index-view";
import { Coordinates } from "../../../interfaces";

const mapStateToProps = (state: WeatherForecastState): Partial<IndexViewProps> => ({
  weatherForecastData: selectWeatherForecast(state),
  coordinates: selectCoordinates(state),
  loading: selectLoading(state),
  days: selectDays(state),
  units: selectUnits(state),
  allowDaySelection: selectAllowDaySelection(state),
  activeDay: selectActiveDay(state),
  error: selectError(state),
  observedAt: selectObservedAt(state),
  observedAtTime: selectObservedAtTime(state),
  showFooter: selectShowFooter(state),
  timezone: selectTimezone(state),
});
const mapDispatchToProps = (
  dispatch: Dispatch<WeatherForecastActions>,
): Partial<IndexViewProps> => ({
  fetchWeatherForecastData: (
    coordinates?: Coordinates,
    days?: number,
    units?: string,
    showFooter?: boolean,
  ) => dispatch(fetchWeatherForecastData(coordinates, days, units, showFooter)),
  setActiveDay: (activeDay: number) => dispatch(selectActiveDayAction(activeDay)),
  setAllowDaySelection: (allowDaySelection: boolean) =>
    dispatch(selectAllowDaySelectionAction(allowDaySelection)),
  setErrorMessage: (error: string) => dispatch(setErrorMessage(error)),
  hideFooter: () => dispatch(hideFooter()),
});

export default connect<
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  WeatherForecastState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
