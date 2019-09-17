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
  fetchHourlyForecastEpic,
  initialState,
  PublicApiCallbacks,
  reducer,
  HourlyForecastActions,
  HourlyForecastEpic,
  HourlyForecastState,
  selectLoading,
  selectCoordinates,
  selectHourlyForecast,
  selectError,
  fetchObservedAtEpic,
  selectVisibleFields,
  fetchDayForecastEpic,
  premiumHourlyForecastEpic,
  clearZipCodeValueEpic,
  clearLocationStationEpic,
} from "../store";
import { HourlyForecast } from "../ui/widgets";
import { BehaviorSubject } from "rxjs";
import { VisibleFields } from "../interfaces";
import {
  ERRORS,
  DEFAULT_VISIBLE_FIELDS,
  ALLOWED_HOURS_TO_DAYS_FORECAST,
  REQUIRED_VISIBLE_FIELDS,
} from "../constants";
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

export type WeatherFields =
  | "FEELS_LIKE"
  | "SKY_COVER"
  | "HUMIDITY"
  | "DEW_POINT"
  | "WIND_DIRECTION"
  | "WIND_SPEED"
  | "PRECIP_TYPE"
  | "PRECIP_CHANCE"
  | "PRECIP_AMOUNT";

export interface ForecastProps {
  readonly day: boolean;
  readonly hour: boolean;
  readonly condition: boolean;
  readonly skyCover: boolean;
  readonly temp_feelsLike: boolean;
  readonly windDirections: boolean;
  readonly windSpeeds: boolean;
  readonly dewPoint: boolean;
  readonly humidity: boolean;
  readonly precipType: boolean;
  readonly precipChance: boolean;
  readonly precipAmount: boolean;
  readonly [key: string]: boolean;
}

export interface WidgetConfig {
  readonly apiKey: string;
  readonly container: HTMLElement | string;
  readonly units: Units;
  readonly userId: string;
  readonly defaultLocation?: PostalCode | Coordinates | { readonly stationId: StationId };
  readonly stations?: ReadonlyArray<Station>;
  readonly showStationsSelect?: boolean;
  readonly showPostalCodeInput?: boolean;
  readonly showWeatherDetails?: boolean | ReadonlyArray<WeatherFields>;
  readonly callbacks?: PublicApiCallbacks;
}

export const VISIBLE_FIELDS: {
  readonly [key: string]: boolean;
} = {
  day: true,
  hour: true,
  condition: true,
  skyCover: true,
  temp_feelsLike: true,
  windDirections: true,
  windSpeeds: true,
  dewPoint: true,
  humidity: true,
  precipType: true,
  precipChance: true,
  precipAmount: true,
};

export const VISIBLE_FIELDS_DICTIONARY: {
  readonly [key: string]: string;
} = {
  FEELS_LIKE: "temp_feelsLike",
  SKY_COVER: "skyCover",
  HUMIDITY: "humidity",
  DEW_POINT: "dewPoint",
  WIND_DIRECTION: "windDirections",
  WIND_SPEED: "windSpeeds",
  PRECIP_TYPE: "precipType",
  PRECIP_CHANCE: "precipChance",
  PRECIP_AMOUNT: "precipAmount",
};

export interface WidgetConfig {
  readonly apiKey: string;
  readonly units: Units;
  readonly userId: string;
  readonly defaultLocation?: PostalCode | Coordinates | { readonly stationId: StationId };
  readonly stations?: ReadonlyArray<Station>;
  readonly showStationsSelect?: boolean;
  readonly showPostalCodeInput?: boolean;
  readonly showWeatherDetails?: boolean | ReadonlyArray<WeatherFields>;
}
export interface ThemeProp {}

export interface PublicApi {
  readonly setLocation: (
    location: PostalCode | Coordinates | { readonly stationId: StationId },
  ) => void;
}

