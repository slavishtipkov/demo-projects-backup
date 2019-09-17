import * as mapboxgl from "mapbox-gl";
import { getCanvasCoordinates } from ".";
import { LayerDefinition } from "../../../interfaces";

export const drawLayer = (
  layer: LayerDefinition,
  image: HTMLImageElement,
  map: mapboxgl.Map,
): void => {
  // @ts-ignore CanvasSource needs to be added as a return type to map.getSource
  let source = map.getSource(layer.id) as CanvasSource;

  if (source == null) return;

  let canvas = source.getCanvas();
  let { offsetWidth, offsetHeight } = map.getContainer();
  canvas.width = offsetWidth;
  canvas.height = offsetHeight;
  let context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  source.setCoordinates(getCanvasCoordinates(map));
};
