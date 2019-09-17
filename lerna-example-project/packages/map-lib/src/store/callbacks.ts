import { ignoreElements, tap } from "rxjs/operators";
import { AnimationActionTypes, LayersActionTypes, MapEpic } from "./";

export const callbacksEpic: MapEpic = (action$, state$, { callbacks }) => {
  return action$.pipe(
    tap(action => {
      if (!callbacks) return;
      switch (action.type) {
        case LayersActionTypes.LAYER_ADDED:
          if (callbacks.onLayerAdded) callbacks.onLayerAdded(action.payload.layerId);
          break;
        case LayersActionTypes.LAYER_REMOVED:
          if (callbacks.onLayerRemoved) callbacks.onLayerRemoved(action.payload.layerId);
          break;
        case AnimationActionTypes.START_ANIMATION:
          if (callbacks.onAnimationStart) callbacks.onAnimationStart();
          break;
        case AnimationActionTypes.STOP_ANIMATION:
          if (callbacks.onAnimationStop) callbacks.onAnimationStop();
          break;
        default:
          break;
      }
    }),
    ignoreElements(),
  );
};
