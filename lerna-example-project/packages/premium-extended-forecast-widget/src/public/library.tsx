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
  PublicApiCallbacks,
  reducer,
  PremiumWeatherForecastActions,
  PremiumWeatherForecastEpic,
  PremiumWeatherForecastState,
  selectLoading,
  selectCoordinates,
  selectWeatherForecast,
  selectError,
  fetchObservedAtEpic,
  premiumWeatherForecastEpic,
  fetchPremiumWeatherForecastEpic,
  clearZipCodeValueEpic,
  clearLocationStationEpic,
} from "../store";
import { PremiumWeatherForecast } from "../ui/widgets";
import { BehaviorSubject } from "rxjs";
import { ERRORS } from "../constants";
import IndexView from "../ui/views/index-view";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as PremiumLocationSelectWidget from "@dtn/premium-location-select-widget";

// tslint:disable-next-line:interface-over-type-literal
export type Coordinates = { readonly latitude: number; readonly longitude: number };
// tslint:disable-next-line:interface-over-type-literal
export type PostalCode = { readonly postalCode: string };
export type StationId = string;
// tslint:disable-next-line:interface-over-type-literal
export type Station = { readonly id: StationId; readonly displayName: string };

export interface WidgetConfig {
  readonly apiKey: string;
  readonly container: HTMLElement | string;
  readonly units?: Units;
  readonly userId: string;
  readonly defaultLocation?: PostalCode | Coordinates | { readonly stationId: StationId };
  readonly stations?: ReadonlyArray<Station>;
  readonly showStationsSelect?: boolean;
  readonly showPostalCodeInput?: boolean;
  readonly callbacks?: PublicApiCallbacks;
}

export interface ThemeProp {}

export interface PublicApi {
  readonly setLocation: (
    location: PostalCode | Coordinates | { readonly stationId: StationId },
  ) => void;
}

export type CreatePremiumExtendedForecastWidget = WidgetFactory<
  WidgetConfig,
  ThemeProp,
  Promise<PublicApi>
>;

