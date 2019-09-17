import * as mapboxgl from "mapbox-gl";
import { getTimestamp } from "../..";
import { LayerId, RasterTileLayer } from "../../../interfaces";

export const RASTER_TILE_LAYER_DEFAULTS: Partial<mapboxgl.Layer> = {
  type: "raster",
  paint: {
    "raster-opacity": 1,
    "raster-fade-duration": 0,
    "raster-opacity-transition": {
      duration: 0,
    },
  },
};

export const addLayer = (
  layer: RasterTileLayer,
  map: mapboxgl.Map,
  activeLayersStackingContext: ReadonlyArray<{
    readonly layerId: LayerId;
    readonly zIndex: number;
    readonly subLayerIds?: ReadonlyArray<string>;
  }>,
): void => {
  let sourceId = layer.layerData.source.id;

  if (!map.getSource(sourceId)) {
    let timestamp = getTimestamp(layer.refreshInterval!)
      .tz("GMT")
      .format("YYYY-MM-DDTHH:mm:ss");

    let baseUrl = layer.layerData.source.url;
    let url = `${baseUrl}${layer.layerData.source.id}/${timestamp}/{z}/{x}/{y}.png`;

    map.addSource(sourceId, {
      type: "raster",
      scheme: "xyz",
      tileSize: 256,
      bounds: [-180, -85, 180, 85],
      tiles: [url],
    });
  }

  function addSubLayer(subLayer: mapboxgl.Layer): void {
    if (!map.getLayer(subLayer.id)) {
      // tslint:disable-next-line
      let sortedLayerStackingContext = [...activeLayersStackingContext].sort(
        (a, b) => a.zIndex - b.zIndex,
      );

      // If this is the firsrt layer to be added,
      // or it is the highest known index, take a
      // fast path
      if (
        sortedLayerStackingContext.length === 1 ||
        layer.zIndex >= sortedLayerStackingContext[sortedLayerStackingContext.length - 1].zIndex
      ) {
        map.addLayer({
          ...RASTER_TILE_LAYER_DEFAULTS,
          source: sourceId,
          ...subLayer,
          paint: {
            ...RASTER_TILE_LAYER_DEFAULTS.paint,
            "raster-opacity": layer.opacity,
          },
        });
        return;
      }

      for (let i = 0; i < sortedLayerStackingContext.length; i++) {
        if (sortedLayerStackingContext[i].zIndex > layer.zIndex) {
          let before = sortedLayerStackingContext[i].subLayerIds
            ? sortedLayerStackingContext[i].subLayerIds![0]
            : sortedLayerStackingContext[i].layerId;
          map.addLayer(
            {
              ...RASTER_TILE_LAYER_DEFAULTS,
              source: sourceId,
              ...subLayer,
              paint: {
                ...RASTER_TILE_LAYER_DEFAULTS.paint,
                "raster-opacity": layer.opacity,
              },
            },
            before,
          );
          break;
        }
      }
    }
  }

  layer.layerData.subLayers.forEach(addSubLayer);
};
