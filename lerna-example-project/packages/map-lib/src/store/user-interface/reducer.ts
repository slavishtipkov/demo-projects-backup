import { uniq, without } from "lodash-es";
import { Reducer } from "redux";
import { AnimationActionTypes, LayersActionTypes, MapActions } from "../";
import { guid } from "../../utils";
import { UserInterfaceActionTypes } from "./actions";

export interface UserInterfaceState {
  readonly uuid: string;
  readonly pointOfInterestCoordinates?: ReadonlyArray<number>;
  readonly loadingLayers: ReadonlyArray<string>;
  readonly loadingAnimation?: boolean;
}

export const initialState: UserInterfaceState = {
  uuid: guid(),
  loadingLayers: [],
  loadingAnimation: false,
};

export const userInterfaceReducer: Reducer<UserInterfaceState, MapActions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case LayersActionTypes.ADD_LAYER:
    case LayersActionTypes.LAYER_ADDED:
    case LayersActionTypes.REMOVE_LAYER:
    case LayersActionTypes.UPDATE_LAYER:
      return {
        ...state,
        loadingLayers: uniq([...state.loadingLayers, action.payload.layerId]),
      };
    case LayersActionTypes.LAYER_ERROR:
    case LayersActionTypes.LAYER_REMOVED:
    case LayersActionTypes.UPDATE_LAYER_SUCCESS:
      return {
        ...state,
        loadingLayers: without([...state.loadingLayers], action.payload.layerId),
      };
    case UserInterfaceActionTypes.CHANGE_POINT_OF_INTEREST:
      return {
        ...state,
        pointOfInterestCoordinates: action.payload.coordinates,
      };
    case AnimationActionTypes.START_ANIMATION:
      return {
        ...state,
        loadingAnimation: true,
      };
    case AnimationActionTypes.START_ANIMATION_SUCCESS:
    case AnimationActionTypes.STOP_ANIMATION:
      return {
        ...state,
        loadingAnimation: false,
      };
    default:
      return state;
  }
};
