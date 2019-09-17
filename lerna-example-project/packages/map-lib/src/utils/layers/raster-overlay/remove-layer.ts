import * as mapboxgl from "mapbox-gl";
import { LayerDefinition } from "../../../interfaces";

export function removeLayer(layer: LayerDefinition, map: mapboxgl.Map): void {
  // If the map does not have a layer with this id do nothing.
  if (!map.getLayer(layer.id)) return;

  // @ts-ignore
  let canvas = map.getSource(layer.id).getCanvas();
  canvas.parentNode.removeChild(canvas);

  map.removeLayer(layer.id);
  map.removeSource(layer.id);

  return;
}
