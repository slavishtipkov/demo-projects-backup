import { HttpApi } from "./http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export interface Coordinates {
  readonly lat?: number;
  readonly lon?: number;
  readonly stationId?: string;
}

export interface Timezone {
  readonly timeZone: string;
}

export interface DailyForecast {
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

export interface ObservedAt {
  readonly city: string;
}

export class FiveDayForecastApi extends HttpApi {
  unitsConverter = (units?: string) => {
    return units && units.toLowerCase() === "metric" ? "si" : "us";
  };

  fetchWeatherForecastData(
    coordinates: Coordinates,
    days: number = 5,
    units?: string,
  ): Observable<ReadonlyArray<DailyForecast>> {
    let baseUrl = `${this.baseUrl}/weather/daily-forecasts`;
    let queryParams = coordinates.stationId
      ? `?stationId=${coordinates.stationId}&days=${days}&units=${this.unitsConverter(units)}`
      : `?lat=${coordinates.lat}&lon=${coordinates.lon}&days=${days}&units=${this.unitsConverter(
          units,
        )}`;

    return this.getJson(`${baseUrl}${queryParams}`).pipe(
      map(response => response as ReadonlyArray<DailyForecast>),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  fetchObservedAtData(coordinates: Coordinates): Observable<ObservedAt> {
    let baseUrl = `${this.baseUrl}/geocode/locations`;
    let queryParams = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;

    return this.getJson<ReadonlyArray<ObservedAt>>(`${baseUrl}${queryParams}`).pipe(
      map(response => response[0]),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  fetchTimezone(coordinates: Coordinates): Observable<string> {
    let baseUrl = `${this.baseUrl}/geocode/timezones`;
    let queryParams = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;

    return this.getJson<ReadonlyArray<Timezone>>(`${baseUrl}${queryParams}`).pipe(
      map(response => response[0].timeZone),
      catchError(error => {
        return throwError(error);
      }),
    );
  }
}
