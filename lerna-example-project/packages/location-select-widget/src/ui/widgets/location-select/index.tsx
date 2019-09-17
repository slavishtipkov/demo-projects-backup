import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { default as IndexView } from "../../views/index-view";
import { Props as IndexViewProps } from "../../views/index-view";
import {
  LocationSelectActions,
  LocationSelectState,
  selectError,
  selectIsDropdownExpanded,
  selectLoading,
  selectStations,
  selectSelectedStation,
  selectWidgetName,
  selectSelectedStationAction,
  setErrorMessageAction,
  setIsDropdownExpandedAction,
  removeSelectedStationAction,
  selectIsSameStationSelected,
  setIsSameStationSelected,
} from "../../../store";
import { Station } from "../../../interfaces";

const mapStateToProps = (state: LocationSelectState): Partial<IndexViewProps> => ({
  stations: selectStations(state),
  selectedStation: selectSelectedStation(state),
  loading: selectLoading(state),
  error: selectError(state),
  isDropdownExpanded: selectIsDropdownExpanded(state),
  widgetName: selectWidgetName(state),
  isSameStationSelected: selectIsSameStationSelected(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<LocationSelectActions>,
): Partial<IndexViewProps> => ({
  setSelectedStation: (selectedStation: Station) =>
    dispatch(selectSelectedStationAction(selectedStation)),
  setErrorMessage: (error: string) => dispatch(setErrorMessageAction(error)),
  setIsDropdownExpanded: (isDropdownExpanded: boolean) =>
    dispatch(setIsDropdownExpandedAction(isDropdownExpanded)),
  removeSelectedStation: () => dispatch(removeSelectedStationAction()),
  setIsSameStationSelected: (isStationSame: boolean) =>
    dispatch(setIsSameStationSelected(isStationSame)),
});

export default connect<
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  LocationSelectState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
