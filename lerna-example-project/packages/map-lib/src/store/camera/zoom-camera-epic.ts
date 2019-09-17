import { filter, map as mapOperator, withLatestFrom } from "rxjs/operators";
import { MapEpic } from "../";
import {
  CameraActionTypes,
  cameraStopped,
  StopZoomAction,
  ZoomInAction,
  zoomInitiated,
  ZoomOutAction,
} from "./actions";
import { getZoom } from "./selectors";

export const zoomCameraEpic: MapEpic = (action$, state$, { map }) => {
  return action$.pipe(
    filter(
      (action): action is ZoomInAction | ZoomOutAction | StopZoomAction =>
        action.type === CameraActionTypes.ZOOM_IN ||
        action.type === CameraActionTypes.ZOOM_OUT ||
        action.type === CameraActionTypes.STOP_ZOOM,
    ),
    withLatestFrom(state$),
    mapOperator(([{ type }, state]) => {
      if (type === CameraActionTypes.STOP_ZOOM) {
        let zoomWhenInitiated = getZoom(state);
        let currentZoom = map.getZoom();
        let delta = zoomWhenInitiated - currentZoom;

        if (Math.abs(delta) < 1) {
          let nextZoom = delta < 0 ? 1 : -1;
          map.flyTo({ zoom: zoomWhenInitiated + nextZoom });
        } else {
          map.stop();
        }
        return cameraStopped();
      } else {
        map.flyTo({
          zoom: type === CameraActionTypes.ZOOM_IN ? map.getMaxZoom() : map.getMinZoom(),
          speed: 1 / 3,
        });
        return zoomInitiated();
      }
    }),
  );
};
