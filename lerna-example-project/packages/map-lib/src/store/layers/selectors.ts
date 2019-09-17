import { getMapState, NamespacedState } from "../";
import { LayerId } from "../../interfaces";

export const getLayersState = (state: NamespacedState) => getMapState(state).layers;

export const getAvailableLayers = (state: NamespacedState) => getLayersState(state).availableLayers;

export const getActiveLayerDescriptors = (state: NamespacedState) =>
  getLayersState(state).activeLayerDescriptors;

export const getActiveLayersIds = (state: NamespacedState) =>
  getActiveLayerDescriptors(state).map(({ layerId }) => layerId);

export const getLayerById = (state: NamespacedState, layerId: LayerId) => {
  let availableLayers = getAvailableLayers(state);
  return availableLayers.find(layer => layer.id === layerId);
};

export const getActiveLayers = (state: NamespacedState) =>
  getActiveLayersIds(state).map(layerId => getLayerById(state, layerId));

export const getActiveAnimatableLayers = (state: NamespacedState) =>
  getActiveLayers(state).filter(l => l !== undefined && l.animation && l.animation.interval > 0);

export const getActiveLayerStackingContext = (state: NamespacedState) =>
  getActiveLayers(state)
    .filter(Boolean)
    .map(l => ({ layerId: l!.id, zIndex: l!.zIndex }));
