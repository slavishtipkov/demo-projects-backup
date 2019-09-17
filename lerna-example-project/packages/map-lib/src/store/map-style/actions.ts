import { Action, ActionCreator } from "redux";

export type MapStyleActions = ChangeMapStyleAction | MapStyleChangedAction;

export const enum MapStyleActionTypes {
  CHANGE_MAP_STYLE = "CHANGE_MAP_STYLE",
  MAP_STYLE_CHANGED = "MAP_STYLE_CHANGED",
}

export interface ChangeMapStyleAction extends Action<MapStyleActionTypes> {
  readonly type: MapStyleActionTypes.CHANGE_MAP_STYLE;
  readonly payload: {
    readonly mapStyleId: string;
  };
}

export const changeMapStyle: ActionCreator<ChangeMapStyleAction> = (mapStyleId: string) => ({
  type: MapStyleActionTypes.CHANGE_MAP_STYLE,
  payload: {
    mapStyleId,
  },
});

export interface MapStyleChangedAction extends Action<MapStyleActionTypes> {
  readonly type: MapStyleActionTypes.MAP_STYLE_CHANGED;
  readonly payload: {
    readonly mapStyleId: string;
  };
}

export const mapStyleChanged: ActionCreator<MapStyleChangedAction> = (mapStyleId: string) => ({
  type: MapStyleActionTypes.MAP_STYLE_CHANGED,
  payload: {
    mapStyleId,
  },
});
