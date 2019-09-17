import { fromEvent, animationFrameScheduler } from "rxjs";
import { debounceTime, throttleTime } from "rxjs/operators";
import { SECOND } from "../constants";
import { BoundingBox, Coordinates } from "../interfaces";
import { toBoundingBox, toCoordinates } from "../utils";

export interface CameraCallback {
  readonly boundingBox: BoundingBox;
  readonly pitch: number;
  readonly bearing: number;
  readonly center: Coordinates;
  readonly zoom: number;
}

export interface PointerCallback {
  readonly coordinates: Coordinates;
}

export interface ConnectedEventHandlers {
  readonly onMove?: (camera: CameraCallback) => void;
  readonly onMoveEnd?: (camera: CameraCallback) => void;
  readonly onMoveDwell?: (camera: CameraCallback) => void;
  readonly onPointerMove?: (pointer: PointerCallback) => void;
  readonly onPointerMoveDwell?: (pointer: PointerCallback) => void;
  readonly onPointerPress?: (pointer: PointerCallback) => void;
}

export default class {
  constructor(private readonly map: mapboxgl.Map) {}

  connect(handlers: ConnectedEventHandlers): void {
    let { map } = this;

    const toCameraCallback = (): CameraCallback => ({
      pitch: map.getPitch(),
      bearing: map.getBearing(),
      center: toCoordinates(map.getCenter()),
      zoom: map.getZoom(),
      boundingBox: toBoundingBox(map.getBounds()),
    });

    const toPointerCallback = (
      event: mapboxgl.MapMouseEvent | mapboxgl.MapTouchEvent,
    ): PointerCallback => ({
      coordinates: toCoordinates(event.lngLat),
    });

    let mapMove$ = fromEvent(map, "move");
    let mapMoveEnd$ = fromEvent(map, "moveend");
    let pointerMove$ = fromEvent<mapboxgl.MapMouseEvent | mapboxgl.MapTouchEvent>(map, "mousemove");
    let pointerPresse$ = fromEvent<mapboxgl.MapMouseEvent | mapboxgl.MapTouchEvent>(map, "click");

    let { onMove } = handlers;
    if (typeof onMove === "function") {
      mapMove$.pipe(throttleTime(SECOND / 60, animationFrameScheduler)).subscribe(event => {
        onMove!(toCameraCallback());
      });
    }

    let { onMoveEnd } = handlers;
    if (typeof onMoveEnd === "function") {
      mapMoveEnd$.pipe(throttleTime(SECOND / 60, animationFrameScheduler)).subscribe(event => {
        onMoveEnd!(toCameraCallback());
      });
    }

    let { onMoveDwell } = handlers;
    if (typeof onMoveDwell === "function") {
      mapMove$.pipe(debounceTime(SECOND, animationFrameScheduler)).subscribe(event => {
        onMoveDwell!(toCameraCallback());
      });
    }

    let { onPointerMove } = handlers;
    if (typeof onPointerMove === "function") {
      pointerMove$
        .pipe(throttleTime(SECOND / 60, animationFrameScheduler))
        .subscribe((event: mapboxgl.MapMouseEvent | mapboxgl.MapTouchEvent) => {
          onPointerMove!(toPointerCallback(event));
        });
    }

    let { onPointerMoveDwell } = handlers;
    if (typeof onPointerMoveDwell === "function") {
      pointerMove$.pipe(debounceTime(SECOND, animationFrameScheduler)).subscribe(event => {
        onPointerMoveDwell!(toPointerCallback(event));
      });
    }

    let { onPointerPress } = handlers;
    if (typeof onPointerPress === "function") {
      pointerPresse$
        .pipe(debounceTime(0, animationFrameScheduler))
        .subscribe((event: mapboxgl.MapMouseEvent | mapboxgl.MapTouchEvent) => {
          onPointerPress!(toPointerCallback(event));
        });
    }
  }
}
