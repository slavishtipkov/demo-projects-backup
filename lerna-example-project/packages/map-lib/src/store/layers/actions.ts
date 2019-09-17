import * as moment from "moment-timezone";
import { Action, ActionCreator } from "redux";
import { LayerId } from "../../interfaces";

export type LayersActions =
  | LayerErrorAction
  | AddLayerAction
  | LayerAddedAction
  | RemoveLayerAction
  | LayerRemovedAction
  | UpdateLayerAction
  | UpdateLayerCanceledAction
  | UpdateLayerSuccessAction
  | UpdateAllLayersAction
  | RemoveAllLayersAction
  | GetLegendSuccessAction
  | GetLegendErrorAction
  | ScheduledLayerUpdateCanceledAction
  | GetLegendCancelledAction;

export const enum LayersActionTypes {
  LAYER_ERROR = "LAYER_ERROR",
  ADD_LAYER = "ADD_LAYER",
  LAYER_ADDED = "LAYER_ADDED",
  REMOVE_LAYER = "REMOVE_LAYER",
  LAYER_REMOVED = "LAYER_REMOVED",
  UPDATE_LAYER = "UPDATE_LAYER",
  UPDATE_LAYER_SUCCESS = "UPDATE_LAYER_SUCCESS",
  UPDATE_LAYER_CANCELLED = "UPDATE_LAYER_CANCELLED",
  SCHEDULED_LAYER_UPDATE_CANCELLED = "SCHEDULED_LAYER_UPDATE_CANCELLED",
  UPDATE_ALL_LAYERS = "UPDATE_ALL_LAYERS",
  REMOVE_ALL_LAYERS = "REMOVE_ALL_LAYERS",
  GET_LEGEND_SUCCESS = "GET_LEGEND_SUCCESS",
  GET_LEGEND_ERROR = "GET_LEGEND_ERROR",
  GET_LEGEND_CANCELLED = "GET_LEGEND_CANCELLED",
}

export interface LayerErrorAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.LAYER_ERROR;
  readonly payload: {
    readonly layerId: LayerId;
  };
  readonly error: boolean;
}

export const layerError: ActionCreator<LayerErrorAction> = (layerId: LayerId) => ({
  type: LayersActionTypes.LAYER_ERROR,
  payload: {
    layerId,
  },
  error: true,
});

export interface AddLayerAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.ADD_LAYER;
  readonly payload: {
    readonly layerId: LayerId;
  };
}

export const addLayer: ActionCreator<AddLayerAction> = (layerId: LayerId) => ({
  type: LayersActionTypes.ADD_LAYER,
  payload: {
    layerId,
  },
});

export interface LayerAddedAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.LAYER_ADDED;
  readonly payload: {
    readonly layerId: LayerId;
  };
}

export const layerAdded: ActionCreator<LayerAddedAction> = (layerId: LayerId) => ({
  type: LayersActionTypes.LAYER_ADDED,
  payload: {
    layerId,
  },
});

export interface RemoveLayerAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.REMOVE_LAYER;
  readonly payload: {
    readonly layerId: LayerId;
  };
}

export const removeLayer: ActionCreator<RemoveLayerAction> = (layerId: LayerId) => ({
  type: LayersActionTypes.REMOVE_LAYER,
  payload: {
    layerId,
  },
});

export interface LayerRemovedAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.LAYER_REMOVED;
  readonly payload: {
    readonly layerId: LayerId;
  };
}

export const layerRemoved: ActionCreator<LayerRemovedAction> = (layerId: LayerId) => ({
  type: LayersActionTypes.LAYER_REMOVED,
  payload: {
    layerId,
  },
});

export interface UpdateLayerAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.UPDATE_LAYER;
  readonly payload: {
    readonly layerId: LayerId;
  };
}

export const updateLayer: ActionCreator<UpdateLayerAction> = (layerId: LayerId) => ({
  type: LayersActionTypes.UPDATE_LAYER,
  payload: {
    layerId,
  },
});

export interface UpdateLayerSuccessAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.UPDATE_LAYER_SUCCESS;
  readonly payload: {
    readonly layerId: LayerId;
    readonly lastUpdated: moment.Moment;
  };
}

export const updateLayerSuccess: ActionCreator<UpdateLayerSuccessAction> = (
  layerId: LayerId,
  validTime: moment.Moment,
) => ({
  type: LayersActionTypes.UPDATE_LAYER_SUCCESS,
  payload: {
    layerId,
    lastUpdated: validTime,
  },
});

export interface UpdateAllLayersAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.UPDATE_ALL_LAYERS;
}

export const updateAllLayers: ActionCreator<UpdateAllLayersAction> = () => ({
  type: LayersActionTypes.UPDATE_ALL_LAYERS,
});

export interface UpdateLayerCanceledAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.UPDATE_LAYER_CANCELLED;
  readonly payload: {
    readonly layerId: LayerId;
  };
}

export const updateLayerCancelled: ActionCreator<UpdateLayerCanceledAction> = (
  layerId: LayerId,
) => ({
  type: LayersActionTypes.UPDATE_LAYER_CANCELLED,
  payload: {
    layerId,
  },
});

export interface ScheduledLayerUpdateCanceledAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.SCHEDULED_LAYER_UPDATE_CANCELLED;
  readonly payload: {
    readonly layerId: LayerId;
  };
}

export const scheduledLayerUpdateCancelled: ActionCreator<ScheduledLayerUpdateCanceledAction> = (
  layerId: LayerId,
) => ({
  type: LayersActionTypes.SCHEDULED_LAYER_UPDATE_CANCELLED,
  payload: {
    layerId,
  },
});

export interface RemoveAllLayersAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.REMOVE_ALL_LAYERS;
}

export const removeAllLayers: ActionCreator<RemoveAllLayersAction> = () => ({
  type: LayersActionTypes.REMOVE_ALL_LAYERS,
});

export interface GetLegendSuccessAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.GET_LEGEND_SUCCESS;
  readonly payload: {
    readonly layerId: LayerId;
    readonly urls: ReadonlyArray<string>;
  };
}

export const getLegendSuccess: ActionCreator<GetLegendSuccessAction> = (
  layerId: LayerId,
  urls: ReadonlyArray<string>,
) => ({
  type: LayersActionTypes.GET_LEGEND_SUCCESS,
  payload: {
    layerId,
    urls,
  },
});

export interface GetLegendCancelledAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.GET_LEGEND_CANCELLED;
  readonly payload: {
    readonly layerId: LayerId;
  };
}

export const getLegendCancelled: ActionCreator<GetLegendCancelledAction> = (layerId: LayerId) => ({
  type: LayersActionTypes.GET_LEGEND_CANCELLED,
  payload: {
    layerId,
  },
});

export interface GetLegendErrorAction extends Action<LayersActionTypes> {
  readonly type: LayersActionTypes.GET_LEGEND_ERROR;
  readonly payload: {
    readonly layerId: LayerId;
    readonly message: string;
  };
  readonly error: boolean;
}

export const getLegendError: ActionCreator<GetLegendErrorAction> = (
  layerId: LayerId,
  message: string,
) => ({
  type: LayersActionTypes.GET_LEGEND_ERROR,
  payload: {
    layerId,
    message,
  },
  error: true,
});
