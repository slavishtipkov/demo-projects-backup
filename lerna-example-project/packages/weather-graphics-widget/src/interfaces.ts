export interface MapsConfigInterface {
  readonly "US Severe Weather Risk"?: boolean;
  readonly "US Forecast High Temperatures"?: boolean;
  readonly "US Forecast Low Temperatures"?: boolean;
  readonly "NA Forecast High Temperatures"?: boolean;
  readonly "NA Forecast Low Temperatures"?: boolean;
  readonly "US Surface Weather Forecast"?: boolean;
  readonly "NA Surface Weather Forecast"?: boolean;
  readonly [key: string]: boolean | undefined;
}
