import "@dtn/polyfills-lib";
import { CreatePremiumHourlyForecastWidget, createPremiumHourlyForecastWidget } from "./library";

/* tslint:disable readonly-keyword */
declare global {
  interface Window {
    dtn: {
      forecast: {
        createPremiumHourlyForecastWidget: CreatePremiumHourlyForecastWidget;
      };
    };
  }
}

window.dtn = window.dtn || {};
window.dtn.forecast = window.dtn.forecast || {};
window.dtn.forecast.createPremiumHourlyForecastWidget = createPremiumHourlyForecastWidget;
