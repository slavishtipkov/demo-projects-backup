import * as mapboxgl from "mapbox-gl";
import { concat, EMPTY, interval, Observable, of } from "rxjs";
import { animationFrame } from "rxjs/internal/scheduler/animationFrame";
import { filter, flatMap, ignoreElements, take, tap, withLatestFrom } from "rxjs/operators";
import {
  getActiveLayersIds,
  getActiveLayerStackingContext,
  getLayerById,
  getUuid,
  MapEpic,
} from "../";
import { StyleDefinition } from "../../interfaces";
import { addRasterOverlayLayer, removeRasterOverlayLayer } from "../../utils/layers";
import { ChangeMapStyleAction, MapStyleActionTypes, mapStyleChanged } from "./actions";
import { getActiveStyleId, getMapStyleById } from "./selectors";

export function changeMapStyle(map: mapboxgl.Map, style: StyleDefinition): Observable<{}> {
  map.setStyle(style.url);
  return interval(0, animationFrame).pipe(
    filter(() => map.isStyleLoaded()),
    take(1),
  );
}

export const changeMapStyleEpic: MapEpic = (action$, state$, { map }) => {
  return action$.pipe(
    filter(
      (action): action is ChangeMapStyleAction =>
        action.type === MapStyleActionTypes.CHANGE_MAP_STYLE,
    ),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
      let nextMapStyle = getMapStyleById(state, action.payload.mapStyleId);
      let activeStyleId = getActiveStyleId(state);
      let activeLayersIds = getActiveLayersIds(state);

      if (!nextMapStyle || !activeStyleId || !activeLayersIds) {
        throw new Error("Couldnt find active style or next active style");
      }

      if (nextMapStyle.id === activeStyleId) {
        return EMPTY;
      }

      activeLayersIds.forEach(layerId =>
        removeRasterOverlayLayer(getLayerById(state, layerId)!, map),
      );

      return concat(
        changeMapStyle(map, nextMapStyle).pipe(
          tap(() => {
            activeLayersIds.forEach(layerId =>
              addRasterOverlayLayer(
                getLayerById(state, layerId)!,
                map,
                getActiveLayerStackingContext(state),
                getUuid(state),
              ),
            );
          }),
          ignoreElements(),
        ),
        of(mapStyleChanged(nextMapStyle.id)),
      );
    }),
  );
};
