import { selectUnits } from "@dtn/i18n-lib";
import * as moment from "moment-timezone";
import { of, race } from "rxjs";
import {
  catchError,
  filter,
  flatMap,
  map as mapOperator,
  take,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { AnimationActionTypes, MapEpic, StartAnimationAction } from "../";
import { LayerTypes } from "../../interfaces";
import { toBoundingBox, toDegreesMinutesSeconds } from "../../utils";
import { drawRasterOverlayLayer, getImage } from "../../utils/layers";
import { getIsAnimating, layerAnimates } from "../animation/selectors";
import {
  LayerAddedAction,
  layerError,
  LayerErrorAction,
  LayersActionTypes,
  RemoveLayerAction,
  UpdateLayerAction,
  UpdateLayerCanceledAction,
  updateLayerCancelled,
  updateLayerSuccess,
  UpdateLayerSuccessAction,
} from "./actions";
import { getLayerById } from "./selectors";

export const updateLayerEpic: MapEpic = (action$, state$, { map, api }) => {
  return action$.pipe(
    filter(
      (action): action is UpdateLayerAction | LayerAddedAction =>
        action.type === LayersActionTypes.UPDATE_LAYER ||
        action.type === LayersActionTypes.LAYER_ADDED,
    ),
    withLatestFrom(state$),
    filter(([action, state]) => {
      let { layerId } = action.payload;
      let layer = getLayerById(state, layerId);
      // Cant update a layer that does not exist
      if (!layer) return false;
      // If animating and this layer animates, don't update it
      if (getIsAnimating(state) && layer.animation) return false;
      return true;
    }),
    flatMap(([action, state]) => {
      let { layerId } = action.payload;
      let layer = getLayerById(state, layerId)!;

      switch (layer.layerType) {
        case LayerTypes.VECTOR_TILE:
        case LayerTypes.RASTER_TILE:
          return of(updateLayerSuccess(layerId));
        default:
          break;
      }

      let layers: ReadonlyArray<string>;
      // tslint:disable-next-line
      if (Array.isArray(layer.layerData.layers)) {
        layers = layer.layerData.layers;
      } else {
        // @ts-ignore
        layers = layer.layerData.layers[selectUnits(state)];
      }

      let mapBounds = map.getBounds();
      let { time } = layer;
      let timeParam;
      if (time) {
        timeParam = Array.isArray(time.relative)
          ? [
              moment(new Date().valueOf() + time.relative[0]),
              moment(new Date().valueOf() + time.relative[1]),
            ]
          : moment(new Date().valueOf() + time.relative);
      }
      let updateLayer$ = api
        .fetchWmsLayer(
          layers,
          toDegreesMinutesSeconds(toBoundingBox(mapBounds)),
          {
            height: map.getContainer().offsetHeight,
            width: map.getContainer().offsetWidth,
          },
          timeParam,
        )
        .pipe(
          // Only continue if the map has not moved
          filter(() => mapBounds.toString() === map.getBounds().toString()),
          flatMap(({ layer, validTime }) => {
            let url = URL.createObjectURL(layer);
            return getImage(url).pipe(
              mapOperator(image => ({ image, validTime })),
              tap(() => {
                URL.revokeObjectURL(url);
              }),
            );
          }),
          tap(({ image }) => {
            requestAnimationFrame(() => {
              drawRasterOverlayLayer(layer, image, map);
            });
          }),
        );

      let cancelUpdate$ = action$.pipe(
        filter(
          (action): action is UpdateLayerAction | RemoveLayerAction | StartAnimationAction =>
            action.type === LayersActionTypes.UPDATE_LAYER ||
            action.type === LayersActionTypes.REMOVE_LAYER ||
            action.type === AnimationActionTypes.START_ANIMATION,
        ),
        withLatestFrom(state$),
        filter(([action, state]) => {
          if (action.type === AnimationActionTypes.START_ANIMATION) {
            // Only cancel this on start animation if this layer actually animates
            return Boolean(layerAnimates(state, layerId));
          }
          return action.payload.layerId === layerId;
        }),
      );

      return race<UpdateLayerSuccessAction | UpdateLayerCanceledAction | LayerErrorAction>(
        updateLayer$.pipe(
          mapOperator(({ validTime }) => updateLayerSuccess(layerId, validTime)),
          catchError(() => of(layerError(layerId))),
          take(1),
        ),
        cancelUpdate$.pipe(
          mapOperator(() => updateLayerCancelled(layerId)),
          take(1),
        ),
      );
    }),
  );
};
