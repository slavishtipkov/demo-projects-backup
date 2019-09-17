import { filter, map, tap, withLatestFrom } from "rxjs/operators";
import { CameraActionTypes, MapEpic } from "../";
import { getActiveAnimatableLayers, LayersActionTypes } from "../layers";
import {
  AnimationActionTypes,
  resumeAnimation,
  ResumeAnimationAction,
  startAnimation,
  StartAnimationAction,
  stopAnimation,
  StopAnimationAction,
} from "./actions";
import { getIsAnimating, layerAnimates } from "./selectors";

export const animationManagerEpic: MapEpic = (action$, state$, { animator }) => {
  return action$.pipe(
    withLatestFrom(state$),
    tap(([action, state]) => {
      if (action.type === AnimationActionTypes.STOP_ANIMATION) {
        if (animator.backgroundLoad) {
          animator.backgroundLoad.unsubscribe();
        }
      }
    }),
    filter(([, state]) => getIsAnimating(state)),
    map(([action, state]) => {
      switch (action.type) {
        case CameraActionTypes.SYNC_CAMERA:
          if (animator.backgroundLoad) {
            animator.backgroundLoad.unsubscribe();
          }
          animator.cache.empty();
          return resumeAnimation();
        case LayersActionTypes.ADD_LAYER:
          return layerAnimates(state, action.payload.layerId) ? startAnimation() : undefined;
        case LayersActionTypes.REMOVE_LAYER:
          if (!layerAnimates(state, action.payload.layerId)) {
            return undefined;
          }
          let activeAnimatableLayers = getActiveAnimatableLayers(state);
          let remainingActiveAnimatableLayers = activeAnimatableLayers.filter(
            l => l!.id !== action.payload.layerId,
          );
          return remainingActiveAnimatableLayers.length === 0 ? stopAnimation() : startAnimation();
        default:
          return undefined;
      }
    }),
    filter(
      (action): action is StartAnimationAction | StopAnimationAction | ResumeAnimationAction =>
        !!action,
    ),
  );
};
