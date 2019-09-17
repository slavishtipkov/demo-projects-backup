import { Action, ActionCreator } from "redux";
import { MapsConfigInterface } from "../interfaces";

export const enum ActionTypes {
  SET_ACTIVE_MAP = "SET_ACTIVE_MAP",
  SET_ACTIVE_MAP_SUCCESS = "SET_ACTIVE_MAP_SUCCESS",
  SET_ACTIVE_MAP_ERROR = "SET_ACTIVE_MAP_ERROR",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  SET_IS_MAP_SIDEBAR_VISIBLE = "SET_IS_MAP_SIDEBAR_VISIBLE",
  SET_MAPS_LIST = "SET_MAPS_LIST",
}

export type Actions =
  | FetchMapImage
  | FetchMapImageSuccess
  | FetchMapImageError
  | SetMapSidebarState
  | SetMapsList
  | SetErrorMessageAction;

export interface FetchMapImage extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_ACTIVE_MAP;
  readonly payload: {
    readonly defaultMap: string;
  };
}

export const setActiveMap: ActionCreator<FetchMapImage> = (defaultMap: string) => ({
  type: ActionTypes.SET_ACTIVE_MAP,
  payload: {
    defaultMap,
  },
});

export interface FetchMapImageSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_ACTIVE_MAP_SUCCESS;
  readonly payload: {
    readonly mapImageData: string;
  };
}

export const setActiveMapSuccess: ActionCreator<FetchMapImageSuccess> = (mapImageData: string) => ({
  type: ActionTypes.SET_ACTIVE_MAP_SUCCESS,
  payload: {
    mapImageData,
  },
});

export interface FetchMapImageError extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_ACTIVE_MAP_ERROR;
  readonly payload: Blob;
  readonly error?: boolean;
}

export const setActiveMapError: ActionCreator<FetchMapImageError> = (errorMessage: Blob) => ({
  type: ActionTypes.SET_ACTIVE_MAP_ERROR,
  payload: errorMessage,
  error: true,
});

export interface SetErrorMessageAction extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_ERROR_MESSAGE;
  readonly payload: Error;
  readonly error?: boolean;
}

export const setErrorMessageAction: ActionCreator<SetErrorMessageAction> = (error: string) => ({
  type: ActionTypes.SET_ERROR_MESSAGE,
  payload: new Error(error),
  error: true,
});

export interface SetMapSidebarState extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_IS_MAP_SIDEBAR_VISIBLE;
  readonly payload: {
    readonly isMapSidebarVisible: boolean;
  };
}

export const setMapSidebarState: ActionCreator<SetMapSidebarState> = (
  isMapSidebarVisible: boolean,
) => ({
  type: ActionTypes.SET_IS_MAP_SIDEBAR_VISIBLE,
  payload: {
    isMapSidebarVisible,
  },
});

export interface SetMapsList extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_MAPS_LIST;
  readonly payload: {
    readonly maps: MapsConfigInterface;
    readonly defaultMap?: string;
  };
}

export const setMapsList: ActionCreator<SetMapsList> = (
  maps: MapsConfigInterface,
  defaultMap?: string,
) => ({
  type: ActionTypes.SET_MAPS_LIST,
  payload: {
    maps,
    defaultMap,
  },
});
