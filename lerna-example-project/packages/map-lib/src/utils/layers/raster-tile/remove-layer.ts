import * as mapboxgl from "mapbox-gl";
import { LayerTypes, RasterTileLayer } from "../../../interfaces";

export let removeLayer = (
  layer: RasterTileLayer,
  map: mapboxgl.Map,
  activeLayers?: ReadonlyArray<RasterTileLayer>,
): void => {
  // Remove all sub layers associated with this source before removing the source itself
  let subLayers = layer.layerData.subLayers;
  subLayers.forEach(({ id }) => {
    if (!!map.getLayer(id)) {
      map.removeLayer(id);
    }
  });

  let { id: sourceId } = layer.layerData.source;
  if (!!map.getSource(sourceId)) {
    if (activeLayers && activeLayers.length === 1) {
      let otherLayersWithMatchingSourceId = activeLayers.filter(l => {
        return (
          layer &&
          layer.layerType === LayerTypes.RASTER_TILE &&
          layer.layerData.source.id === sourceId
        );
      });
      if (otherLayersWithMatchingSourceId.length === 0) {
        map.removeSource(sourceId);
      }
    } else {
      map.removeSource(sourceId);
    }
  }
};