export type CreatePremiumHourlyForecastWidget = WidgetFactory<
  WidgetConfig,
  ThemeProp,
  Promise<PublicApi>
>;

export const createPremiumHourlyForecastWidget: CreatePremiumHourlyForecastWidget = async ({
  container,
  apiKey,
  baseUrl = "https://api.dtn.com",
  userId,
  stations = [],
  defaultLocation = {},
  showStationSelect = true,
  showWeatherDetails = true,
  showPostalCodeInput = true,
  units = Units.IMPERIAL,
  locale = Locales.ENGLISH,
  theme = {},
  callbacks,
}) => {
  const showWeatherDetailsArray = showWeatherDetails as ReadonlyArray<WeatherFields>;
  const showWeatherDetailsLength = showWeatherDetailsArray.length;
  const days = ALLOWED_HOURS_TO_DAYS_FORECAST;
  let component: any;
  let rootComponent = <HourlyForecast ref={x => (component = x)} theme={theme} />;

  let visibleFields: ForecastProps;

  if (showWeatherDetails === true) {
    visibleFields = Object.assign(
      {},
      ...Object.keys(VISIBLE_FIELDS).map(k => {
        return { [k]: VISIBLE_FIELDS[k] };
      }),
    );
  } else if (showWeatherDetails === false || showWeatherDetails.length === 0) {
    visibleFields = Object.assign(
      {},
      ...Object.keys(VISIBLE_FIELDS).map((k, index) => {
        if (index < 3) {
          return { [k]: true };
        }
        return { [k]: false };
      }),
    );
  } else {
    visibleFields = Object.assign(
      {},
      ...Object.keys(VISIBLE_FIELDS).map((k, index) => {
        if (index < 3) {
          return { [k]: true };
        }
        return { [k]: false };
      }),
      ...showWeatherDetails
        .filter(m => VISIBLE_FIELDS[VISIBLE_FIELDS_DICTIONARY[m]])
        .map(m => {
          {
            return { [VISIBLE_FIELDS_DICTIONARY[m]]: true };
          }
        }),
    );
  }

  const { latitude, longitude } = defaultLocation as Coordinates;
  const { postalCode } = defaultLocation as PostalCode;
  const zipCode = postalCode;

  let station = defaultLocation as { readonly stationId: StationId };
  const selectedStation = station.stationId ? station : undefined;

  const parsedStations: ReadonlyArray<{
    readonly stationId: StationId;
    readonly displayName: string;
  }> = stations.map(s => {
    return { stationId: s.id, displayName: s.displayName };
  });

  let rootReducer: ReducersMapObject<HourlyForecastState, HourlyForecastActions | any> = {
    zipCodeState: ZipCodeWidget.reducer,
    locationSelectState: PremiumLocationSelectWidget.reducer,
    hourlyForecast: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<HourlyForecastEpic | any> = [
    fetchHourlyForecastEpic,
    fetchObservedAtEpic,
    fetchDayForecastEpic,
    premiumHourlyForecastEpic,
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

  const userCoordinates: { readonly lat: number; readonly lon: number } | undefined =
    latitude && longitude ? { lat: latitude, lon: longitude } : undefined;

  let { store } = renderWidget<HourlyForecastState, HourlyForecastActions, typeof epicDependencies>(
    {
      rootComponent,
      container,
      rootReducer,
      epics,
      epicDependencies,
      initialState: {
        hourlyForecast: {
          ...initialState,
          user: userId,
          visibleFields,
          days,
          units,
          coordinates: userCoordinates,
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
    },
  );

  let state$ = new BehaviorSubject<HourlyForecastState>(store.getState());
  store.subscribe(() => state$.next(store.getState()));

  if (callbacks) {
    state$
      .asObservable()
      .pipe(pairwise())
      .subscribe(([previousState, state]: ReadonlyArray<HourlyForecastState>) => {
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
          inner.props.fetchHourlyForecastData(
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
