import * as mapboxgl from "mapbox-gl";
import { Action, ActionCreator } from "redux";
import { Camera } from "../../interfaces";
import { toBoundingBox, toCoordinates } from "../../utils";

export type CameraActions =
  | SyncCameraAction
  | ZoomInAction
  | ZoomOutAction
  | ZoomInitiatedAction
  | StopZoomAction
  | ZoomStoppedAction
  | MoveCameraAction
  | CameraStoppedAction;

export const enum CameraActionTypes {
  SYNC_CAMERA = "SYNC_CAMERA",
  MOVE_CAMERA = "MOVE_CAMERA",
  CAMERA_STOPPED = "CAMERA_STOPPED",
  ZOOM_IN = "ZOOM_IN",
  ZOOM_OUT = "ZOOM_OUT",
  ZOOM_INITIATED = "ZOOM_INITIATED",
  STOP_ZOOM = "STOP_ZOOM",
  ZOOM_STOPPED = "ZOOM_STOPPED",
}

export interface SyncCameraAction extends Action<CameraActionTypes> {
  readonly type: CameraActionTypes.SYNC_CAMERA;
  readonly payload: Camera;
}

export const syncCamera: ActionCreator<SyncCameraAction> = (map: mapboxgl.Map) => ({
  type: CameraActionTypes.SYNC_CAMERA,
  payload: {
    zoom: map.getZoom(),
    boundingBox: toBoundingBox(map.getBounds()),
    pitch: map.getPitch(),
    bearing: map.getBearing(),
    center: toCoordinates(map.getCenter()),
  },
});

export interface ZoomInAction extends Action<CameraActionTypes> {
  readonly type: CameraActionTypes.ZOOM_IN;
}

export const zoomIn: ActionCreator<ZoomInAction> = () => ({
  type: CameraActionTypes.ZOOM_IN,
});

export interface ZoomOutAction extends Action<CameraActionTypes> {
  readonly type: CameraActionTypes.ZOOM_OUT;
}

export const zoomOut: ActionCreator<ZoomOutAction> = () => ({
  type: CameraActionTypes.ZOOM_OUT,
});

export interface ZoomInitiatedAction extends Action<CameraActionTypes> {
  readonly type: CameraActionTypes.ZOOM_INITIATED;
}

export const zoomInitiated: ActionCreator<ZoomInitiatedAction> = () => ({
  type: CameraActionTypes.ZOOM_INITIATED,
});

export interface StopZoomAction extends Action<CameraActionTypes> {
  readonly type: CameraActionTypes.STOP_ZOOM;
}

export const stopZoom: ActionCreator<StopZoomAction> = () => ({
  type: CameraActionTypes.STOP_ZOOM,
});

export interface ZoomStoppedAction extends Action<CameraActionTypes> {
  readonly type: CameraActionTypes.ZOOM_STOPPED;
}

export const zoomStopped: ActionCreator<ZoomStoppedAction> = () => ({
  type: CameraActionTypes.ZOOM_STOPPED,
});

export interface MoveCameraAction extends Action<CameraActionTypes> {
  readonly type: CameraActionTypes.MOVE_CAMERA;
  readonly payload: mapboxgl.FlyToOptions;
}

export const moveCamera: ActionCreator<MoveCameraAction> = (
  flyToOptions: mapboxgl.FlyToOptions,
) => ({
  type: CameraActionTypes.MOVE_CAMERA,
  payload: flyToOptions,
});

export interface CameraStoppedAction extends Action<CameraActionTypes> {
  readonly type: CameraActionTypes.CAMERA_STOPPED;
}

export const cameraStopped: ActionCreator<CameraStoppedAction> = () => ({
  type: CameraActionTypes.CAMERA_STOPPED,
});
