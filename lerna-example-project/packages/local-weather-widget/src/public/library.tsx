import { renderWidget, WidgetFactory } from "@dtn/browser-render-lib";
import {
  Clock,
  initialState as i18nInitialState,
  Locales,
  reducer as i18nReducer,
  Units,
} from "@dtn/i18n-lib";
import { createLocationSelectWidget } from "@dtn/location-select-widget";
import { createZipCodeWidget } from "@dtn/zip-code-widget";
import { createFiveDaysForecastWidget } from "@dtn/five-days-forecast-widget";
import { createCurrentConditionsWidget } from "@dtn/current-conditions-widget";
import { hideWidget, showWidget, areCoordinatesValid } from "../utils";

// tslint:disable-next-line:interface-over-type-literal
export type Coordinates = { readonly latitude: number; readonly longitude: number };
// tslint:disable-next-line:interface-over-type-literal
export type PostalCode = { readonly postalCode: string };
export type StationId = string;
// tslint:disable-next-line:interface-over-type-literal
export type StationType = { readonly id: StationId; readonly displayName: string };
export type WeatherFields =
  | "TEMPERATURE"
  | "FEELS_LIKE"
  | "HUMIDITY"
  | "BAROMETER"
  | "DEW_POINT"
  | "WIND_DIRECTION"
  | "WIND_SPEED"
  | "PRECIP_TYPE"
  | "PRECIP_CHANCE"
  | "PRECIP_AMOUNT"
  | "EVAPOTRANSPIRATION"
  | "SUNRISE"
  | "SUNSET"
  | "OBSERVATION_OR_FORECAST";

export interface Station {
  readonly id: StationId;
  readonly displayName: string;
}

export interface DailySurfaceData {
  readonly avDewPoint: number;
  readonly avgFeelsLike: number;
  readonly avgHeatIndex: number;
  readonly avgPressure: number;
  readonly avgRelativeHumidity: number;
  readonly avgSoilMoisture: number;
  readonly avgSoilTemp: number;
  readonly avgTemperature: number;
  readonly avgWetBulbGlobeTemp: number;
  readonly avgWetBulbTemp: number;
  readonly avgWindChill: number;
  readonly avgWindSpeed: number;
  readonly cloudCoverPercent: number;
  readonly date: string;
  readonly evapotranspiration: number;
  readonly latitude: number;
  readonly longitude: number;
  readonly maxFeelsLike: number;
  readonly maxHeatIndex: number;
  readonly maxSoilMoisture: number;
  readonly maxSoilTemp: number;
  readonly maxTemperature: number;
  readonly maxWetBulbGlobeTemp: number;
  readonly maxWindChill: number;
  readonly maxWindSpeed: number;
  readonly minFeelsLike: number;
  readonly minHeatIndex: number;
  readonly minSoilMoisture: number;
  readonly minSoilTemp: number;
  readonly minTemperature: number;
  readonly minWetBulbGlobeTemp: number;
  readonly minWindChill: number;
  readonly precipitationAmount: number;
  readonly precipitationType: number;
  readonly snowAmount: number;
  readonly stationId: string;
  readonly sunrise: string;
  readonly sunset: string;
  readonly weatherCode: number;
  readonly weatherDescription: string;
}

export interface ForecastFields {
  readonly temperature: boolean;
  readonly feelsLike: boolean;
  readonly precipType: boolean;
  readonly precipChance: boolean;
  readonly precipAmount: boolean;
  readonly maxTemperature_maxFeelsLike: boolean;
  readonly minTemperature_minFeelsLike: boolean;
  readonly humidity: boolean;
  readonly barometer: boolean;
  readonly dewPoint: boolean;
  readonly evapotranspiration: boolean;
  readonly windDirection: boolean;
  readonly windSpeed: boolean;
  readonly sunrise: boolean;
  readonly sunset: boolean;
  readonly observation_or_forecast: boolean;
}

