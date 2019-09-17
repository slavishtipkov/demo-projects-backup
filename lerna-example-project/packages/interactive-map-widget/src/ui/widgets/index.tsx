import {
  addLayer,
  applyPreset,
  changeMapStyle,
  getActiveLayerDescriptors,
  getAvailableLayers,
  getBoundingBox,
  getIsAnimating,
  getLoadingLayers,
  getPointOfInterestCoordinates,
  getPresets,
  getZoom,
  MapActions,
  NamespacedState,
  removeAllLayers,
  removeLayer,
  startAnimation,
  stopAnimation,
  stopZoom,
  zoomIn,
  zoomOut,
} from "@dtn/map-lib";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import MainView, { Props as MainViewProps } from "../main-view";

const mapStateToProps = (state: NamespacedState): Partial<MainViewProps> => ({
  zoom: getZoom(state),
  boundingBox: getBoundingBox(state),
  pointOfInterestCoordinates: getPointOfInterestCoordinates(state),
  isAnimating: getIsAnimating(state),
  layers: getAvailableLayers(state),
  activeLayerDescriptors: getActiveLayerDescriptors(state),
  presets: getPresets(state),
  loadingLayers: getLoadingLayers(state),
});
const mapDispatchToProps = (dispatch: Dispatch<MapActions>): Partial<MainViewProps> => ({
  startAnimation: () => dispatch(startAnimation()),
  stopAnimation: () => dispatch(stopAnimation()),
  changeTheme: theme => dispatch(changeMapStyle(theme)),
  addLayer: layerId => dispatch(addLayer(layerId)),
  removeLayer: layerId => dispatch(removeLayer(layerId)),
  removeAllLayers: () => dispatch(removeAllLayers()),
  zoomIn: () => dispatch(zoomIn()),
  zoomOut: () => dispatch(zoomOut()),
  stopZoom: () => dispatch(stopZoom()),
  applyPreset: (presetName: string) => dispatch(applyPreset(presetName)),
});

export default connect<
  Partial<MainViewProps>,
  Partial<MainViewProps>,
  Partial<MainViewProps>,
  NamespacedState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(MainView);
