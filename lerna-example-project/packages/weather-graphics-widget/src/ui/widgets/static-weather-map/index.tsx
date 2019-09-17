import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { default as IndexView } from "../../views/index-view";
import { Props as IndexViewProps } from "../../views/index-view";
import {
  StaticWeatherMapActions,
  StaticWeatherMapState,
  selectError,
  selectLoading,
  setActiveMap,
  setErrorMessageAction,
  setMapSidebarState,
  setMapsList,
  selectMapsList,
  selectMapSidebarState,
  selectActiveMap,
  selectMapImageData,
} from "../../../store";
import { MapsConfigInterface } from "../../../interfaces";

const mapStateToProps = (state: StaticWeatherMapState): Partial<IndexViewProps> => ({
  loading: selectLoading(state),
  error: selectError(state),
  maps: selectMapsList(state),
  isMapSidebarVisible: selectMapSidebarState(state),
  defaultMap: selectActiveMap(state),
  mapImageData: selectMapImageData(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<StaticWeatherMapActions>,
): Partial<IndexViewProps> => ({
  setActiveMap: (defaultMap: string) => dispatch(setActiveMap(defaultMap)),
  setErrorMessage: (error: string) => dispatch(setErrorMessageAction(error)),
  setMapSidebarState: (isMapSidebarVisible: boolean) =>
    dispatch(setMapSidebarState(isMapSidebarVisible)),
  setMapsList: (maps: MapsConfigInterface, defaultMap?: string) =>
    dispatch(setMapsList(maps, defaultMap)),
});

export default connect<
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  StaticWeatherMapState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
