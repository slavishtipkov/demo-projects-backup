import { getLayerById, getMapState, NamespacedState } from "../";
import { LayerId } from "../../interfaces";

export const getAnimationState = (state: NamespacedState) => getMapState(state).animation;

export const layerAnimates = (state: NamespacedState, layerId: LayerId) =>
  !!getLayerById(state, layerId)!.animation;

export const getIsAnimating = (state: NamespacedState) =>
  Boolean(getAnimationState(state).isAnimating);
export const getTimeline = (state: NamespacedState) => getAnimationState(state).timeline;
export const getCurrentAnimationFrame = (state: NamespacedState) =>
  getAnimationState(state).currentAnimationFrame;
