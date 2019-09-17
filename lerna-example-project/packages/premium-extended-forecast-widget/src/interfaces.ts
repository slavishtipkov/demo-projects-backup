import { Moment } from "moment-timezone";

export interface Coordinates {
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

export interface DailyForecast {
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
  readonly probability: number;
  readonly snowAmount: number;
  readonly stationId: string;
  readonly sunrise: Moment;
  readonly sunset: Moment;
  readonly weatherCode: number;
  readonly weatherDescription: string;
  readonly windDirection: number;
  readonly precipitation: ReadonlyArray<Precipitation>;
}

export interface Precipitation {
  readonly type: string;
  readonly amount: number;
  readonly probability: number;
}

export interface PrecipitationUI {
  readonly precipType: string;
  readonly precipAmount: string;
  readonly precipChance: string;
}

export interface ObservedAt {
  readonly city: string;
}

export interface UnitsMetrics {
  readonly temperature: string;
  readonly distance: string;
  readonly speed: string;
  readonly amount: string;
  readonly pressure: string;
}

export interface ShortDate {
  readonly month: string;
  readonly day: string;
}

export interface FullDate {
  readonly dayOfWeekFull: string;
  readonly month: string;
  readonly day: string;
}

export interface Station {
  readonly stationId: string;
  readonly displayName: string;
}
