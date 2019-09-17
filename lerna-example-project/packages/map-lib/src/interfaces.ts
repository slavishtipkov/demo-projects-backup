import { Units } from "@dtn/i18n-lib";
import * as mapboxgl from "mapbox-gl";
import * as moment from "moment-timezone";

export type LayerId = string;

export interface MapDimensions {
  readonly height: number;
  readonly width: number;
}

export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface BoundingBox {
  readonly northEast: Coordinates;
  readonly southWest: Coordinates;
}

export type Location = BoundingBox | (Coordinates & { readonly zoom?: number });

export interface MapDimensions {
  readonly height: number;
  readonly width: number;
}

export interface Camera {
  readonly pitch: number;
  readonly bearing: number;
  readonly center: Coordinates;
  readonly boundingBox: BoundingBox;
  readonly zoom?: number;
}

export const enum LayerTypes {
  WMS_RASTER_OVERLAY = "WMS_RASTER_OVERLAY",
  RASTER_TILE = "RASTER_TILE",
  VECTOR_TILE = "VECTOR_TILE",
}

export interface LayerMetaData {
  readonly id: string;
  readonly displayLabel: string;
  readonly category: string;
  readonly subCategory: string;
  readonly zIndex: number;
  readonly mutexId?: string;
  readonly icon: string;
  readonly refreshInterval?: number;
  readonly opacity: number;
  readonly animation?: AnimationDescriptor;
  readonly time?: {
    readonly relative: [number, number] | number;
  };
}

export interface WmsRasterOverlayLayer extends LayerMetaData {
  readonly layerType: LayerTypes.WMS_RASTER_OVERLAY;
  readonly layerData: {
    readonly layers: { readonly [k in Units]: ReadonlyArray<string> } | ReadonlyArray<string>;
    readonly legends: { readonly [k in Units]: ReadonlyArray<string> } | ReadonlyArray<string>;
  };
}

export interface RasterTileLayer extends LayerMetaData {
  readonly layerType: LayerTypes.RASTER_TILE;
  readonly layerData: {
    readonly source: mapboxgl.RasterSource & { readonly id: string; readonly url: string };
    readonly subLayers: ReadonlyArray<mapboxgl.Layer>;
  };
}

export interface VectorTileLayer extends LayerMetaData {
  readonly layerType: LayerTypes.VECTOR_TILE;
  readonly layerData: {
    readonly source: mapboxgl.VectorSource & { readonly id: string };
    readonly subLayers: ReadonlyArray<mapboxgl.Layer>;
  };
}

export type LayerDefinition = WmsRasterOverlayLayer | RasterTileLayer | VectorTileLayer;

export interface AnimationDescriptor {
  readonly interval: number;
  readonly past: number;
  readonly future: number;
}

export const enum MapStylePalette {
  LIGHT = "light",
  MEDIUM = "medium",
  DARK = "dark",
}

export interface StyleDefinition {
  readonly id: string;
  readonly displayLabel: string;
  readonly url: string;
  readonly palette: MapStylePalette;
}

export interface CameraRestrictions {
  readonly boundingBox?: BoundingBox;
  readonly pitchAndRotate?: boolean;
}

export interface MapDefinition {
  readonly cameraRestrictions?: CameraRestrictions;
  readonly layers: ReadonlyArray<LayerDefinition>;
  readonly styles: ReadonlyArray<StyleDefinition>;
  readonly presets: ReadonlyArray<Preset>;
}

export interface ActiveLayerDescriptor {
  readonly layerId: LayerId;
  readonly legendUrls?: ReadonlyArray<string>;
  readonly lastUpdated?: moment.Moment;
}

export interface Preset {
  readonly name: string;
  readonly layers: ReadonlyArray<string>;
}

export interface Callbacks {
  readonly onLayerAdded?: (layerId: LayerId) => void;
  readonly onLayerRemoved?: (layerId: LayerId) => void;
  readonly onAnimationStart?: () => void;
  readonly onAnimationStop?: () => void;
  readonly onMapMove?: (camera: Camera) => void;
  readonly onMapPress?: (coordinates: Coordinates) => void;
}
