import { MapboxAccessTokenResponse } from "@dtn/api-lib";
import { renderWidget, WidgetFactory } from "@dtn/browser-render-lib";
import {
  Clock,
  initialState as i18nInitialState,
  Locales,
  reducer as i18nReducer,
  Units,
} from "@dtn/i18n-lib";
import {
  addLayer,
  addLayerEpic,
  animationClockEpic,
  animationLoaderEpic,
  animationManagerEpic,
  Animator,
  Api,
  applyPresetEpic,
  BoundingBox,
  callbacksEpic,
  Camera,
  cameraInitialState,
  changeMapStyleEpic,
  ConnectMapEvents,
  Coordinates,
  createMap,
  doAnimationEpic,
  getLegendEpic,
  InitialCamera,
  LayerId,
  layersInitialState,
  Location,
  MapActions,
  MapDefinition,
  MapEpic,
  mapStyleInitialState,
  moveCamera,
  moveCameraEpic,
  NamespacedState,
  reducer,
  removeAllLayersEpic,
  removeLayer,
  removeLayerEpic,
  startAnimation,
  stopAnimation,
  syncCamera,
  updateAllLayers,
  updateAllLayersEpic,
  updateLayerEpic,
  updateLayerSchedulerEpic,
  userInterfaceInitialState,
  zoomCameraEpic,
} from "@dtn/map-lib";
import * as mapboxgl from "mapbox-gl";
import * as React from "react";
import { ReducersMapObject } from "redux";
import { forkJoin, fromEvent } from "rxjs";
import { take } from "rxjs/operators";
import { UiTheme } from "../interfaces";
import { MapWidget } from "../ui";
import { guid, sideloadMapboxgl, getDevice } from "../utils";
import { layers, presets } from "../layers";

export interface WidgetConfig {
  readonly interactive?: boolean;
  readonly defaultLayers?: string | ReadonlyArray<string>;
  readonly defaultLocation: Location;
  readonly baseMap?: string;
  readonly callbacks?: Callbacks;
}

export interface Callbacks {
  readonly onLayerAdded?: (layerId: LayerId) => void;
  readonly onLayerRemoved?: (layerId: LayerId) => void;
  readonly onAnimationStart?: () => void;
  readonly onAnimationStop?: () => void;
  readonly onMapMove?: (camera: Camera) => void;
  readonly onMapPress?: (coordinates: Coordinates) => void;
}

export interface PublicApi {
  readonly addLayer: (layerId: LayerId) => void;
  readonly removeLayer: (layerId: LayerId) => void;
  readonly startAnimation: () => void;
  readonly stopAnimation: () => void;
  readonly setLocation: (location: Location, animate: boolean) => void;
}

export interface ThemeProp {
  readonly ui: UiTheme;
}

export type CreateInteractiveMapWidget = WidgetFactory<WidgetConfig, ThemeProp, Promise<PublicApi>>;

