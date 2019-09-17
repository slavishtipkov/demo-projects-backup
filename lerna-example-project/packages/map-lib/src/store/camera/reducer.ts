import { Reducer } from "redux";
import { MapActions } from "../";
import { Camera } from "../../interfaces";
import { CameraActionTypes } from "./actions";

export interface CameraState extends Camera {
  readonly zoom: number;
}

export const initialState: CameraState = {
  boundingBox: {
    southWest: { longitude: -93.57113514968023, latitude: 44.71790844764652 },
    northEast: { longitude: -92.96658786496383, latitude: 45.18792261195648 },
  },
  center: { longitude: -93.57113514968023, latitude: 44.71790844764652 },
  pitch: 0,
  bearing: 0,
  zoom: 10,
};

export const cameraReducer: Reducer<CameraState, MapActions> = (state = initialState, action) => {
  if (!action) return state;

  switch (action.type) {
    case CameraActionTypes.SYNC_CAMERA:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
