import { Coordinates, StationId, PostalCode } from "@dtn/types-lib";
import { toPairs } from "lodash-es";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HttpApi } from "./http";
import { Units } from "@dtn/i18n-lib";

export interface SprayOutlookStation extends Coordinates {
  readonly id: StationId;
  readonly name: string;
  readonly timezoneId: string;
}

export interface SprayOutlookDayOutlook {
  readonly date: Date;
  readonly risk: SprayOutlookRisk;
  readonly sunrise: Date;
  readonly sunset: Date;
  readonly hours: ReadonlyArray<SprayOutlookHourOutlook>;
}

export interface SprayOutlookHourOutlook {
  readonly dateTime: Date;
  readonly risk: SprayOutlookRisk;
  readonly type: string;
  readonly daylight: boolean;
  readonly precipRisk: SprayOutlookPrecipRisk;
  readonly windRisk: SprayOutlookWindRiskValue;
  readonly temperatureRisk: SprayOutlookRiskValue;
  readonly inversionRisk: SprayOutlookRiskValue;
  readonly dewpointRisk: SprayOutlookRiskValue;
  readonly weatherCondition: SprayOutlookWeatherCondition;
}

export interface SprayOutlookRisk {
  readonly value: string;
  readonly display: string;
}

export interface SprayOutlookValue {
  readonly value: number | null;
  readonly units: string | null;
}

export interface SprayOutlookDisplayValue {
  readonly display: string;
}

export interface SprayOutlookRiskValue extends SprayOutlookValue {
  readonly risk: SprayOutlookRisk;
}

export interface SprayOutlookWindRiskValue extends SprayOutlookRiskValue, SprayOutlookDisplayValue {
  readonly gust: number | null;
  readonly direction: {
    readonly degrees: number;
    readonly display: string;
    readonly value: string;
  };
}

export interface SprayOutlookWeatherCondition extends SprayOutlookDisplayValue {
  readonly code: number | null;
  readonly symbolic: string | null;
}

export interface SprayOutlookPrecipRisk extends SprayOutlookRiskValue, SprayOutlookDisplayValue {}

export interface SprayOutlookThresholds {
  readonly temperatureInversionRisk?: boolean;
  readonly daytimeOnlyApplication?: boolean;
  readonly rainfreeForecastPeriod?: number | boolean;
  readonly minimumSprayWindow?: number;
  readonly windThresholdUpperLimit?: number | boolean;
  readonly windThresholdLowerLimit?: number | boolean;
  readonly temperatureUpperLimit?: number | boolean;
  readonly temperatureLowerLimit?: number | boolean;
}

export const THRESHOLDS_PARAM_MAP: { readonly [k: string]: string } = {
  temperatureInversionRisk: "tempInversionRisk",
  daytimeOnlyApplication: "dayTimeOnly",
  rainfreeForecastPeriod: "minRainFreeHours",
  minimumSprayWindow: "minSprayWindow",
  windThresholdUpperLimit: "maxWind",
  windThresholdLowerLimit: "minWind",
  temperatureUpperLimit: "maxTemp",
  temperatureLowerLimit: "minTemp",
};

export interface SprayOutlookThreshholdSBoundary {
  readonly units: string;
  readonly value: number | null;
}

export interface SprayOutlookForecast {
  readonly station: SprayOutlookStation;
  readonly nextSprayRecDate?: Date;
  readonly days: ReadonlyArray<SprayOutlookDayOutlook>;
}

export class SprayOutlookApi extends HttpApi {
  fetchObservedAt(
    coordinates: Coordinates,
  ): Observable<{ readonly city: string } & Coordinates & PostalCode> {
    let baseUrl = `${this.baseUrl}/geocode/locations`;
    let queryParams = `?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;

    return this.getJson<
      ReadonlyArray<{
        readonly city: string;
        readonly lat: number;
        readonly lon: number;
        readonly postalCode: string;
      }>
    >(`${baseUrl}${queryParams}`).pipe(
      map(response => response[0]),
      map(r => ({
        latitude: r.lat,
        longitude: r.lon,
        postalCode: r.postalCode,
        city: r.city,
      })),
    );
  }

  fetchSprayOutlookForecast(
    coordinates: Coordinates,
    thresholds: SprayOutlookThresholds,
    days = 5,
  ): Observable<SprayOutlookForecast> {
    let baseUrl = `${this.baseUrl}/weather/spray/outlooks`;
    let thresholdParams = toPairs(thresholds)
      // We dont want to send any query params for these keys if the value is `false` or `undefined`
      .filter(([k, v]) => {
        if (
          k === "windThresholdUpperLimit" ||
          k === "windThresholdLowerLimit" ||
          k === "temperatureUpperLimit" ||
          k === "temperatureLowerLimit"
        ) {
          return v === false || v === undefined ? false : true;
        }
        return true;
      })
      .map(([k, v]) => {
        return `${THRESHOLDS_PARAM_MAP[k]}=${v}`;
      })
      .join("&");
    let queryParams = `?units=${this.units === Units.IMPERIAL ? "us" : "si"}&lat=${
      coordinates.latitude
    }&lon=${coordinates.longitude}&days=${days}&${thresholdParams}`;

    return this.getJson<ReadonlyArray<SprayOutlookForecast>>(`${baseUrl}${queryParams}`).pipe(
      map(([sprayOutlookForecast]) => ({
        station: sprayOutlookForecast.station,
        nextSprayRecDate:
          // @ts-ignore
          sprayOutlookForecast.nextSprayRecDate === ""
            ? undefined
            : //
              // @ts-ignore
              new Date(sprayOutlookForecast.nextSprayRecDate),
        days: sprayOutlookForecast.days.map(d => ({
          ...d,
          sunrise: new Date(d.sunrise),
          sunset: new Date(d.sunset),
          date: new Date(d.date),
          hours: d.hours.map(h => ({
            ...h,
            dateTime: new Date(h.dateTime),
          })),
        })),
      })),
    );
  }

  logWidgetLoad(
    userId: string = "anonymous",
    widgetName: string = "premium-spray-outlook-widget",
    id: string = "",
    type: string,
    host: string,
  ): Observable<unknown> {
    let baseUrl = `${this.baseUrl}/uiwidget/widgets/`;
    let queryParams = `${widgetName}/user`;

    const requestBody = {
      widgetId: widgetName,
      userId,
      source: {
        id,
        type,
        host,
      },
    };
    return this.postJson(`${baseUrl}${queryParams}`, requestBody).pipe(
      map(response => response as unknown),
      catchError(error => {
        return throwError(error);
      }),
    );
  }
}