export const createInteractiveMapWidget: CreateInteractiveMapWidget = async ({
  container,
  apiKey,
  baseUrl = "https://api.dtn.com",
  defaultLayers,
  interactive = true,
  defaultLocation = { longitude: -93.2563945, latitude: 44.7972212, zoom: 12 },
  callbacks = {},
  baseMap = "STREETS",
  units = Units.IMPERIAL,
  locale = Locales.ENGLISH,
  clock = Clock.TWELVE_HOUR,
}) => {
  let containerElement =
    container instanceof Element ? container : document.querySelector(container);
  if (containerElement === null) {
    throw new Error("No container found");
  }

  (containerElement as HTMLElement).style.position = "relative";
  (containerElement as HTMLElement).style.overflow = "hidden";

  let uiContainer = document.createElement("div");
  containerElement.appendChild(uiContainer);
  let mapContainer = document.createElement("div");
  containerElement.appendChild(mapContainer);
  mapContainer.style.width = "100%";
  mapContainer.style.height = "100%";
  mapContainer.style.minWidth = "320px";
  mapContainer.style.minHeight = "320px";

  let api = new Api({
    token: apiKey,
    baseUrl,
    units,
    locale,
  });

  return new Promise<PublicApi>(resolve => {
    forkJoin(sideloadMapboxgl(), api.fetchMapDefinition(), api.fetchMapboxAccessToken()).subscribe(
      ([_, mapDefinition, [{ accessToken }]]: [void, MapDefinition, MapboxAccessTokenResponse]) => {
        api
          .logMapLoad(undefined, undefined, undefined, getDevice(), window.location.hostname)
          .subscribe();

        // @ts-ignore  accessToken is set to readonly
        window.mapboxgl.accessToken = accessToken;

        let mapStyle = mapDefinition.styles.find(
          s => baseMap.toLowerCase() === s.id.toLowerCase(),
        )!;

        let isBoundingBox = (location: Location): location is BoundingBox =>
          "southWest" in location && "northEast" in location;

        let initialCamera: InitialCamera = isBoundingBox(defaultLocation)
          ? {
              bounds: [
                [defaultLocation.southWest.longitude, defaultLocation.southWest.latitude],
                [defaultLocation.northEast.longitude, defaultLocation.northEast.latitude],
              ],
            }
          : {
              center: [defaultLocation.longitude, defaultLocation.latitude],
              zoom: defaultLocation.zoom ? defaultLocation.zoom : 7,
            };

        let maxBounds: mapboxgl.LngLatBoundsLike | undefined;
        let restrictPitchAndRotate = true;
        if (mapDefinition.cameraRestrictions) {
          if (mapDefinition.cameraRestrictions.boundingBox) {
            maxBounds = [
              [
                mapDefinition.cameraRestrictions.boundingBox.southWest.longitude,
                mapDefinition.cameraRestrictions.boundingBox.southWest.latitude,
              ],

              [
                mapDefinition.cameraRestrictions.boundingBox.northEast.longitude,
                mapDefinition.cameraRestrictions.boundingBox.northEast.latitude,
              ],
            ];
          }

          restrictPitchAndRotate = !!mapDefinition.cameraRestrictions.pitchAndRotate;
        }

        let map = createMap(
          mapContainer,
          mapStyle.url,
          initialCamera,
          maxBounds,
          restrictPitchAndRotate,
          interactive,
        );

        let rootReducer: ReducersMapObject<NamespacedState, MapActions | any> = {
          map: reducer,
          i18n: i18nReducer,
        };

        let epicDependencies = {
          map,
          api,
          animator: new Animator(api, mapDefinition.layers, map),
          callbacks,
        };

        let epics: ReadonlyArray<MapEpic> = [
          applyPresetEpic,
          zoomCameraEpic,
          moveCameraEpic,
          changeMapStyleEpic,
          removeLayerEpic,
          updateAllLayersEpic,
          updateLayerEpic,
          animationLoaderEpic,
          doAnimationEpic,
          removeAllLayersEpic,
          updateLayerSchedulerEpic,
          getLegendEpic,
          addLayerEpic,
          animationManagerEpic,
          animationClockEpic,
          callbacksEpic,
        ];

        let component: any;
        let rootComponent = <MapWidget ref={x => (component = x)} />;

        let { store } = renderWidget({
          rootComponent,
          container: uiContainer,
          rootReducer,
          epics,
          epicDependencies,
          initialState: {
            map: {
              camera: cameraInitialState,
              mapStyle: {
                ...mapStyleInitialState,
                availableStyles: mapDefinition.styles,
                activeStyleId: mapStyle.id,
              },
              layers: {
                ...layersInitialState,
                availableLayers: [...mapDefinition.layers, ...layers],
              },
              presets: {
                presets: [...mapDefinition.presets, ...presets],
              },
              userInterface: {
                ...userInterfaceInitialState,
                uuid: guid(),
              },
            },
            i18n: {
              ...i18nInitialState,
              locale,
              units,
              clock,
            },
          },
        });

        if (defaultLayers) {
          if (Array.isArray(defaultLayers)) {
            map.once("load", () => defaultLayers.map(addLayer).map(store.dispatch));
          } else {
            map.once("load", () => store.dispatch(addLayer(defaultLayers)));
          }
        }

        let connectedMapEvents = new ConnectMapEvents(map);
        connectedMapEvents.connect({
          onMove(camera: Camera): void {
            if (callbacks.onMapMove) callbacks.onMapMove(camera);
          },
          onMoveEnd(camera: Camera): void {
            store.dispatch(syncCamera(map));
          },
          onMoveDwell(): void {
            store.dispatch(updateAllLayers());
          },
          onPointerPress({ coordinates }): void {
            if (callbacks.onMapPress) {
              callbacks.onMapPress(coordinates);
            }
          },
        });

        fromEvent(map, "load")
          .pipe(take(1))
          .subscribe(() => {
            resolve({
              addLayer(layerId: LayerId): void {
                store.dispatch(addLayer(layerId));
              },
              removeLayer(layerId: LayerId): void {
                store.dispatch(removeLayer(layerId));
              },
              startAnimation(): void {
                store.dispatch(startAnimation());
              },
              stopAnimation(): void {
                store.dispatch(stopAnimation());
              },
              setLocation(location: Location, animate = true): void {
                if (isBoundingBox(location)) {
                  store.dispatch(
                    moveCamera({
                      ...map.cameraForBounds(
                        new mapboxgl.LngLatBounds(
                          [location.southWest.longitude, location.southWest.latitude],
                          [location.northEast.longitude, location.northEast.latitude],
                        ),
                      ),
                      animate,
                    }),
                  );
                } else {
                  store.dispatch(
                    moveCamera({
                      center: [location.longitude, location.latitude],
                      zoom: location.zoom ? location.zoom : map.getZoom(),
                      animate,
                    }),
                  );
                }
              },
            });
          });
      },
      ([mapDefErr, accessTokenErr]) => {
        let errorMessage = mapDefErr ? mapDefErr.message : accessTokenErr.message;
        let errorMessageElement = document.createElement("div");
        errorMessageElement.innerText = errorMessage;
        errorMessageElement.style.color = "rgb(255, 72, 54)";
        errorMessageElement.style.fontWeight = "bold";
        errorMessageElement.style.fontFamily = "Arial, sans-serif";
        errorMessageElement.style.fontSize = "12px";
        containerElement!.insertAdjacentElement("afterbegin", errorMessageElement);
      },
    );
  });
};
