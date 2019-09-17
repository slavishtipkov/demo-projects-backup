import "@dtn/polyfills-lib";
import { CreateLocalWeatherWidget, createLocalWeatherWidget } from "./library";

/* tslint:disable readonly-keyword */
declare global {
  interface Window {
    dtn: {
      localWeather: {
        createLocalWeatherWidget: CreateLocalWeatherWidget;
      };
    };
  }
}

window.dtn = window.dtn || {};
window.dtn.localWeather = window.dtn.localWeather || {};
window.dtn.localWeather.createLocalWeatherWidget = createLocalWeatherWidget;
