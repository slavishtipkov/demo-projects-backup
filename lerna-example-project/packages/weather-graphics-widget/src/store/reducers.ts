import { Reducer } from "redux";
import { StaticWeatherMapActions } from "./";
import { ActionTypes } from "./actions";
import { DEFAULT_MAPS } from "../constants";
import { MapsConfigInterface } from "../interfaces";
import { getActiveMap } from "./utils";

export interface State {
  readonly loading: boolean;
  readonly maps: MapsConfigInterface;
  readonly defaultMap?: string;
  readonly mapImageData?: string;
  readonly isMapSidebarVisible?: boolean;
  readonly error?: string | Blob;
}

export const initialState: State = {
  loading: false,
  maps: DEFAULT_MAPS,
};

export const reducer: Reducer<State, StaticWeatherMapActions> = (state = initialState, action) => {
  if (!action) return state;

  switch (action.type) {
    case ActionTypes.SET_ACTIVE_MAP:
      return {
        ...state,
        defaultMap: action.payload.defaultMap,
        loading: true,
        error: undefined,
      };
    case ActionTypes.SET_ACTIVE_MAP_SUCCESS:
      return {
        ...state,
        mapImageData: action.payload.mapImageData,
        loading: false,
        error: undefined,
      };
    case ActionTypes.SET_ACTIVE_MAP_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        mapImageData: undefined,
      };
    case ActionTypes.SET_IS_MAP_SIDEBAR_VISIBLE:
      return {
        ...state,
        isMapSidebarVisible: action.payload.isMapSidebarVisible,
        error: undefined,
      };
    case ActionTypes.SET_ERROR_MESSAGE:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };
    case ActionTypes.SET_MAPS_LIST:
      return {
        ...state,
        maps: action.payload.maps,
        defaultMap: getActiveMap(action.payload.maps, action.payload.defaultMap),
      };
    default:
      return state;
  }
};
