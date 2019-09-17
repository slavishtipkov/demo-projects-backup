import { of } from "rxjs";
import { filter, switchMap, withLatestFrom } from "rxjs/operators";
import { MapEpic } from "../";
import { LayersActionTypes, RemoveAllLayersAction, removeLayer } from "./actions";
import { getActiveLayersIds } from "./selectors";

export const removeAllLayersEpic: MapEpic = (action$, state$, { map }) => {
  return action$.pipe(
    filter(
      (action): action is RemoveAllLayersAction =>
        action.type === LayersActionTypes.REMOVE_ALL_LAYERS,
    ),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      let activeLayersIds = getActiveLayersIds(state);
      return of(...activeLayersIds.map(removeLayer));
    }),
  );
};
