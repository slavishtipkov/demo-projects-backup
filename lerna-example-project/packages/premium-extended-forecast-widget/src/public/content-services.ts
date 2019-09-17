import "@dtn/polyfills-lib";
import {
  CreatePremiumExtendedForecastWidget,
  createPremiumExtendedForecastWidget,
} from "./library";

/* tslint:disable readonly-keyword */
declare global {
  interface Window {
    dtn: {
      forecast: {
        createPremiumExtendedForecastWidget: CreatePremiumExtendedForecastWidget;
      };
    };
  }
}

window.dtn = window.dtn || {};
window.dtn.forecast = window.dtn.forecast || {};
window.dtn.forecast.createPremiumExtendedForecastWidget = createPremiumExtendedForecastWidget;
