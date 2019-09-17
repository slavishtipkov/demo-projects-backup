import { empty, of, race } from "rxjs";
import { delay, filter, flatMap, map, take, withLatestFrom } from "rxjs/operators";
import { MapEpic } from "../";
import {
  LayersActionTypes,
  RemoveLayerAction,
  ScheduledLayerUpdateCanceledAction,
  scheduledLayerUpdateCancelled,
  updateLayer,
  UpdateLayerAction,
} from "./actions";
import { getLayerById } from "./selectors";

export const updateLayerSchedulerEpic: MapEpic = (action$, state$) => {
  let cancel$ = action$.pipe(
    filter(
      (action): action is UpdateLayerAction | RemoveLayerAction =>
        action.type === LayersActionTypes.UPDATE_LAYER ||
        action.type === LayersActionTypes.REMOVE_LAYER,
    ),
  );

  return action$.pipe(
    filter((action): action is UpdateLayerAction => action.type === LayersActionTypes.UPDATE_LAYER),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
      let { layerId } = action.payload;
      let layer = getLayerById(state, layerId);

      if (!layer || !layer.refreshInterval) {
        return empty();
      }

      return race<UpdateLayerAction | ScheduledLayerUpdateCanceledAction>(
        of(updateLayer(layerId)).pipe(
          delay(layer.refreshInterval),
          take(1),
        ),
        cancel$.pipe(
          filter(action => action.payload.layerId === layerId),
          map(() => scheduledLayerUpdateCancelled(layerId)),
          take(1),
        ),
      );
    }),
  );
};
