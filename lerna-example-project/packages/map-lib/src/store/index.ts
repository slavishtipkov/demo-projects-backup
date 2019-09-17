import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import * as mapboxgl from "mapbox-gl";
import { combineReducers } from "redux";
import { Epic } from "redux-observable";
import { Callbacks } from "../interfaces";
import { Animator, Api } from "../services";
import { AnimationActions, animationReducer, AnimationState } from "./animation";
import { CameraActions, cameraReducer, CameraState } from "./camera";
import { LayersActions, layersReducer, LayersState } from "./layers";
import { MapStyleActions, mapStyleReducer, MapStyleState } from "./map-style";
import { PresetsActions, presetsReducer, PresetsState } from "./presets";
import { UserInterfaceActions, userInterfaceReducer, UserInterfaceState } from "./user-interface";

export * from "./animation";
export * from "./callbacks";
export * from "./camera";
export * from "./layers";
export * from "./map-style";
export * from "./presets";
export * from "./user-interface";

export interface MapState {
  readonly camera: CameraState;
  readonly mapStyle: MapStyleState;
  readonly userInterface: UserInterfaceState;
  readonly layers: LayersState;
  readonly animation: AnimationState;
  readonly presets: PresetsState;
}

export interface NamespacedState extends I18nState {
  readonly map: MapState;
}

export type MapActions =
  | CameraActions
  | MapStyleActions
  | UserInterfaceActions
  | LayersActions
  | AnimationActions
  | PresetsActions
  | I18nActions;

export const reducer = combineReducers<MapState, MapActions>({
  camera: cameraReducer,
  mapStyle: mapStyleReducer,
  userInterface: userInterfaceReducer,
  layers: layersReducer,
  animation: animationReducer,
  presets: presetsReducer,
});

export const getMapState = (state: NamespacedState) => state.map;

export type MapEpic = Epic<
  MapActions,
  MapActions,
  NamespacedState,
  {
    readonly map: mapboxgl.Map;
    readonly api: Api;
    readonly animator: Animator;
    readonly callbacks?: Callbacks;
  }
>;
