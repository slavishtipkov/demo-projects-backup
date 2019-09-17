import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { default as IndexView } from "../../views/index-view";
import { Props as IndexViewProps } from "../../views/index-view";
import {
  PremiumLocationSelectActions,
  PremiumLocationSelectState,
  selectError,
  selectIsDropdownExpanded,
  selectLoading,
  selectStations,
  selectSelectedStation,
  selectUser,
  selectWidgetName,
  selectSelectedStationAction,
  setErrorMessageAction,
  setIsDropdownExpandedAction,
  removeSelectedStationAction,
} from "../../../store";
import { Station } from "../../../interfaces";

const mapStateToProps = (state: PremiumLocationSelectState): Partial<IndexViewProps> => ({
  stations: selectStations(state),
  selectedStation: selectSelectedStation(state),
  loading: selectLoading(state),
  error: selectError(state),
  isDropdownExpanded: selectIsDropdownExpanded(state),
  user: selectUser(state),
  widgetName: selectWidgetName(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<PremiumLocationSelectActions>,
): Partial<IndexViewProps> => ({
  setSelectedStation: (selectedStation: Station) =>
    dispatch(selectSelectedStationAction(selectedStation)),
  setErrorMessage: (error: string) => dispatch(setErrorMessageAction(error)),
  setIsDropdownExpanded: (isDropdownExpanded: boolean) =>
    dispatch(setIsDropdownExpandedAction(isDropdownExpanded)),
  removeSelectedStation: () => dispatch(removeSelectedStationAction()),
});

export default connect<
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  PremiumLocationSelectState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
