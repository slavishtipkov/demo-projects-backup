import * as mapboxgl from "mapbox-gl";
export { addLayer as addRasterOverlayLayer } from "./add-layer";
export { drawLayer as drawRasterOverlayLayer } from "./draw-layer";
export { getImage } from "./get-layer";
export { removeLayer as removeRasterOverlayLayer } from "./remove-layer";

export function getCanvasCoordinates(map: mapboxgl.Map): ReadonlyArray<ReadonlyArray<number>> {
  let bounds = map.getBounds();
  return [
    bounds.getNorthWest().toArray(),
    bounds.getNorthEast().toArray(),
    bounds.getSouthEast().toArray(),
    bounds.getSouthWest().toArray(),
  ];
}
