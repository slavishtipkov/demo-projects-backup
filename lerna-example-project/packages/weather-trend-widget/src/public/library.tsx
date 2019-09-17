import { renderWidget, WidgetFactory } from "@dtn/browser-render-lib";
import {
  Clock,
  initialState as i18nInitialState,
  Locales,
  reducer as i18nReducer,
  Units,
} from "@dtn/i18n-lib";
import * as React from "react";
import { ReducersMapObject } from "redux";
import { Coordinates, WeatherFields } from "../interfaces";
import { Api } from "../services";
import {
  fetchObservedData,
  initialState,
  NamespacedState,
  reducer,
  WeatherTrendActions,
  WeatherTrendEpic,
  fetchWeatherData,
} from "../store";
import { default as Widget } from "../ui";
import MainView from "../ui/main-view";

export interface WidgetConfig {
  readonly defaultLocation: Coordinates;
  readonly weatherField?: WeatherFields;
  readonly callbacks?: Callbacks;
}

export interface Callbacks {}

export interface PublicApi {
  readonly setWeatherField: (weatherField: WeatherFields) => void;
  readonly setLocation: (location: Coordinates) => void;
}

export interface ThemeProp {}

export type CreateWeatherTrendWidget = WidgetFactory<WidgetConfig, ThemeProp, Promise<PublicApi>>;

export const createWeatherTrendWidget: CreateWeatherTrendWidget = async ({
  container,
  apiKey,
  baseUrl = "https://api.dtn.com",
  callbacks = {},
  defaultLocation,
  weatherField,
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

  let api = new Api({
    token: apiKey,
    baseUrl,
    units,
    locale,
  });

  return new Promise<PublicApi>(resolve => {
    let rootReducer: ReducersMapObject<NamespacedState, WeatherTrendActions | any> = {
      weatherTrend: reducer,
      i18n: i18nReducer,
    };

    let epicDependencies = {
      api,
    };

    let epics: ReadonlyArray<WeatherTrendEpic> = [fetchObservedData];

    let component: any;
    let rootComponent = (
      <Widget ref={x => (component = x)} location={defaultLocation} weatherField={weatherField} />
    );

    let { store } = renderWidget({
      rootComponent,
      container,
      rootReducer,
      epics,
      epicDependencies,
      initialState: {
        weatherTrend: { weatherData: initialState },
        i18n: {
          ...i18nInitialState,
          locale,
          units,
          clock,
        },
      },
    });

    let inner: MainView = component.getWrappedInstance();
    resolve({
      setWeatherField(weatherField: WeatherFields): void {
        inner.handleSetNewWeatherField(weatherField);
      },

      setLocation(location: Coordinates, weatherField?: WeatherFields): void {
        store.dispatch(fetchWeatherData(location));
        if (weatherField) {
          inner.handleSetNewWeatherField(weatherField);
        }
      },
    });
  });
};
