import { Reducer } from "redux";
import { MapActions } from "../";
import { Preset } from "../../interfaces";

export interface PresetsState {
  readonly presets: ReadonlyArray<Preset>;
}

export const initialState: PresetsState = {
  presets: [],
};

export const presetsReducer: Reducer<PresetsState, MapActions> = (state = initialState, action) => {
  if (!action) return state;

  switch (action.type) {
    default:
      return state;
  }
};
