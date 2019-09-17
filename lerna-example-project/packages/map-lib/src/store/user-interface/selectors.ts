import { getMapState, NamespacedState } from "../";

export const getUserInterfaceState = (state: NamespacedState) => getMapState(state).userInterface;
export const getUuid = (state: NamespacedState) => getUserInterfaceState(state).uuid;
export const getPointOfInterestCoordinates = (state: NamespacedState) =>
  getUserInterfaceState(state).pointOfInterestCoordinates;
export const getLoadingLayers = (state: NamespacedState) =>
  getUserInterfaceState(state).loadingLayers;
export const getLoadingAnimation = (state: NamespacedState) =>
  getUserInterfaceState(state).loadingAnimation;
