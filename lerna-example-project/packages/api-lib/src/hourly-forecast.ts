import { HttpApi } from "./http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export interface CoordinatesDataObject {
  readonly lat?: number;
  readonly lon?: number;
  readonly stationId?: string;
}

export interface HourlyPrecipType {
  readonly type: string;
  readonly amount: number;
  readonly probability: number;
}

export interface DayForecast {
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
  readonly probability: number;
  readonly precipitation: ReadonlyArray<HourlyPrecipType>;
}

export interface HourlyForecast {
  readonly dewPoint: number;
  readonly feelsLike: number;
  readonly heatIndex: number;
  readonly latitude: number;
  readonly longitude: number;
  readonly pressureSeaLevel: number;
  readonly relativeHumidity: number;
  readonly snowFall: number;
  readonly solarDHI: number;
  readonly solarDNI: number;
  readonly solarGHI: number;
  readonly stationId: string;
  readonly temperature: number;
  readonly visibility: number;
  readonly date: string;
  readonly weatherCode: number;
  readonly weatherDescription: string;
  readonly windChill: number;
  readonly windDirection: number;
  readonly windGust: number;
  readonly windSpeed: number;
  readonly precipitationType: string;
  readonly precipitationAmount: number;
  readonly probability: number;
  readonly localTime: string;
  readonly utcTime: string;
  readonly precipitation: ReadonlyArray<HourlyPrecipType>;
}

export interface HourlyObservedAt {
  readonly city: string;
}

export interface TimezoneDataResponse {
  readonly lat: number;
  readonly lon: number;
  readonly timeZone: string;
}

export class HourlyForecastApi extends HttpApi {
  unitsConverter = (units?: string) => {
    return units && units.toLowerCase() === "metric" ? "si" : "us";
  };

  premiumHourlyWeatherRequest(
    user: string,
    widgetName: string = "local-weather-premium",
    id: string,
    type: string,
    host: string,
  ): Observable<unknown> {
    let baseUrl = `${this.baseUrl}/uiwidget/widgets/`;
    let queryParams = `${widgetName}/user`;
    const requestBody = {
      widgetId: widgetName,
      userId: user,
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

  fetchHourlyWeatherForecastData(
    coordinates: CoordinatesDataObject,
    days: number = 1,
    units?: string,
  ): Observable<ReadonlyArray<HourlyForecast>> {
    let baseUrl = `${this.baseUrl}/weather/hourly-forecasts`;
    let queryParams = coordinates.stationId
      ? `?stationId=${coordinates.stationId}&days=${days}&units=${this.unitsConverter(units)}`
      : `?lat=${coordinates.lat}&lon=${coordinates.lon}&days=${days}&units=${this.unitsConverter(
          units,
        )}`;
    return this.getJson(`${baseUrl}${queryParams}`).pipe(
      map(response => response as ReadonlyArray<HourlyForecast>),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  fetchDayForecastData(
    coordinates: CoordinatesDataObject,
    days: number = 2,
    units?: string,
  ): Observable<ReadonlyArray<DayForecast>> {
    let baseUrl = `${this.baseUrl}/weather/daily-forecasts`;
    let queryParams = coordinates.stationId
      ? `?stationId=${coordinates.stationId}&days=${days}&units=${this.unitsConverter(units)}`
      : `?lat=${coordinates.lat}&lon=${coordinates.lon}&days=${days}&units=${this.unitsConverter(
          units,
        )}`;
    return this.getJson(`${baseUrl}${queryParams}`).pipe(
      map(response => response as ReadonlyArray<DayForecast>),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  fetchTimezoneByCoordinates(coordinates: CoordinatesDataObject): Observable<string> {
    let baseUrl = `${this.baseUrl}/geocode/timezones`;
    let queryParams = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;
    return this.getJson<ReadonlyArray<TimezoneDataResponse>>(`${baseUrl}${queryParams}`).pipe(
      map(response => response[0].timeZone),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  fetchObservedAtData(coordinates: CoordinatesDataObject): Observable<HourlyObservedAt> {
    let baseUrl = `${this.baseUrl}/geocode/locations`;
    let queryParams = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;

    return this.getJson<ReadonlyArray<HourlyObservedAt>>(`${baseUrl}${queryParams}`).pipe(
      map(response => response[0]),
      catchError(error => {
        return throwError(error);
      }),
    );
  }
}
