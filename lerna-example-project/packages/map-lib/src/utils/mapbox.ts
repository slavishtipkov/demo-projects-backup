import * as mapboxgl from "mapbox-gl";
import { BoundingBox, Coordinates } from "../interfaces";

export const toCoordinates = (lngLat: mapboxgl.LngLat): Coordinates => ({
  latitude: lngLat.lat,
  longitude: lngLat.lng,
});

export const toBoundingBox = (lngLatBounds: mapboxgl.LngLatBounds): BoundingBox => ({
  northEast: toCoordinates(lngLatBounds.getNorthEast()),
  southWest: toCoordinates(lngLatBounds.getSouthWest()),
});

export const areBoundingBoxesEqual = (a?: BoundingBox, b?: BoundingBox): boolean => {
  if (!a || !b) return false;
  return (
    a.northEast.latitude === b.northEast.latitude &&
    a.northEast.longitude === b.northEast.longitude &&
    a.southWest.latitude === b.southWest.latitude &&
    a.southWest.longitude === b.southWest.longitude
  );
};

export function toDegreesMinutesSeconds({
  southWest,
  northEast,
}: BoundingBox): ReadonlyArray<ReadonlyArray<number>> {
  let swLat = southWest.latitude;
  let swLon = southWest.longitude;
  let neLat = northEast.latitude;
  let neLon = northEast.longitude;

  if (swLon > neLon) {
    neLon = neLon + 360;
  }

  const latLonToMercator = (lat: number, lon: number) => {
    let rMajor = 6378137; // Equatorial Radius
    let shift = Math.PI * rMajor;
    let x = (lon * shift) / 180;
    let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
    y = (y * shift) / 180;
    return { x, y };
  };

  let swXY = latLonToMercator(swLat, swLon);
  let neXY = latLonToMercator(neLat, neLon);
  return [[swXY.x, swXY.y], [neXY.x, neXY.y]];
}

export type InitialCamera =
  | { readonly center: [number, number]; readonly zoom: number }
  | { readonly bounds: [[number, number], [number, number]] };

export const createMap = (
  container: HTMLElement,
  styleUrl: string,
  initialCamera: InitialCamera,
  maxBounds?: mapboxgl.LngLatBoundsLike | [[number, number], [number, number]],
  restrictPitchAndRotate = true,
  interactive = true,
): mapboxgl.Map => {
  // @ts-ignore Must use window. here account for webpack external loading of the mapboxgl library
  let map = new window.mapboxgl.Map({
    container,
    style: styleUrl,
    maxBounds,
    renderWorldCopies: true,
    dragRotate: !restrictPitchAndRotate,
    pitchWithRotate: !restrictPitchAndRotate,
    interactive,
    preserveDrawingBuffer: false,
    ...initialCamera,
  });
  // Couldnt find a way to disable this via the Map constructor options.
  if (restrictPitchAndRotate) {
    map.touchZoomRotate.disableRotation();
  }

  return map;
};