export interface ForecastProps {
  readonly temperature: boolean;
  readonly feelsLike: boolean;
  readonly precipType: boolean;
  readonly precipChance: boolean;
  readonly precipAmount: boolean;
  readonly humidity: boolean;
  readonly barometer: boolean;
  readonly dewPoint: boolean;
  readonly evapotranspiration: boolean;
  readonly windDirection: boolean;
  readonly windSpeed: boolean;
  readonly sunrise: boolean;
  readonly sunset: boolean;
  readonly observation_or_forecast: boolean;
}

export interface WidgetConfig {
  readonly apiKey: string;
  readonly units: Units;
  readonly callbacks?: {
    readonly onStationChange: (newStation: Station) => void;
    readonly onPostalCodeChange: (newPostalCode: PostalCode & Coordinates) => void;
    readonly onWeatherChange: (newCoordinates: Coordinates) => void;
  };
  readonly showStationsSelect?: boolean;
  readonly showPostalCodeInput?: boolean;
  readonly showForecast?: boolean;
  readonly showCurrentConditions?: boolean;
  readonly stations?: ReadonlyArray<Station>;
  readonly defaultLocation?: PostalCode | Coordinates | { readonly stationId: StationId };
  readonly showWeatherDetails?: boolean | ReadonlyArray<WeatherFields>;
}

export const VISIBLE_FIELDS: {
  readonly [key: string]: boolean;
} = {
  temperature: true,
  feelsLike: true,
  precipType: true,
  precipChance: true,
  precipAmount: true,
  humidity: true,
  barometer: true,
  dewPoint: true,
  evapotranspiration: true,
  windDirection: true,
  windSpeed: true,
  sunrise: true,
  sunset: true,
  observation_or_forecast: true,
};

export const VISIBLE_FIELDS_DICTIONARY: {
  readonly [key: string]: string;
} = {
  TEMPERATURE: "temperature",
  FEELS_LIKE: "feelsLike",
  HUMIDITY: "humidity",
  BAROMETER: "barometer",
  DEW_POINT: "dewPoint",
  WIND_DIRECTION: "windDirection",
  WIND_SPEED: "windSpeed",
  PRECIP_TYPE: "precipType",
  PRECIP_CHANCE: "precipChance",
  PRECIP_AMOUNT: "precipAmount",
  EVAPOTRANSPIRATION: "evapotranspiration",
  SUNRISE: "sunrise",
  SUNSET: "sunset",
  OBSERVATION_OR_FORECAST: "observation_or_forecast",
};

export interface ThemeProp {}

export interface PublicApi {
  readonly setLocation: (
    location: PostalCode | Coordinates | { readonly stationId: StationId },
  ) => void;
}

export type CreateLocalWeatherWidget = WidgetFactory<WidgetConfig, ThemeProp, Promise<PublicApi>>;

