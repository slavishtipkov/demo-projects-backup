import { intersection } from "lodash-es";
import { concat, Observable, of } from "rxjs";
import { filter, mergeMap, tap, withLatestFrom } from "rxjs/operators";
import { getUuid, MapActions, MapEpic } from "../";
import { LayerDefinition, LayerTypes } from "../../interfaces";
import { addRasterOverlayLayer, addRasterTileLayer, addVectorTileLayer } from "../../utils/layers";
import {
  AddLayerAction,
  layerAdded,
  layerError,
  LayersActionTypes,
  removeLayer,
  RemoveLayerAction,
} from "./actions";
import { getActiveLayers, getActiveLayersIds, getAvailableLayers, getLayerById } from "./selectors";

export const addLayerEpic: MapEpic = (action$, state$, { map }) => {
  return action$.pipe(
    filter((action): action is AddLayerAction => action.type === LayersActionTypes.ADD_LAYER),
    withLatestFrom(state$),
    mergeMap(
      ([action, state]): Observable<MapActions> => {
        let { layerId } = action.payload;
        let layer = getLayerById(state, layerId);

        if (!layer) return of(layerError(layerId));

        let { mutexId } = layer;
        let removeActions: ReadonlyArray<RemoveLayerAction> = [];
        if (mutexId) {
          let activeLayersIds = getActiveLayersIds(state).filter(lId => lId !== layerId);
          let sharedMutexLayersIds = getAvailableLayers(state)
            .filter(l => l.mutexId === mutexId)
            .filter(l => l.id !== layerId)
            .map(l => l.id);

          removeActions = intersection(activeLayersIds, sharedMutexLayersIds).map(removeLayer);
        }

        let activeLayerStackingContext = getActiveLayers(state)
          .filter((l): l is LayerDefinition => !!l)
          .map(l => ({
            layerId: l.id,
            zIndex: l.zIndex,
            subLayerIds:
              l.layerType === LayerTypes.WMS_RASTER_OVERLAY
                ? undefined
                : l.layerData.subLayers.map(({ id }) => id),
          }));

        return concat(
          of(...removeActions),
          of(layerAdded(layerId)).pipe(
            tap(() => {
              if (!layer) return;
              switch (layer.layerType) {
                case LayerTypes.WMS_RASTER_OVERLAY:
                  addRasterOverlayLayer(layer, map, activeLayerStackingContext, getUuid(state));
                  break;
                case LayerTypes.RASTER_TILE:
                  addRasterTileLayer(layer, map, activeLayerStackingContext);
                  break;
                case LayerTypes.VECTOR_TILE:
                  addVectorTileLayer(layer, map, activeLayerStackingContext);
                  break;
                default:
                  break;
              }
            }),
          ),
        );
      },
    ),
  );
};
