import { renderWidget, WidgetFactory } from "@dtn/browser-render-lib";
import {
  initialState as i18nInitialState,
  Locales,
  reducer as i18nReducer,
  Units,
  Clock,
  selectUnits,
} from "@dtn/i18n-lib";
import { Coordinates, PostalCode } from "@dtn/types-lib";
import { createZipCodeWidget, PublicApi as ZipCodeWidgetApi } from "@dtn/zip-code-widget";
import * as React from "react";
import { ReducersMapObject } from "redux";
import { BehaviorSubject } from "rxjs";
import { pairwise } from "rxjs/operators";
import { ApiService } from "../services";
import {
  fetchSprayOutlookForecastEpic,
  initialState,
  NamespacedState,
  PublicApiCallbacks,
  reducer,
  SprayOutlookActions,
  SprayOutlookEpic,
  fetchSprayOutlookForecast,
  selectThresholds,
  selectCoordinates,
  setThresholds as setThresholdsAction,
} from "../store";
import IndexView from "../ui/views/index-view";
import { SprayOutlook } from "../ui/widgets";
import { DEFAULT_THRESHOLDS, COOKIE_NAME, COOKIE_EXPIRES_AFTER_DAYS } from "../constants";
import { SprayOutlookThresholds } from "@dtn/api-lib";
import { getDevice, generateId, getRandomLength, getCookie, setCookie } from "../utils";

export type PremiumSprayOutlookLocation = Coordinates | PostalCode;

export type SprayOutlookThresoldsConfig = Partial<SprayOutlookThresholds>;

export interface WidgetConfig {
  readonly apiKey: string;
  readonly container: HTMLElement | string;
  readonly units: Units;
  readonly userId: string;
  readonly defaultLocation?: PremiumSprayOutlookLocation;
  readonly showPostalCodeInput?: boolean;
  readonly callbacks?: PublicApiCallbacks;
  readonly showHourly?: "EXPANDED" | boolean;
  readonly defaultThresholds?: SprayOutlookThresholds;
}

export interface ThemeProp {}

export interface PublicApi {
  readonly setLocation: (
    location: PremiumSprayOutlookLocation,
    options?: { readonly thresholds: SprayOutlookThresoldsConfig },
  ) => void;
  readonly setThresholds: (thresholds: SprayOutlookThresoldsConfig) => void;
}

export type CreatePremiumSprayOutlookWidget = WidgetFactory<
  WidgetConfig,
  ThemeProp,
  Promise<PublicApi>
>;

