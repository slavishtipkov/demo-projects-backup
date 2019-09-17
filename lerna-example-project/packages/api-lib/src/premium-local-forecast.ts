import { HttpApi } from "./http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export interface CoordinatesData {
  readonly lat?: number;
  readonly lon?: number;
  readonly stationId?: string;
}

export interface HourlyObservationData {
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

export interface DailyForecastData {
  readonly avgDewPoint: number;
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
  readonly probability: number;
  readonly snowAmount: number;
  readonly stationId: string;
  readonly sunrise: string;
  readonly sunset: string;
  readonly weatherCode: number;
  readonly weatherDescription: string;
}

export interface ObservedData {
  readonly city: string;
}

export interface TimezoneData {
  readonly lat: number;
  readonly lon: number;
  readonly timeZone: string;
}

export class PremiumLocalForecastApi extends HttpApi {
  unitsConverter = (units?: string) => {
    return units && units.toLowerCase() === "metric" ? "si" : "us";
  };

  fetchWeatherForecastData(
    coordinates: CoordinatesData,
    days: number = 10,
    units?: string,
  ): Observable<ReadonlyArray<DailyForecastData>> {
    let baseUrl = `${this.baseUrl}/weather/daily-forecasts`;
    let queryParams = coordinates.stationId
      ? `?stationId=${coordinates.stationId}&days=${days}&units=${this.unitsConverter(units)}`
      : `?lat=${coordinates.lat}&lon=${coordinates.lon}&days=${days}&units=${this.unitsConverter(
          units,
        )}`;

    return this.getJson(`${baseUrl}${queryParams}`).pipe(
      map(response => response as ReadonlyArray<DailyForecastData>),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  fetchHourlyObservationData(
    coordinates: CoordinatesData,
    units?: string,
  ): Observable<ReadonlyArray<HourlyObservationData>> {
    let baseUrl = `${this.baseUrl}/weather/hourly-observations`;
    let queryParams = coordinates.stationId
      ? `?stationId=${coordinates.stationId}&units=${this.unitsConverter(units)}`
      : `?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${this.unitsConverter(units)}`;

    return this.getJson(`${baseUrl}${queryParams}`).pipe(
      map(response => response as ReadonlyArray<HourlyObservationData>),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  fetchTimezoneDataByCoordinates(coordinates: CoordinatesData): Observable<string> {
    let baseUrl = `${this.baseUrl}/geocode/timezones`;
    let queryParams = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;
    return this.getJson<ReadonlyArray<TimezoneData>>(`${baseUrl}${queryParams}`).pipe(
      map(response => response[0].timeZone),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  fetchObservedAtData(coordinates: CoordinatesData): Observable<ObservedData> {
    let baseUrl = `${this.baseUrl}/geocode/locations`;
    let queryParams = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;

    return this.getJson<ReadonlyArray<ObservedData>>(`${baseUrl}${queryParams}`).pipe(
      map(response => response[0]),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  premiumWeatherForecastRequest(
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
}
