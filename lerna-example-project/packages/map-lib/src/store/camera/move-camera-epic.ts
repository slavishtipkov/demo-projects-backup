import { filter, ignoreElements, tap } from "rxjs/operators";
import { MapEpic } from "../";
import { CameraActionTypes, MoveCameraAction } from "./actions";

export const moveCameraEpic: MapEpic = (action$, state$, { map }) => {
  return action$.pipe(
    filter((action): action is MoveCameraAction => action.type === CameraActionTypes.MOVE_CAMERA),
    tap(action => {
      map.flyTo(action.payload);
    }),
    ignoreElements(),
  );
};