export const createPremiumSprayOutlookWidget: CreatePremiumSprayOutlookWidget = async ({
  container,
  apiKey,
  baseUrl = "https://api.dtn.com",
  showPostalCodeInput = true,
  units = Units.IMPERIAL,
  locale = Locales.ENGLISH,
  userId,
  theme = {},
  callbacks,
  showHourly = true,
  defaultLocation,
  defaultThresholds = {},
}) => {
  let compositeWidgetContainer =
    container instanceof Element ? container : document.querySelector(container)!;

  const compositeWidget = compositeWidgetContainer as HTMLElement;
  compositeWidget.style.background = "#ffffff";

  let zipCodeWidgetContainer = document.createElement("div");
  if (!showPostalCodeInput) zipCodeWidgetContainer.style.display = "none";
  let premiumSprayOutlookWidgetContainer = document.createElement("div");
  compositeWidget.appendChild(zipCodeWidgetContainer);
  compositeWidget.appendChild(premiumSprayOutlookWidgetContainer);

  let component;
  let rootComponent = (
    <SprayOutlook ref={x => (component = x)} theme={theme} showHourly={showHourly} />
  );

  let rootReducer: ReducersMapObject<NamespacedState, SprayOutlookActions | any> = {
    sprayOutlook: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<SprayOutlookEpic | any> = [fetchSprayOutlookForecastEpic];

  let api = new ApiService({
    token: apiKey,
    units,
    locale,
    baseUrl,
  });

  let epicDependencies = {
    api,
    publicApiCallbacks: callbacks,
  };

  let { store } = renderWidget<NamespacedState, SprayOutlookActions, typeof epicDependencies>({
    rootComponent,
    container: premiumSprayOutlookWidgetContainer,
    rootReducer,
    epics,
    epicDependencies,
    initialState: {
      sprayOutlook: {
        ...initialState,
        thresholds: normalizeThresholds(defaultThresholds, units),
      },
      i18n: {
        ...i18nInitialState,
        units,
        locale,
      },
    },
  });

  const id = generateId(getRandomLength());
  let idFromCookie = getCookie(COOKIE_NAME);
  if (idFromCookie === "") {
    setCookie(COOKIE_NAME, id, COOKIE_EXPIRES_AFTER_DAYS);
    idFromCookie = id;
  }
  api
    .logWidgetLoad(userId, undefined, idFromCookie, getDevice(), window.location.hostname)
    .subscribe();

  let zipCodeWidget: ZipCodeWidgetApi = createZipCodeWidget({
    container: zipCodeWidgetContainer,
    token: apiKey,
    locale,
    units,
    clock: Clock.TWELVE_HOUR,
    baseUrl,
    theme,
    callbacks: {
      coordinatesDidChange: onCoordinatesChange,
    },
  });

  if (defaultLocation) {
    setLocation(defaultLocation);
  }

  function onCoordinatesChange(coords?: {
    readonly lat: number;
    readonly lon: number;
    readonly postalCode: string;
  }): void {
    if (coords) {
      store.dispatch(
        fetchSprayOutlookForecast(
          { latitude: coords.lat, longitude: coords.lon },
          selectThresholds(store.getState()),
        ),
      );
    }
  }

  function setThresholds(thresholds: SprayOutlookThresoldsConfig): void {
    let normalized = normalizeThresholds(thresholds, selectUnits(store.getState()));
    store.dispatch(fetchSprayOutlookForecast(selectCoordinates(store.getState()), normalized));
  }

  function setLocation(
    location: PremiumSprayOutlookLocation,
    options?: { readonly thresholds?: SprayOutlookThresoldsConfig },
  ): void {
    const isCoordinates = (location: PremiumSprayOutlookLocation): location is Coordinates =>
      "latitude" in location && "longitude" in location;
    const isPostalCode = (location: PremiumSprayOutlookLocation): location is PostalCode =>
      "postalCode" in location;

    let thresholds: SprayOutlookThresholds;
    // tslint:disable-next-line: prefer-conditional-expression
    if (options && options.thresholds) {
      thresholds = normalizeThresholds(options.thresholds, selectUnits(store.getState()));
    } else {
      thresholds = selectThresholds(store.getState())!;
    }

    if (isCoordinates(location)) {
      zipCodeWidget.getZipCodeByCoordinates({
        lat: location.latitude,
        lon: location.longitude,
      });
      store.dispatch(fetchSprayOutlookForecast(location, thresholds));
    } else if (isPostalCode(location)) {
      zipCodeWidget.fetchZipCode(location.postalCode);
      store.dispatch(setThresholdsAction(thresholds));
    }
  }

  const inner: IndexView = (component as any).getWrappedInstance();
  return new Promise<PublicApi>(resolve => {
    resolve({
      setLocation(
        location: PremiumSprayOutlookLocation,
        options?: { readonly thresholds?: SprayOutlookThresoldsConfig },
      ): void {
        inner.resetView();
        setLocation(location, options);
      },
      setThresholds(thresholds: SprayOutlookThresoldsConfig): void {
        inner.resetView();
        setThresholds(thresholds);
      },
    });
  });
};

function normalizeThresholds(
  config: SprayOutlookThresoldsConfig,
  units: Units,
): SprayOutlookThresholds {
  let windThresholdUpperLimit;
  if (config.windThresholdUpperLimit === false) {
    windThresholdUpperLimit = false;
  } else if (
    config.windThresholdUpperLimit === undefined ||
    config.windThresholdUpperLimit === true ||
    isNaN(config.windThresholdUpperLimit)
  ) {
    windThresholdUpperLimit = DEFAULT_THRESHOLDS[units].windThresholdUpperLimit;
  } else {
    windThresholdUpperLimit = config.windThresholdUpperLimit;
  }

  let windThresholdLowerLimit;
  if (config.windThresholdLowerLimit === false) {
    windThresholdLowerLimit = false;
  } else if (
    config.windThresholdLowerLimit === undefined ||
    config.windThresholdLowerLimit === true ||
    isNaN(config.windThresholdLowerLimit)
  ) {
    windThresholdLowerLimit = DEFAULT_THRESHOLDS[units].windThresholdLowerLimit;
  } else {
    windThresholdLowerLimit = config.windThresholdLowerLimit;
  }

  let temperatureUpperLimit;
  if (config.temperatureUpperLimit === false) {
    temperatureUpperLimit = false;
  } else if (
    config.temperatureUpperLimit === undefined ||
    config.temperatureUpperLimit === true ||
    isNaN(config.temperatureUpperLimit)
  ) {
    temperatureUpperLimit = DEFAULT_THRESHOLDS[units].temperatureUpperLimit;
  } else {
    temperatureUpperLimit = config.temperatureUpperLimit;
  }

  let temperatureLowerLimit;
  if (config.temperatureLowerLimit === false) {
    temperatureLowerLimit = false;
  } else if (
    config.temperatureLowerLimit === undefined ||
    config.temperatureLowerLimit === true ||
    isNaN(config.temperatureLowerLimit)
  ) {
    temperatureLowerLimit = DEFAULT_THRESHOLDS[units].temperatureLowerLimit;
  } else {
    temperatureLowerLimit = config.temperatureLowerLimit;
  }

  let rainfreeForecastPeriod;
  if (config.rainfreeForecastPeriod === false) {
    rainfreeForecastPeriod = false;
  } else if (
    config.rainfreeForecastPeriod === undefined ||
    config.rainfreeForecastPeriod === true ||
    isNaN(config.rainfreeForecastPeriod)
  ) {
    rainfreeForecastPeriod = DEFAULT_THRESHOLDS[units].rainfreeForecastPeriod;
  } else {
    rainfreeForecastPeriod = config.rainfreeForecastPeriod;
  }

  return {
    temperatureInversionRisk:
      config.temperatureInversionRisk === undefined
        ? DEFAULT_THRESHOLDS[units].temperatureInversionRisk
        : config.temperatureInversionRisk,
    daytimeOnlyApplication:
      config.daytimeOnlyApplication === undefined
        ? DEFAULT_THRESHOLDS[units].daytimeOnlyApplication
        : config.daytimeOnlyApplication,
    minimumSprayWindow: config.minimumSprayWindow || DEFAULT_THRESHOLDS[units].minimumSprayWindow,
    rainfreeForecastPeriod,
    windThresholdUpperLimit,
    windThresholdLowerLimit,
    temperatureLowerLimit,
    temperatureUpperLimit,
  };
}
