import "@dtn/polyfills-lib";
import { createWeatherTrendWidget, CreateWeatherTrendWidget } from "./library";

/* tslint:disable readonly-keyword */
declare global {
  interface Window {
    dtn: {
      weather: {
        createWeatherTrendWidget: CreateWeatherTrendWidget;
      };
    };
  }
}

window.dtn = window.dtn || {};
window.dtn.weather = window.dtn.weather || {};
window.dtn.weather.createWeatherTrendWidget = createWeatherTrendWidget;
