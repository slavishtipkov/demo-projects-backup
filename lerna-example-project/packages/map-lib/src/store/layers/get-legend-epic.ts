import { selectUnits } from "@dtn/i18n-lib";
import { empty, forkJoin, of, race } from "rxjs";
import { catchError, filter, flatMap, map, take, withLatestFrom } from "rxjs/operators";
import { MapEpic } from "../";
import { LayerTypes } from "../../interfaces";
import {
  getLegendCancelled,
  GetLegendCancelledAction,
  getLegendError,
  GetLegendErrorAction,
  getLegendSuccess,
  GetLegendSuccessAction,
  LayerAddedAction,
  layerError,
  LayerErrorAction,
  LayersActionTypes,
  RemoveLayerAction,
  UpdateLayerAction,
} from "./actions";
import { getLayerById } from "./selectors";

export const getLegendEpic: MapEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter((action): action is LayerAddedAction => action.type === LayersActionTypes.LAYER_ADDED),
    withLatestFrom(state$),
    filter(([action, state]) => {
      let { layerId } = action.payload;
      let layer = getLayerById(state, layerId);
      if (!layer) return false;
      return true;
    }),
    flatMap(([action, state]) => {
      let { layerId } = action.payload;
      let layer = getLayerById(state, layerId);

      if (!layer) return of(layerError(layerId));

      switch (layer.layerType) {
        case LayerTypes.RASTER_TILE:
        case LayerTypes.VECTOR_TILE:
          return empty();
        default:
          break;
      }

      let legends: ReadonlyArray<string>;
      // tslint:disable-next-line
      if (Array.isArray(layer.layerData.legends)) {
        legends = layer.layerData.legends;
      } else {
        // @ts-ignore
        legends = layer.layerData.legends[selectUnits(state)];
      }

      let getLegend$ = legends.map(api.fetchWmsLegend);

      let cancelUpdate$ = action$.pipe(
        filter(
          (action): action is UpdateLayerAction | RemoveLayerAction =>
            action.type === LayersActionTypes.UPDATE_LAYER ||
            action.type === LayersActionTypes.REMOVE_LAYER,
        ),
        filter(action => action.payload.layerId === layerId),
      );

      return race<
        GetLegendSuccessAction | GetLegendErrorAction | GetLegendCancelledAction | LayerErrorAction
      >(
        forkJoin(getLegend$).pipe(
          flatMap(res => {
            let urls = res.map(b => URL.createObjectURL(b.legend));
            return of(getLegendSuccess(layerId, urls));
          }),
          catchError(message => of(getLegendError(layerId, message))),
          take(1),
        ),
        cancelUpdate$.pipe(
          map(() => getLegendCancelled(layerId)),
          take(1),
        ),
      );
    }),
  );
};
