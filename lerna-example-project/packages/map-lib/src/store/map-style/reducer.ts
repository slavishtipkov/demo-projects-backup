import { Reducer } from "redux";
import { MapActions, MapStyleActionTypes } from "../";
import { MapStylePalette, StyleDefinition } from "../../interfaces";

export interface MapStyleState {
  readonly activeStyleId: string;
  readonly availableStyles: ReadonlyArray<StyleDefinition>;
}

export const DEFAULT_MAP_STYLE_ID = "STREETS";

export let initialState: MapStyleState = {
  activeStyleId: DEFAULT_MAP_STYLE_ID,
  availableStyles: [
    {
      id: "STREETS",
      displayLabel: "Streets",
      url: "mapbox://styles/mapbox/streets-v10",
      palette: MapStylePalette.MEDIUM,
    },
  ],
};

export const mapStyleReducer: Reducer<MapStyleState, MapActions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case MapStyleActionTypes.MAP_STYLE_CHANGED:
      return {
        ...state,
        activeStyleId: action.payload.mapStyleId,
      };
    default:
      return state;
  }
};
