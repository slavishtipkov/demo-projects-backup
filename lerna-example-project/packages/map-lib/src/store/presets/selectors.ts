import { getMapState, NamespacedState } from "../";

export const getPresetsState = (state: NamespacedState) => getMapState(state).presets;
export const getPresets = (state: NamespacedState) => getPresetsState(state).presets;
