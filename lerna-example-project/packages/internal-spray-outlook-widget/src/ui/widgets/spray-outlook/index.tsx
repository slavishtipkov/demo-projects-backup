import * as React from "react";
import { selectClock, selectUnits } from "@dtn/i18n-lib";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Location, ThresholdSettings, View } from "../../../interfaces";
import {
  changeViewAction,
  fetchSprayOutlookAction,
  fetchThresholdDefaultsAction,
  fetchThresholdSettingsAction,
  saveThresholdSettingsAction,
  selectCurrentView,
  selectForecastTimestamp,
  selectOutlooks,
  selectPreviousView,
  selectSettings,
  selectSettingsSaveInFlight,
  SprayOutlookActions,
  SprayOutlookState,
} from "../../../store";
import { IndexView } from "../../views";
import { Props as IndexViewProps } from "../../views/index-view";

const mapStateToProps = (state: SprayOutlookState): Partial<IndexViewProps> => ({
  outlooks: selectOutlooks(state),
  currentView: selectCurrentView(state),
  previousView: selectPreviousView(state),
  settings: selectSettings(state),
  forecastTimestamp: selectForecastTimestamp(state),
  settingsSaveInFlight: selectSettingsSaveInFlight(state),
  units: selectUnits(state),
  clock: selectClock(state),
});
const mapDispatchToProps = (dispatch: Dispatch<SprayOutlookActions>): Partial<IndexViewProps> => ({
  fetchSprayOutlook: (locations: ReadonlyArray<Location>) =>
    dispatch(fetchSprayOutlookAction({ locations })),
  fetchThresholdDefaults: () => dispatch(fetchThresholdDefaultsAction()),
  fetchThresholdSettings: () => dispatch(fetchThresholdSettingsAction()),
  saveThresholdSettings: (settings: ThresholdSettings) =>
    dispatch(saveThresholdSettingsAction(settings)),
  changeView: (view: View) => dispatch(changeViewAction(view)),
});

export default connect<
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  SprayOutlookState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
