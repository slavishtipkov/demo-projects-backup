import * as React from "react";
import { selectClock, selectUnits } from "@dtn/i18n-lib";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { DailySurfaceData, HourlySurfaceData } from "../../../interfaces";
import {
  selectCurrentConditionsByObservation,
  selectCurrentConditionsByForecast,
  selectError,
  CurrentConditionsActions,
  CurrentConditionsState,
  fetchCurrentConditionsDataAction,
  selectCoordinates,
  selectUnitsSelector,
  selectVisibleFields,
  setErrorMessageAction,
  selectLoadingState,
  selectObservedAt,
  selectObservedAtTime,
  changeCurrentConditionsByForecast,
  selectTimezone,
  selectShowCurrentObservation,
} from "../../../store";
import { IndexView } from "../../views";
import { Props as IndexViewProps } from "../../views/index-view";
import { Coordinates } from "../../../interfaces";

const mapStateToProps = (state: CurrentConditionsState): Partial<IndexViewProps> => ({
  loading: selectLoadingState(state),
  coordinates: selectCoordinates(state),
  units: selectUnitsSelector(state),
  visibleFields: selectVisibleFields(state),
  currentConditionsByObservation: selectCurrentConditionsByObservation(state),
  currentConditionsByForecast: selectCurrentConditionsByForecast(state),
  error: selectError(state),
  observedAt: selectObservedAt(state),
  observedAtTime: selectObservedAtTime(state),
  timezone: selectTimezone(state),
  showCurrentObservation: selectShowCurrentObservation(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<CurrentConditionsActions>,
): Partial<IndexViewProps> => ({
  fetchCurrentConditionsDataAction: (coordinates?: Coordinates, days?: number, units?: string) =>
    dispatch(fetchCurrentConditionsDataAction(coordinates, days, units)),
  setErrorMessage: (error: string) => dispatch(setErrorMessageAction(error)),
  changeCurrentConditionsByForecast: (
    currentConditionsByForecast: ReadonlyArray<DailySurfaceData>,
  ) => dispatch(changeCurrentConditionsByForecast(currentConditionsByForecast)),
});

export default connect<
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  CurrentConditionsState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
