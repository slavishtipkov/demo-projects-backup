import { concat, empty, of } from "rxjs";
import { filter, flatMap, withLatestFrom } from "rxjs/operators";
import { addLayer, getActiveLayersIds, MapEpic, removeLayer } from "../";
import { ApplyPresetAction, PresetsActionTypes } from "./actions";
import { getPresets } from "./selectors";

export const applyPresetEpic: MapEpic = (action$, state$) => {
  return action$.pipe(
    filter(
      (action): action is ApplyPresetAction => action.type === PresetsActionTypes.APPLY_PRESET,
    ),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
      let preset = getPresets(state).find(p => p.name === action.payload.name);
      if (!preset) {
        return empty();
      }
      let activeLayerIds = getActiveLayersIds(state);
      return concat(of(...activeLayerIds.map(removeLayer)), of(...preset.layers.map(addLayer)));
    }),
  );
};
