import { getMapState, NamespacedState } from "../";

export const getCameraState = (state: NamespacedState) => getMapState(state).camera;

export const getBoundingBox = (state: NamespacedState) => getCameraState(state).boundingBox;

export const getZoom = (state: NamespacedState) => getCameraState(state).zoom;
