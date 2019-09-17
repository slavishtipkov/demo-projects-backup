import { getMapState, NamespacedState } from "../";

export const getMapStyleState = (state: NamespacedState) => getMapState(state).mapStyle;

export const getActiveStyleId = (state: NamespacedState) => getMapStyleState(state).activeStyleId;

export const getAvailableStyles = (state: NamespacedState) =>
  getMapStyleState(state).availableStyles;

export const getMapStyleById = (state: NamespacedState, mapStyleId: string) =>
  getAvailableStyles(state).find(({ id }) => id === mapStyleId);

export const getActiveStyle = (state: NamespacedState) =>
  getMapStyleById(state, getActiveStyleId(state));
