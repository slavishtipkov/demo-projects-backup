import * as mapboxgl from "mapbox-gl";
import { getCanvasCoordinates } from ".";
import { LayerDefinition, LayerId } from "../../../interfaces";

export const addLayer = (
  layer: LayerDefinition,
  map: mapboxgl.Map,
  activeLayersStackingContext: ReadonlyArray<{
    readonly layerId: LayerId;
    readonly zIndex: number;
    readonly subLayerIds?: ReadonlyArray<string>;
  }>,
  uuid: string,
): void => {
  // If the map already has a layer with this id do nothing.
  if (Boolean(map.getLayer(layer.id))) {
    return;
  }

  // Create a corresponding canvas element for each raster overlay
  let canvas = document.createElement("canvas");
  canvas.id = layer.id + uuid;
  canvas.style.display = "none";
  document.body.appendChild(canvas);

  let rasterLayer = {
    id: layer.id,
    type: "raster",
    paint: {
      "raster-opacity": layer.opacity,
      "raster-fade-duration": 0,
      "raster-opacity-transition": {
        duration: 0,
      },
    },
    source: {
      type: "canvas",
      canvas: canvas.id,
      animate: true,
      coordinates: getCanvasCoordinates(map),
    },
  };

  // tslint:disable-next-line
  let sortedLayerStackingContext = [...activeLayersStackingContext].sort(
    (a, b) => a.zIndex - b.zIndex,
  );

  // If this is the firsrt layer to be added, or it is the highest known index, take a fast path
  if (
    sortedLayerStackingContext.length === 1 ||
    layer.zIndex >= sortedLayerStackingContext[sortedLayerStackingContext.length - 1].zIndex
  ) {
    // @ts-ignore 'type': 'canvas' needs to be added to mapboxgl layer types
    map.addLayer(rasterLayer);
    return;
  }

  for (let i = 0; i < sortedLayerStackingContext.length; i++) {
    if (sortedLayerStackingContext[i].zIndex > layer.zIndex) {
      let before = sortedLayerStackingContext[i].subLayerIds
        ? sortedLayerStackingContext[i].subLayerIds![0]
        : sortedLayerStackingContext[i].layerId;
      // @ts-ignore 'type': 'canvas' needs to be added to mapboxgl layer types
      map.addLayer(rasterLayer, before);
      break;
    }
  }
};
