import { Locales, Units, Clock } from "@dtn/i18n-lib";

export interface AppConfig {
  readonly token: string;
  readonly locale: Locales;
  readonly units: Units;
  readonly clock: Clock;
  readonly baseUrl: string;
}

export interface WidgetConfig {
  readonly container: Element | string;
  readonly callbacks?: {};
}

export interface ThemeProp {
  readonly [key: string]: string | number | ReadonlyArray<any> | {};
}

export type WidgetFactory<P extends {}, T = {}, R = {}> = (
  config: AppConfig & WidgetConfig & P & { readonly theme: T; readonly [key: string]: any },
) => R;
