import { of } from "rxjs";
import { filter, switchMap, withLatestFrom } from "rxjs/operators";
import { AnimationActionTypes, MapEpic, StopAnimationAction } from "../";
import { LayersActionTypes, UpdateAllLayersAction, updateLayer } from "./actions";
import { getActiveLayersIds } from "./selectors";

export const updateAllLayersEpic: MapEpic = (action$, state$, { map }) => {
  return action$.pipe(
    filter(
      (action): action is UpdateAllLayersAction | StopAnimationAction =>
        action.type === LayersActionTypes.UPDATE_ALL_LAYERS ||
        action.type === AnimationActionTypes.STOP_ANIMATION,
    ),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      let activeLayersIds = getActiveLayersIds(state);
      return of(...activeLayersIds.map(updateLayer));
    }),
  );
};
