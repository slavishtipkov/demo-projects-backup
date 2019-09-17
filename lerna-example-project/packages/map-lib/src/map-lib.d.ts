import { MapboxOptions, LngLatBoundsLike } from "mapbox-gl";

declare module "mapbox-gl" {
  interface MapboxOptions {
    readonly bounds?: LngLatBoundsLike | [[number, number], [number, number]];
  }
}
