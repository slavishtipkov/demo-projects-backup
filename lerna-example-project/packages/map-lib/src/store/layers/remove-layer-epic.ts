import { of } from "rxjs";
import { filter, map as mapOperator, tap, withLatestFrom } from "rxjs/operators";
import { MapEpic } from "../";
import { LayerTypes } from "../../interfaces";
import {
  removeRasterOverlayLayer,
  removeRasterTileLayer,
  removeVectorTileLayer,
} from "../../utils/layers";
import { layerError, layerRemoved, LayersActionTypes, RemoveLayerAction } from "./actions";
import { getLayerById } from "./selectors";

export const removeLayerEpic: MapEpic = (action$, state$, { map }) => {
  return action$.pipe(
    filter((action): action is RemoveLayerAction => action.type === LayersActionTypes.REMOVE_LAYER),
    withLatestFrom(state$),
    tap(([action, state]) => {
      let { layerId } = action.payload;
      let layer = getLayerById(state, layerId);

      if (!layer) return of(layerError(layerId));

      switch (layer.layerType) {
        case LayerTypes.RASTER_TILE:
          removeRasterTileLayer(layer, map);
          break;
        case LayerTypes.VECTOR_TILE:
          removeVectorTileLayer(layer, map);
          break;
        default:
        case LayerTypes.WMS_RASTER_OVERLAY:
          removeRasterOverlayLayer(layer, map);
          break;
      }
    }),
    mapOperator(([action, state]) => layerRemoved(action.payload.layerId)),
  );
};
