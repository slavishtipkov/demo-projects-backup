import { intersection, uniqBy } from "lodash-es";
import * as moment from "moment-timezone";
import { concat, forkJoin, Observable, of, Subscription } from "rxjs";
import { bufferCount, mergeMap, take, tap } from "rxjs/operators";
import {
  AnimationDescriptor,
  BoundingBox,
  LayerDefinition,
  LayerId,
  MapDimensions,
  WmsRasterOverlayLayer,
} from "../interfaces";
import { Api } from "../services";
import {
  areBoundingBoxesEqual,
  createAnimationTimeline,
  Timeline,
  toDegreesMinutesSeconds,
} from "../utils";
import { getImage } from "../utils/layers";
import { drawLayer } from "../utils/layers/raster-overlay/draw-layer";

export type AnimationTimecode = number;

export interface PartialAnimationFrame {
  readonly layerId: LayerId;
  readonly image: HTMLImageElement;
}

export type AnimationFrame = ReadonlyArray<PartialAnimationFrame>;

export class Cache {
  private cache: Map<number, AnimationFrame> = new Map();

  has(timecode: AnimationTimecode): boolean {
    return this.cache.has(timecode);
  }

  get(timecode: AnimationTimecode): AnimationFrame | undefined {
    return this.cache.get(timecode);
  }

  add({
    layerId,
    image,
    timecode,
  }: {
    readonly layerId: LayerId;
    readonly image: HTMLImageElement;
    readonly timecode: AnimationTimecode;
  }): void {
    let prev = this.get(timecode);
    let next =
      Array.isArray(prev) && prev.length > 0
        ? uniqBy([{ layerId, image }, ...prev], "layerId")
        : [{ layerId, image }];
    this.cache.set(timecode.valueOf(), next);
  }

  dropLayer(layerId: LayerId): void {
    let { cache } = this;
    let nextCache: typeof cache = new Map();
    this.cache.forEach((v, k) => {
      nextCache.set(k, v.filter(l => l.layerId !== layerId));
    });
    this.cache = nextCache;
  }

  empty(): void {
    this.cache.clear();
  }
}

export class Animator {
  cache: Cache = new Cache();

  timeline?: Timeline;
  boundingBox?: BoundingBox;
  mapDimensions?: MapDimensions;
  backgroundLoad?: Subscription;

  get timecodes(): ReadonlyArray<AnimationTimecode> {
    if (!this.timeline) {
      return [];
    }
    return Object.keys(this.timeline)
      .map(Number)
      .sort() // tslint:disable-line
      .map(t => new Date(t).valueOf());
  }

  constructor(
    private readonly api: Api,
    private readonly layers: ReadonlyArray<LayerDefinition>,
    private readonly map: mapboxgl.Map,
  ) {}

  setNewAnimationData(
    animationData: ReadonlyArray<{ readonly layerId: LayerId } & AnimationDescriptor>,
    boundingBox: BoundingBox,
    mapDimensions: MapDimensions,
    useSharedTimeline = false,
  ): void {
    if (!areBoundingBoxesEqual(boundingBox, this.boundingBox)) {
      this.mapDimensions = mapDimensions;
      this.boundingBox = boundingBox;
      this.cache.empty();
    }

    this.timeline = createAnimationTimeline(animationData, useSharedTimeline);
  }

  drawFrame(timecode: AnimationTimecode): boolean {
    let { cache, layers, map } = this;

    if (!layers) return false;
    if (!cache.has(timecode)) {
      return false;
    }

    let cachedLayers = cache.get(timecode)!;
    requestAnimationFrame(() => {
      cachedLayers.forEach(({ layerId, image }) => {
        drawLayer(layers.find(({ id }) => layerId === id)!, image, map);
      });
    });

    return true;
  }

  loadFrom(startAt: AnimationTimecode, loopBack = false): void {
    if (this.backgroundLoad) {
      this.backgroundLoad.unsubscribe();
    }
    let priorityFrame$ = this.loadFrames(startAt, Infinity);
    if (!loopBack) {
      this.backgroundLoad = priorityFrame$.subscribe();
    } else {
      let indexOfStart = this.timecodes.indexOf(startAt);
      let loopBackFrame$ = this.loadFrames(this.timecodes[0], indexOfStart + 1);
      this.backgroundLoad = concat(priorityFrame$, loopBackFrame$).subscribe();
    }
  }

  loadFrames(
    startAt: AnimationTimecode,
    count = 2,
  ): Observable<ReadonlyArray<ReadonlyArray<HTMLImageElement>>> {
    let { timeline } = this;
    if (!timeline) throw new Error("There is no timeline");

    let framesToLoad = this.timecodes.slice(this.timecodes.indexOf(startAt), count);
    let loadingFrame = framesToLoad.map(this.loadFrame);
    return concat(...loadingFrame).pipe(bufferCount(count));
  }

  loadFrame = (timecode: AnimationTimecode): Observable<ReadonlyArray<HTMLImageElement>> => {
    let { timeline } = this;
    if (!timeline) throw new Error("There is no timeline");
    let frame = timeline[timecode];
    if (!frame) throw new Error("There is no matching frame");
    return forkJoin(...frame.map(layerId => this.loadFramePartial(timecode, layerId)));
  };

  isFrameFullyCached(frame: AnimationTimecode): boolean {
    let { cache, timeline } = this;
    if (!timeline) return false;
    let cachedFrames = cache.get(frame);
    if (!cachedFrames) return false;
    let expectedLayers = timeline[frame];
    if (!expectedLayers) return false;
    return (
      intersection(expectedLayers, cachedFrames.map(({ layerId }) => layerId)).length ===
      expectedLayers.length
    );
  }

  private loadFramePartial(
    timecode: AnimationTimecode,
    layerId: LayerId,
  ): Observable<HTMLImageElement> {
    let { api, boundingBox, mapDimensions, layers, cache } = this;
    if (!api || !boundingBox || !mapDimensions) {
      throw new Error("There is not enough data to fetch layer");
    }

    if (cache.has(timecode)) {
      let cached = cache.get(timecode)!;
      let layerInCache = cached.find(({ layerId: id }) => id === layerId);
      if (layerInCache) {
        return of(layerInCache.image);
      }
    }

    let layer = layers.find(({ id }) => id === layerId) as WmsRasterOverlayLayer;
    let { layerData } = layer;
    return api
      .fetchWmsLayer(
        // @ts-ignore
        Array.isArray(layerData.layers) ? layerData.layers : layerData.layers[api.units],
        toDegreesMinutesSeconds(boundingBox),
        mapDimensions,
        moment(timecode),
      )
      .pipe(
        mergeMap(res => {
          let url = URL.createObjectURL(res.layer);
          return getImage(url).pipe(
            tap(() => {
              URL.revokeObjectURL(url);
            }),
          );
        }),
        tap(image => {
          cache.add({ layerId, image, timecode });
        }),
        take(1),
      );
  }
}
