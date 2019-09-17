import { filter, find, uniqBy } from "lodash-es";
import { Reducer } from "redux";
import { LayersActionTypes, MapActions } from "../";
import { ActiveLayerDescriptor, LayerDefinition } from "../../interfaces";

export interface LayersState {
  readonly activeLayerDescriptors: ReadonlyArray<ActiveLayerDescriptor>;
  readonly availableLayers: ReadonlyArray<LayerDefinition>;
}

export let initialState: LayersState = {
  activeLayerDescriptors: [],
  availableLayers: [],
};

export const layersReducer: Reducer<LayersState, MapActions> = (state = initialState, action) => {
  if (!action) return state;

  switch (action.type) {
    case LayersActionTypes.ADD_LAYER:
      if (
        find(
          state.activeLayerDescriptors,
          activeLayer => action.payload.layerId === activeLayer.layerId,
        )
      ) {
        return state;
      }
      return {
        ...state,
        activeLayerDescriptors: [
          ...state.activeLayerDescriptors,
          { layerId: action.payload.layerId },
        ],
      };
    case LayersActionTypes.UPDATE_LAYER_SUCCESS:
      let existing = find(
        state.activeLayerDescriptors,
        activeLayer => action.payload.layerId === activeLayer.layerId,
      );
      if (!existing) return state;
      return {
        ...state,
        activeLayerDescriptors: uniqBy(
          [
            { ...existing, lastUpdated: action.payload.lastUpdated },
            ...state.activeLayerDescriptors,
          ],
          "layerId",
        ),
      };
    case LayersActionTypes.GET_LEGEND_SUCCESS:
      let layerDescriptor = find(
        state.activeLayerDescriptors,
        activeLayer => activeLayer.layerId === action.payload.layerId,
      );

      if (!layerDescriptor) {
        return state;
      }
      return {
        ...state,
        activeLayerDescriptors: [
          ...filter(
            state.activeLayerDescriptors,
            activeLayer => activeLayer.layerId !== action.payload.layerId,
          ),
          {
            layerId: action.payload.layerId,
            lastUpdated: layerDescriptor.lastUpdated,
            legendUrls: action.payload.urls,
          },
        ],
      };
    case LayersActionTypes.REMOVE_LAYER:
    case LayersActionTypes.LAYER_ERROR:
      return {
        ...state,
        activeLayerDescriptors: filter(
          state.activeLayerDescriptors,
          activeLayer => activeLayer.layerId !== action.payload.layerId,
        ),
      };
    default:
      return state;
  }
};
