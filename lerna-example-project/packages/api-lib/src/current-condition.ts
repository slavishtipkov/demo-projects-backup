import { HttpApi } from "./http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ZipCodeDataObject } from "./zip-code";

export interface CoordinatesParams {
  readonly lat?: number;
  readonly lon?: number;
  readonly stationId?: string;
}

export interface ObservedAtParams {
  readonly city: string;
}

export interface TimezoneParams {
  readonly timeZone: string;
}

export interface HourlySurfaceData {
  readonly stationId: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly localTime: string;
  readonly utcTime: string;
  readonly weatherCode: number;
  readonly weatherDescription: string;
  readonly temperature: number;
  readonly precipitation: [
    {
      readonly amount: number;
      readonly type: string;
    }
  ];
  readonly dewPoint: number;
  readonly feelsLike: number;
  readonly heatIndex: number;
  readonly pressureSeaLevel: number;
  readonly relativeHumidity: number;
  readonly visibility: number;
  readonly wetbulbTemp: number;
  readonly windChill: number;
  readonly windDirection: number;
  readonly windGust: number;
  readonly windSpeed: number;
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
  readonly lat: number;
  readonly lon: number;
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

export class CurrentConditionApi extends HttpApi {
  fetchHourlyForecastsByObservation(
    coordinates: CoordinatesParams,
    units?: string,
  ): Observable<ReadonlyArray<HourlySurfaceData>> {
    let baseUrl = `${this.baseUrl}/weather/hourly-observations`;
    let unitKey = units && units.toLowerCase() === "metric" ? "si" : "us";
    let queryString = "?";
    queryString += coordinates.stationId
      ? `stationId=${coordinates.stationId}`
      : `lat=${coordinates.lat}&lon=${coordinates.lon}`;
    queryString += units ? `&units=${unitKey}` : "";

    return this.getJson(`${baseUrl}${queryString}`).pipe(
      map(response => response as ReadonlyArray<HourlySurfaceData>),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  fetchDailyForecastsByForecast(
    coordinates: CoordinatesParams,
    days: number = 1,
    units?: string,
  ): Observable<ReadonlyArray<DailySurfaceData>> {
    let baseUrl = `${this.baseUrl}/weather/daily-forecasts`;
    let unitKey = units && units.toLowerCase() === "metric" ? "si" : "us";
    let queryString = "?";
    queryString += coordinates.stationId
      ? `stationId=${coordinates.stationId}`
      : `lat=${coordinates.lat}&lon=${coordinates.lon}`;
    queryString += days ? `&days=${days}` : "&days=1";
    queryString += units ? `&units=${unitKey}` : "";

    return this.getJson(`${baseUrl}${queryString}`).pipe(
      map(response => response as ReadonlyArray<DailySurfaceData>),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  fetchObservedAtData(coordinates: CoordinatesParams): Observable<ObservedAtParams> {
    let baseUrl = `${this.baseUrl}/geocode/locations`;
    let queryParams = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;

    return this.getJson<ReadonlyArray<ObservedAtParams>>(`${baseUrl}${queryParams}`).pipe(
      map(response => response[0]),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  fetchTimezone(coordinates: CoordinatesParams): Observable<string> {
    let baseUrl = `${this.baseUrl}/geocode/timezones`;
    let queryParams = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;

    return this.getJson<ReadonlyArray<TimezoneParams>>(`${baseUrl}${queryParams}`).pipe(
      map(response => response[0].timeZone),
      catchError(error => {
        return throwError(error);
      }),
    );
  }
}
