import * as mapboxgl from "mapbox-gl";
import { LayerId, VectorTileLayer } from "../../../interfaces";

export const addLayer = (
  layer: VectorTileLayer,
  map: mapboxgl.Map,
  activeLayersStackingContext: ReadonlyArray<{
    readonly layerId: LayerId;
    readonly zIndex: number;
    readonly subLayerIds?: ReadonlyArray<string>;
  }>,
): void => {
  let { id: sourceId, type, url } = layer.layerData.source;
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, { type, url });
  }

  function addSubLayer(subLayer: mapboxgl.Layer): void {
    if (!!map.getLayer(subLayer.id)) {
      return;
    }

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
        source: sourceId,
        ...subLayer,
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
            source: sourceId,
            ...subLayer,
          },
          before,
        );
        break;
      }
    }
  }

  layer.layerData.subLayers.forEach(addSubLayer);
};
