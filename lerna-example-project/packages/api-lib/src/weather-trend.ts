import * as moment from "moment-timezone";
import { HttpApi, ApiResponse, ApiResponseWithHeaders } from "./http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Units } from "@dtn/i18n-lib";

export interface ObservedPreciptiation {
  readonly type: "RAIN" | "SNOW" | "SLEET" | "HAIL" | "FREEZING RAIN";
  readonly amount: number;
}

export interface ForecastedPreciptiation {
  readonly type: "RAIN" | "SNOW" | "SLEET" | "HAIL" | "FREEZING RAIN";
  readonly amount: number;
}

export interface ObservedSoil {
  readonly depth: number;
  readonly maxTemperature: number;
  readonly minTemperature: number;
  readonly avgTemperature: number;
  readonly maxMoisture: number;
  readonly minMouseture: number;
  readonly avgMoisture: number;
}

export interface ForecastedSoil {
  readonly depth: number;
  readonly maxTemperature: number;
  readonly minTemperature: number;
  readonly avgTemperature: number;
  readonly maxMoisture: number;
  readonly minMouseture: number;
  readonly avgMoisture: number;
}

interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface DailyForecast extends Coordinates {
  readonly stationId: string;
  readonly date: Date;
  readonly sunrise: Date;
  readonly sunset: Date;
  readonly weatherCode: number;
  readonly weatherDescription: string;
  readonly precipitation: ReadonlyArray<ForecastedPreciptiation>;
  readonly avgDewPoint: number;
  readonly avgPressure: string;
  readonly avgRelativeHumidity: number;
  readonly avgSoilTemp: number;
  readonly avgTemperature: number;
  readonly avgWetBulbTemp: number;
  readonly cloudCoverPercent: number;
  readonly cornHeatUnit: number;
  readonly maxSoilTemp: number;
  readonly maxTemperature: number;
  readonly minSoilTemp: number;
  readonly minTemperature: number;
  readonly avgHeatIndex: number;
  readonly maxHeatIndex: number;
  readonly minHeatIndex: number;
  readonly avgWindChill: number;
  readonly maxWindChill: number;
  readonly minWindChill: number;
  readonly maxFeelsLike: number;
  readonly minFeelsLike: number;
  readonly avgFeelsLike: number;
  readonly maxWindSpeed: number;
  readonly avgWindSpeed: number;
  readonly windDirection: number;
  readonly evapotranspiration: number;
  readonly avgWetBulbGlobeTemp: number;
  readonly maxWetBulbGlobeTemp: number;
  readonly minWetBulbGlobeTemp: number;
  readonly avgSoilMoisture: number;
  readonly maxSoilMoisture: number;
  readonly minSoilMoisture: number;
  readonly growingDegreeDay: number;
  readonly minutesOfSunshine: number;
  readonly soil: ReadonlyArray<ForecastedSoil> | null;
}

export interface DailyObservation extends Coordinates {
  readonly stationId: string;
  readonly date: Date;
  readonly sunrise: Date;
  readonly sunset: Date;
  readonly weatherCode: number;
  readonly weatherDescription: string;
  readonly precipitation: ReadonlyArray<ObservedPreciptiation>;
  readonly avgDewPoint: number;
  readonly avgPressure: string;
  readonly avgRelativeHumidity: number;
  readonly avgSoilTemp: number;
  readonly avgTemperature: number;
  readonly avgWetBulbTemp: number;
  readonly cloudCoverPercent: number;
  readonly cornHeatUnit: number;
  readonly maxSoilTemp: number;
  readonly maxTemperature: number;
  readonly minSoilTemp: number;
  readonly minTemperature: number;
  readonly avgHeatIndex: number;
  readonly maxHeatIndex: number;
  readonly minHeatIndex: number;
  readonly avgWindChill: number;
  readonly maxWindChill: number;
  readonly minWindChill: number;
  readonly maxFeelsLike: number;
  readonly minFeelsLike: number;
  readonly avgFeelsLike: number;
  readonly maxWindSpeed: number;
  readonly avgWindSpeed: number;
  readonly windDirection: number;
  readonly evapotranspiration: number;
  readonly avgWetBulbGlobeTemp: number;
  readonly maxWetBulbGlobeTemp: number;
  readonly minWetBulbGlobeTemp: number;
  readonly avgSoilMoisture: number;
  readonly maxSoilMoisture: number;
  readonly minSoilMoisture: number;
  readonly growingDegreeDay: number;
  readonly minutesOfSunshine: number;
  readonly soil: ReadonlyArray<ObservedSoil> | null;
}

export class WeatherTrendApi extends HttpApi {
  fetchDailyForecast = (
    { latitude, longitude }: Coordinates,
    days = 1,
  ): Observable<ReadonlyArray<DailyForecast>> => {
    let baseUrl = `${this.baseUrl}/weather/daily-forecasts`;
    let queryParams =
      `?units=${this.units === Units.IMPERIAL ? "us" : "si"}` +
      `&lat=${latitude}` +
      `&lon=${longitude}` +
      `&days=${days}`;

    return this.getJson<ReadonlyArray<DailyForecast>>(`${baseUrl}${queryParams}`).pipe(
      map(dailyForecasts => {
        return dailyForecasts.map(d => ({
          ...d,
          date: new Date(d.date),
          sunrise: new Date(d.sunrise),
          sunset: new Date(d.sunset),
        }));
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  };

  fetchDailyObservation = (
    { latitude, longitude }: Coordinates,
    days = 60,
  ): Observable<ReadonlyArray<DailyObservation>> => {
    let baseUrl = `${this.baseUrl}/weather/daily-observations`;
    let queryParams =
      `?units=${this.units === Units.IMPERIAL ? "us" : "si"}` +
      `&lat=${latitude}` +
      `&lon=${longitude}` +
      `&days=${days}`;

    return this.getJson<ReadonlyArray<DailyObservation>>(`${baseUrl}${queryParams}`).pipe(
      map(dailyObservations => {
        return dailyObservations.map(d => ({
          ...d,
          date: new Date(d.date),
          sunrise: new Date(d.sunrise),
          sunset: new Date(d.sunset),
        }));
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  };
}
