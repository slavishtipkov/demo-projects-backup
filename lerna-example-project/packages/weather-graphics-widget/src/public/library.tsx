import { renderWidget, WidgetFactory } from "@dtn/browser-render-lib";
import { pairwise } from "rxjs/operators";
import {
  initialState as i18nInitialState,
  Locales,
  reducer as i18nReducer,
  Units,
} from "@dtn/i18n-lib";
import * as React from "react";
import { ReducersMapObject } from "redux";
import { ApiService } from "../services";
import {
  initialState,
  StaticWeatherMapActions,
  StaticWeatherMapEpic,
  StaticWeatherMapState,
  PublicApiCallbacks,
  reducer,
  selectError,
  selectLoading,
  fetchMapImageEpic,
  selectActiveMap,
} from "../store";
import { StaticWeatherMap } from "../ui/widgets";
import { BehaviorSubject } from "rxjs";
import { ERRORS, DEFAULT_MAPS, MAPS_CONFIG_DICTIONARY } from "../constants";
import IndexView from "../ui/views/index-view";
import { MapsConfigInterface } from "../interfaces";
import { WeatherGraphics } from "../types";

export interface WidgetConfig {
  readonly apiKey: string;
  readonly callbacks?: PublicApiCallbacks;
  readonly showWeatherGraphics?: boolean | ReadonlyArray<WeatherGraphics>;
  readonly defaultWeatherGraphic?: WeatherGraphics;
  readonly units?: Units;
}

export interface ThemeProp {}

export interface PublicApi {
  readonly setWeatherGraphic: (weatherGraphic: WeatherGraphics) => void;
}

export type CreateWeatherGraphicsWidget = WidgetFactory<
  WidgetConfig,
  ThemeProp,
  Promise<PublicApi>
>;

export const createWeatherGraphicsWidget: CreateWeatherGraphicsWidget = async ({
  container,
  apiKey,
  baseUrl = "https://api.dtn.com",
  locale = Locales.ENGLISH,
  theme = {},
  showWeatherGraphics = true,
  defaultWeatherGraphic = "US_SEVERE_WEATHER_RISK",
  units = Units.IMPERIAL,
  callbacks,
}) => {
  let component: any;
  let rootComponent = <StaticWeatherMap ref={x => (component = x)} theme={theme} />;

  let rootReducer: ReducersMapObject<StaticWeatherMapState, StaticWeatherMapActions | any> = {
    staticWeatherMapState: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<StaticWeatherMapEpic> = [fetchMapImageEpic];

  let epicDependencies = {
    api: new ApiService({
      token: apiKey,
      locale,
      baseUrl,
    }),
    callbacks,
  };

  let isMapSidebarVisible = true;
  let checkedMaps: MapsConfigInterface = {};
  if (showWeatherGraphics === true) {
    checkedMaps = DEFAULT_MAPS;
  } else if (showWeatherGraphics === false || showWeatherGraphics.length === 0) {
    checkedMaps = DEFAULT_MAPS;
    isMapSidebarVisible = false;
  } else {
    checkedMaps = Object.assign(
      {},
      ...showWeatherGraphics
        .filter(m => DEFAULT_MAPS[MAPS_CONFIG_DICTIONARY[m.toLocaleUpperCase()]])
        .map(m => {
          {
            return { [MAPS_CONFIG_DICTIONARY[m.toLocaleUpperCase()]]: true };
          }
        }),
    );
  }

  const checkedDefaultMap = Object.keys(checkedMaps).includes(
    MAPS_CONFIG_DICTIONARY[defaultWeatherGraphic],
  )
    ? MAPS_CONFIG_DICTIONARY[defaultWeatherGraphic]
    : Object.keys(checkedMaps)[0];

  let { store } = renderWidget<
    StaticWeatherMapState,
    StaticWeatherMapActions,
    typeof epicDependencies
  >({
    rootComponent,
    container,
    rootReducer,
    epics,
    epicDependencies,
    initialState: {
      staticWeatherMapState: {
        ...initialState,
        maps: checkedMaps,
        defaultMap: checkedDefaultMap,
        isMapSidebarVisible,
      },
      i18n: {
        ...i18nInitialState,
        locale,
        units,
      },
    },
  });

  let state$ = new BehaviorSubject<StaticWeatherMapState>(store.getState());
  store.subscribe(() => state$.next(store.getState()));

  if (callbacks) {
    state$
      .asObservable()
      .pipe(pairwise())
      .subscribe(([previousState, state]: ReadonlyArray<StaticWeatherMapState>) => {
        const { onWeatherGraphicChange } = callbacks;
        if (onWeatherGraphicChange && selectActiveMap(previousState) !== selectActiveMap(state)) {
          const weatherGraphic = selectActiveMap(state);
          if (weatherGraphic) {
            const stateWeatherGraphic = Object.keys(MAPS_CONFIG_DICTIONARY).find(
              k => MAPS_CONFIG_DICTIONARY[k] === weatherGraphic,
            );
            onWeatherGraphicChange(stateWeatherGraphic as WeatherGraphics);
          }
        }
      });
  }

  const inner: IndexView = component.getWrappedInstance();

  return new Promise<PublicApi>(resolve => {
    resolve({
      setWeatherGraphic: (weatherGraphic: WeatherGraphics): void => {
        inner.props.setActiveMap(MAPS_CONFIG_DICTIONARY[weatherGraphic]);
      },
    });
  });
};
