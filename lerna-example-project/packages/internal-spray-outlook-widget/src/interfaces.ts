import { Moment } from "moment-timezone";
import { Views } from "./types";

export interface View {
  readonly view: Views;
  readonly locationName?: string;
  readonly date?: Moment;
}

export interface Location {
  readonly locationName: string;
  readonly stationName: string;
  readonly stationId: string;
  readonly distanceFromStation: string;
  readonly selected: boolean;
}

export interface StationOutlook {
  readonly station: Station;
  readonly location: Location;
  readonly nextSprayRecDate: Moment | null;
  readonly days: ReadonlyArray<DayOutlook>;
}

export interface Station {
  readonly id: string;
  readonly name: string;
  readonly timezoneId: string;
}

export interface DayOutlook {
  readonly date: Moment;
  readonly risk: Risk;
  readonly sunrise: Moment;
  readonly sunset: Moment;
  readonly hours: ReadonlyArray<HourOutlook>;
}

export interface HourOutlook {
  readonly dateTime: Moment;
  readonly risk: Risk;
  readonly type: string;
  readonly daylight: boolean;
  readonly precipRisk: PrecipRisk;
  readonly precipFreePeriodRisk: any;
  readonly windRisk: WindRiskValue;
  readonly temperatureRisk: RiskValue;
  readonly inversionRisk: RiskValue;
  readonly dewpointRisk: RiskValue;
  readonly weatherCondition: WeatherCondition;
}

export interface Risk {
  readonly value: string;
  readonly display: string;
}

export interface Value {
  readonly value: number | null;
  readonly units: string | null;
}

export interface DisplayValue {
  readonly display: string;
}

export interface RiskValue extends Value {
  readonly risk: Risk;
}

export interface WindRiskValue extends RiskValue, DisplayValue {
  readonly gust: number | null;
  readonly direction: string;
}

export interface WeatherCondition extends DisplayValue {
  readonly code: number;
  readonly symbolic: string | null;
}

export interface PrecipRisk extends RiskValue, DisplayValue {}

export interface GetThresholdSettings {
  readonly id?: number;
  readonly dayOnlyApplication: boolean;
  readonly minSprayWindow: number;
  readonly rainfreeForecastPeriod: number | null;
  readonly temperatureInversionRisk: boolean;
  readonly temperatureGreaterThan: ThreshholdSettingsBoundary;
  readonly temperatureLessThan: ThreshholdSettingsBoundary;
  readonly windGreaterThan: ThreshholdSettingsBoundary;
  readonly windLessThan: ThreshholdSettingsBoundary;
}

export interface ThreshholdSettingsBoundary {
  readonly units: string;
  readonly value: number | null;
}

export interface ThresholdSettings {
  readonly id?: number;
  readonly dayOnlyApplication: boolean;
  readonly rainfreeForecastPeriod: number | null;
  readonly minSprayWindow: number;
  readonly temperatureInversionRisk: boolean;
  readonly temperatureGreaterThan: number | null;
  readonly temperatureLessThan: number | null;
  readonly windGreaterThan: number | null;
  readonly windLessThan: number | null;
}