// tslint:disable-next-line:one-variable-per-declaration
export const createLocalWeatherWidget: CreateLocalWeatherWidget = async ({
  container,
  apiKey,
  baseUrl = "https://api.dtn.com",
  units = Units.IMPERIAL,
  locale = Locales.ENGLISH,
  clock = Clock.TWELVE_HOUR,
  callbacks,
  theme = {},
  showStationsSelect = true,
  showPostalCodeInput = true,
  showForecast = true,
  showCurrentConditions = true,
  defaultLocation = {},
  showWeatherDetails = true,
  stations = [],
}) => {
  const showWeatherDetailsArray = showWeatherDetails as ReadonlyArray<WeatherFields>;
  const showWeatherDetailsLength = showWeatherDetailsArray.length;
  const showCurrentObservation = showCurrentConditions;
  const showFooter =
    showForecast && (showWeatherDetails === false || showWeatherDetailsLength === 0) ? true : false;

  let visibleFields: ForecastProps;
  let haveVisibleFields = true;

  if (showWeatherDetails === true) {
    visibleFields = Object.assign(
      {},
      ...Object.keys(VISIBLE_FIELDS).map(k => {
        return { [k]: VISIBLE_FIELDS[k] };
      }),
    );
  } else if (showWeatherDetails === false || showWeatherDetails.length === 0) {
    haveVisibleFields = false;
    visibleFields = Object.assign(
      {},
      ...Object.keys(VISIBLE_FIELDS).map(k => {
        return { [k]: VISIBLE_FIELDS[k] };
      }),
    );
  } else {
    visibleFields = Object.assign(
      {},
      ...Object.keys(VISIBLE_FIELDS).map(k => {
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
  const parsedStations: ReadonlyArray<{
    readonly stationId: StationId;
    readonly displayName: string;
  }> = stations.map(s => {
    return { stationId: s.id, displayName: s.displayName };
  });
  const selectedStation = defaultLocation as { readonly stationId: StationId };
  const userCoordinates: { readonly lat?: number; readonly lon?: number } =
    latitude && longitude ? { lat: latitude, lon: longitude } : {};

  // Create containers for the widgets being composed together
  let locationSelectContainer = document.createElement("div");
  let zipCodeWidgetContainer = document.createElement("div");
  let localWeatherWidgetContainer = document.createElement("div");
  let currentConditionsWeatherWidgetContainer = document.createElement("div");

  let errorContainer = document.createElement("div");
  errorContainer.textContent =
    "Error: Invalid widget configuration. Please provide valid zip/postal code, station or coordinates.";
  errorContainer.style.fontSize = "12px";
  errorContainer.style.fontFamily = "Arial,Helvetica Neue,Helvetica,sans-serif";
  errorContainer.style.paddingTop = "5px";
  errorContainer.style.color = "#ff4836";
  errorContainer.style.fontWeight = "700";
  errorContainer.style.background = "#ffffff";

  if (!showStationsSelect && !showPostalCodeInput && !showForecast && !haveVisibleFields) {
    showWidget(errorContainer);
  } else {
    hideWidget(errorContainer);
  }

  if (showStationsSelect) {
    showWidget(locationSelectContainer);
  } else {
    hideWidget(locationSelectContainer);
  }

  if (showPostalCodeInput) {
    showWidget(zipCodeWidgetContainer);
  } else {
    hideWidget(zipCodeWidgetContainer);
  }

  if (showForecast) {
    showWidget(localWeatherWidgetContainer);
  } else {
    hideWidget(localWeatherWidgetContainer);
  }

  if (haveVisibleFields) {
    showWidget(currentConditionsWeatherWidgetContainer);
  } else {
    hideWidget(currentConditionsWeatherWidgetContainer);
  }

  if (!(userCoordinates && userCoordinates.lat && userCoordinates.lon)) {
    hideWidget(localWeatherWidgetContainer);
    hideWidget(currentConditionsWeatherWidgetContainer);
  } else if (
    userCoordinates &&
    userCoordinates.lat &&
    userCoordinates.lon &&
    !areCoordinatesValid(userCoordinates as { readonly lat: number; readonly lon: number })
  ) {
    showWidget(localWeatherWidgetContainer);
    hideWidget(currentConditionsWeatherWidgetContainer);
  }

  let compositeWidgetContainer =
    container instanceof Element ? container : document.querySelector(container)!;

  const compositeWidget = compositeWidgetContainer as HTMLElement;
  compositeWidget.style.background = "#ffffff";
  compositeWidget.style.padding = "10px";

  // Append the created containers to the dom
  compositeWidgetContainer.appendChild(locationSelectContainer);
  compositeWidgetContainer.appendChild(zipCodeWidgetContainer);
  compositeWidgetContainer.appendChild(localWeatherWidgetContainer);
  compositeWidgetContainer.appendChild(currentConditionsWeatherWidgetContainer);
  compositeWidgetContainer.appendChild(errorContainer);

  let locationSelectWidget: any = createLocationSelectWidget({
    container: locationSelectContainer,
    token: apiKey,
    locale,
    units,
    clock,
    baseUrl,
    theme,
    selectedStation: "",
    stations: parsedStations,
    callbacks: {
      selectedStationDidChange,
      isSameStationSelected,
    },
  });

  let zipCodeWidget: any = createZipCodeWidget({
    container: zipCodeWidgetContainer,
    token: apiKey,
    locale,
    units,
    clock,
    baseUrl,
    theme,
    callbacks: {
      coordinatesDidChange,
      zipCodeDidChange,
      onError: onZipCodeError,
    },
  });

  let fiveDaysForecastWidget: any = createFiveDaysForecastWidget({
    container: localWeatherWidgetContainer,
    token: apiKey,
    locale,
    units,
    clock,
    baseUrl,
    theme,
    showFooter,
    allowDaySelection: haveVisibleFields,
    coordinates: userCoordinates,
    callbacks: {
      activeDayDidChange,
      onError: onLocalWeatherWidgetError,
      weatherForecastDidChange: onWeatherForecastDidChange,
    },
  });

  let currentConditionsWidget: any = createCurrentConditionsWidget({
    container: currentConditionsWeatherWidgetContainer,
    token: apiKey,
    locale,
    units,
    clock,
    baseUrl,
    theme,
    coordinates: userCoordinates,
    visibleFields,
    showCurrentObservation,
    callbacks: {
      currentConditionsDidChange: onCurrentConditionsDidChange,
    },
  });

  if (
    userCoordinates &&
    userCoordinates.lat &&
    userCoordinates.lon &&
    showForecast &&
    haveVisibleFields
  ) {
    fiveDaysForecastWidget.hideFooter();
  }

  if (selectedStation && selectedStation.stationId) {
    locationSelectWidget.setSelectedStation(selectedStation);

    if (showForecast && haveVisibleFields) {
      showWidget(localWeatherWidgetContainer);
      showWidget(currentConditionsWeatherWidgetContainer);
    } else if (showForecast && !haveVisibleFields) {
      showWidget(localWeatherWidgetContainer);
    } else if (!showForecast && haveVisibleFields) {
      showWidget(currentConditionsWeatherWidgetContainer);
    }
  } else if (zipCode) {
    zipCodeWidget.fetchZipCode(zipCode);
  } else if (
    userCoordinates &&
    userCoordinates.lat &&
    userCoordinates.lon &&
    areCoordinatesValid(userCoordinates as { readonly lat: number; readonly lon: number })
  ) {
    zipCodeWidget.getZipCodeByCoordinates(userCoordinates);
  }

  function zipCodeDidChange(zipCode?: string): void {
    if (zipCode) {
      locationSelectWidget.removeSelectedStation();
    }
  }

  function coordinatesDidChange(userCoordinates?: {
    readonly lat: number;
    readonly lon: number;
    readonly postalCode?: string;
  }): void {
    if (userCoordinates && userCoordinates.lat && userCoordinates.lon) {
      if (showForecast && haveVisibleFields) {
        fiveDaysForecastWidget.fetchWeatherForecastData(userCoordinates, 5, units, showFooter);
        currentConditionsWidget.fetchCurrentConditionsDataAction(userCoordinates, 1, units);
        fiveDaysForecastWidget.hideFooter();
        showWidget(localWeatherWidgetContainer);
        showWidget(currentConditionsWeatherWidgetContainer);
      } else if (showForecast && !haveVisibleFields) {
        fiveDaysForecastWidget.fetchWeatherForecastData(userCoordinates, 5, units, showFooter);
        showWidget(localWeatherWidgetContainer);
      } else if (!showForecast && haveVisibleFields) {
        currentConditionsWidget.fetchCurrentConditionsDataAction(userCoordinates, 1, units);
        showWidget(currentConditionsWeatherWidgetContainer);
      }
    }

    // Local Weather Widget - onPostalCodeChange callback
    if (
      callbacks &&
      callbacks.onPostalCodeChange &&
      userCoordinates &&
      userCoordinates.postalCode
    ) {
      callbacks.onPostalCodeChange({
        latitude: userCoordinates.lat,
        longitude: userCoordinates.lon,
        postalCode: userCoordinates.postalCode,
      });
    }
  }

  function onWeatherForecastDidChange(coordinates?: {
    readonly lat?: number;
    readonly lon?: number;
  }): void {
    // Local Weather Widget - onWeatherChange callback
    if (
      callbacks &&
      callbacks.onWeatherChange &&
      coordinates &&
      coordinates.lat &&
      coordinates.lon &&
      showForecast
    ) {
      callbacks.onWeatherChange({ latitude: coordinates.lat, longitude: coordinates.lon });
    }
  }

  function onCurrentConditionsDidChange(coordinates?: {
    readonly lat?: number;
    readonly lon?: number;
  }): void {
    // Local Weather Widget - onWeatherChange callback
    if (
      callbacks &&
      callbacks.onWeatherChange &&
      coordinates &&
      coordinates.lat &&
      coordinates.lon &&
      !showForecast
    ) {
      callbacks.onWeatherChange({ latitude: coordinates.lat, longitude: coordinates.lon });
    }
  }

  function activeDayDidChange(forecastData: ReadonlyArray<DailySurfaceData>, id: number): void {
    currentConditionsWidget.changeCurrentConditionsByForecast([forecastData[id]]);
  }

  function fetchDataBySelectedStation(selectedStation?: {
    readonly stationId: StationId;
    readonly displayName: string;
  }): void {
    if (selectedStation && selectedStation.stationId && showForecast && haveVisibleFields) {
      zipCodeWidget.removeZipCodeValue();
      fiveDaysForecastWidget.fetchWeatherForecastData(
        { stationId: selectedStation.stationId },
        5,
        units,
        showFooter,
      );
      currentConditionsWidget.fetchCurrentConditionsDataAction(
        {
          stationId: selectedStation.stationId,
        },
        1,
        units,
      );
      fiveDaysForecastWidget.hideFooter();
      showWidget(localWeatherWidgetContainer);
      showWidget(currentConditionsWeatherWidgetContainer);
    } else if (selectedStation && selectedStation.stationId && showForecast && !haveVisibleFields) {
      zipCodeWidget.removeZipCodeValue();
      fiveDaysForecastWidget.fetchWeatherForecastData(
        { stationId: selectedStation.stationId },
        5,
        units,
        showFooter,
      );
      showWidget(localWeatherWidgetContainer);
    } else if (selectedStation && selectedStation.stationId && !showForecast && haveVisibleFields) {
      currentConditionsWidget.fetchCurrentConditionsDataAction(
        {
          stationId: selectedStation.stationId,
        },
        1,
        units,
      );
      showWidget(currentConditionsWeatherWidgetContainer);
    }
  }

  function isSameStationSelected(selectedStation?: {
    readonly stationId: StationId;
    readonly displayName: string;
  }): void {
    fetchDataBySelectedStation(selectedStation);
  }

  function selectedStationDidChange(selectedStation?: {
    readonly stationId: StationId;
    readonly displayName: string;
  }): void {
    fetchDataBySelectedStation(selectedStation);

    // Local Weather Widget - onStationChange callback
    if (callbacks && callbacks.onStationChange && selectedStation) {
      callbacks.onStationChange({
        id: selectedStation.stationId,
        displayName: selectedStation.displayName,
      });
    }
  }

  function onZipCodeError(error: any): void {
    hideWidget(localWeatherWidgetContainer);
    hideWidget(currentConditionsWeatherWidgetContainer);
  }

  function onLocalWeatherWidgetError(error: any): void {
    hideWidget(currentConditionsWeatherWidgetContainer);
  }

  // Any public api methods exposed from the composite widget are defined here
  return new Promise<PublicApi>(resolve => {
    resolve({
      setLocation(location: PostalCode | Coordinates | { readonly stationId: StationId }): void {
        const { latitude, longitude } = location as Coordinates;
        const { postalCode } = location as PostalCode;
        const { stationId } = location as { readonly stationId: StationId };

        if (stationId) {
          zipCodeWidget.removeZipCodeValue();
          const selectedStation = { displayName: "", stationId };
          locationSelectWidget.setSelectedStation(selectedStation);
          fetchDataBySelectedStation(selectedStation);
        } else if (postalCode) {
          locationSelectWidget.removeSelectedStation();
          zipCodeWidget.fetchZipCode(postalCode);
        } else if (latitude && longitude) {
          locationSelectWidget.removeSelectedStation();
          zipCodeWidget.removeZipCodeValue();
          const coordinates = { lat: latitude, lon: longitude };
          zipCodeWidget.getZipCodeByCoordinates(coordinates);
          coordinatesDidChange(coordinates);
        }
      },
    });
  });
};