export const createPremiumExtendedForecastWidget: CreatePremiumExtendedForecastWidget = async ({
  container,
  apiKey,
  baseUrl = "https://api.dtn.com",
  defaultLocation = {},
  units = Units.IMPERIAL,
  userId,
  stations = [],
  showStationSelect = true,
  showPostalCodeInput = true,
  locale = Locales.ENGLISH,
  theme = {},
  callbacks,
}) => {
  let component: any;
  let rootComponent = <PremiumWeatherForecast ref={x => (component = x)} theme={theme} />;

  let rootReducer: ReducersMapObject<
    PremiumWeatherForecastState,
    PremiumWeatherForecastActions | any
  > = {
    zipCodeState: ZipCodeWidget.reducer,
    locationSelectState: PremiumLocationSelectWidget.reducer,
    premiumWeatherForecast: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<PremiumWeatherForecastEpic | any> = [
    fetchPremiumWeatherForecastEpic,
    premiumWeatherForecastEpic,
    fetchObservedAtEpic,
    clearZipCodeValueEpic,
    clearLocationStationEpic,
    ZipCodeWidget.fetchZipCodeByCoordinatesEpic,
    ZipCodeWidget.fetchZipCodeDataEpic,
    PremiumLocationSelectWidget.fetchStationsEpic,
  ];

  let epicDependencies = {
    api: new ApiService({
      token: apiKey,
      units,
      locale,
      baseUrl,
    }),
    zipApi: new ZipCodeWidget.ApiService({
      token: apiKey,
      units,
      locale,
      baseUrl,
    }),
    locationSelectApi: new PremiumLocationSelectWidget.ApiService({
      token: apiKey,
      units,
      locale,
      baseUrl,
    }),
  };

  const { latitude, longitude } = defaultLocation as Coordinates;
  const { postalCode } = defaultLocation as PostalCode;
  const zipCode = postalCode;

  let station = defaultLocation as { readonly stationId: StationId };
  const selectedStation = station.stationId ? station : undefined;
  const userCoordinates: any =
    latitude && longitude ? { lat: latitude, lon: longitude } : undefined;

  const parsedStations: ReadonlyArray<{
    readonly stationId: StationId;
    readonly displayName: string;
  }> = stations.map(s => {
    return { stationId: s.id, displayName: s.displayName };
  });

  let { store } = renderWidget<
    PremiumWeatherForecastState,
    PremiumWeatherForecastActions,
    typeof epicDependencies
  >({
    rootComponent,
    container,
    rootReducer,
    epics,
    epicDependencies,
    initialState: {
      premiumWeatherForecast: {
        ...initialState,
        coordinates: userCoordinates,
        units,
        user: userId,
        days: 10,
        zipCode,
        selectedStation,
        showStationSelect,
        showZipCode: showPostalCodeInput,
      },
      zipCodeState: {
        ...ZipCodeWidget.initialState,
      },
      locationSelectState: {
        ...PremiumLocationSelectWidget.initialState,
        user: userId,
        stations: parsedStations,
      },
      i18n: {
        ...i18nInitialState,
        units,
        locale,
      },
    },
  });

  let state$ = new BehaviorSubject<PremiumWeatherForecastState>(store.getState());
  store.subscribe(() => state$.next(store.getState()));
  if (callbacks) {
    state$
      .asObservable()
      .pipe(pairwise())
      .subscribe(([previousState, state]: ReadonlyArray<PremiumWeatherForecastState>) => {
        const { onStationChange, onPostalCodeChange, onWeatherChange } = callbacks;
        if (
          onStationChange &&
          JSON.stringify(PremiumLocationSelectWidget.selectSelectedStation(previousState)) !==
            JSON.stringify(PremiumLocationSelectWidget.selectSelectedStation(state))
        ) {
          const station = PremiumLocationSelectWidget.selectSelectedStation(state);
          if (station && station.stationId) {
            const stateStation: Station = {
              id: station.stationId,
              displayName: station.displayName,
            };
            onStationChange(stateStation);
          }
        }
        if (
          onPostalCodeChange &&
          JSON.stringify(ZipCodeWidget.selectCoordinates(previousState)) !==
            JSON.stringify(ZipCodeWidget.selectCoordinates(state))
        ) {
          const postalCodeCoordinates = ZipCodeWidget.selectCoordinates(state);
          if (postalCodeCoordinates) {
            onPostalCodeChange({
              latitude: postalCodeCoordinates.lat,
              longitude: postalCodeCoordinates.lon,
              postalCode: postalCodeCoordinates.postalCode,
            });
          }
        }
        if (
          onWeatherChange &&
          JSON.stringify(selectCoordinates(previousState)) !==
            JSON.stringify(selectCoordinates(state))
        ) {
          const coordinates = selectCoordinates(state);
          if (coordinates && coordinates.lat && coordinates.lon) {
            const stateCoordinates: Coordinates = {
              latitude: coordinates.lat,
              longitude: coordinates.lon,
            };
            onWeatherChange(stateCoordinates);
          }
        }
      });
  }

  const inner: IndexView = component.getWrappedInstance();
  return new Promise<PublicApi>(resolve => {
    resolve({
      setLocation(location: PostalCode | Coordinates | { readonly stationId: StationId }): void {
        const { latitude, longitude } = location as Coordinates;
        const { postalCode } = location as PostalCode;
        const { stationId } = location as { readonly stationId: StationId };
        if (stationId) {
          inner.props.selectStation({ stationId, displayName: "" });
        } else if (postalCode) {
          inner.props.setZipCode(postalCode);
        } else if (latitude && longitude) {
          inner.props.fetchWeatherForecastData(
            {
              lat: latitude,
              lon: longitude,
            },
            inner.props.days,
            inner.props.units,
          );
          inner.props.getZipCodeByCoordinates({
            lat: latitude,
            lon: longitude,
          });
        }
      },
    });
  });
};
