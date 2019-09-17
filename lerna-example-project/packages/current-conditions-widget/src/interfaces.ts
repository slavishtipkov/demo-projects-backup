import { Moment } from "moment-timezone";

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
  readonly date: Moment;
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
  readonly precipitation: ReadonlyArray<{
    readonly type: string;
    readonly amount: number;
    readonly probability: number;
  }>;
  readonly snowAmount: number;
  readonly stationId: string;
  readonly sunrise: Moment;
  readonly sunset: Moment;
  readonly weatherCode: number;
  readonly weatherDescription: string;
  readonly probability: number;
  readonly windDirection: number;
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

export interface ObservedAt {
  readonly city: string;
}

export interface Coordinates {
  readonly lat?: number;
  readonly lon?: number;
  readonly stationId?: string;
}

export interface FullDate {
  readonly dayOfWeekFull: string;
  readonly month: string;
  readonly day: string;
}
