import { Moment } from "moment-timezone";

export interface Station {
  readonly stationId: string;
  readonly displayName: string;
}

export interface Coordinates {
  readonly lat?: number;
  readonly lon?: number;
  readonly stationId?: string;
}

export interface PrecipType {
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
  readonly precipitation: ReadonlyArray<PrecipType>;
}

export interface HourlyForecast {
  readonly dewPoint?: number;
  readonly feelsLike?: number;
  readonly heatIndex?: number;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly pressureSeaLevel?: number;
  readonly relativeHumidity?: number;
  readonly snowFall?: number;
  readonly solarDHI?: number;
  readonly solarDNI?: number;
  readonly solarGHI?: number;
  readonly stationId?: string;
  readonly temperature?: number;
  readonly visibility?: number;
  readonly date?: Moment;
  readonly weatherCode?: number;
  readonly weatherDescription?: string;
  readonly windChill?: number;
  readonly windDirection?: number;
  readonly windGust?: number;
  readonly windSpeed?: number;
  readonly precipitationType?: string;
  readonly precipitationAmount?: number;
  readonly probability?: number;
  readonly localTime?: string;
  readonly utcTime?: string;
  readonly precipitation: ReadonlyArray<PrecipType>;
}

export interface ObservedAt {
  readonly city: string;
}

export interface VisibleFields {
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

export interface RequiredVisibleFields {
  readonly day: boolean;
  readonly hour: boolean;
  readonly condition: boolean;
}
