import "@dtn/polyfills-lib";
import { CreateWeatherGraphicsWidget, createWeatherGraphicsWidget } from "./library";

/* tslint:disable readonly-keyword */
declare global {
  interface Window {
    dtn: {
      map: {
        createWeatherGraphicsWidget: CreateWeatherGraphicsWidget;
      };
    };
  }
}

window.dtn = window.dtn || {};
window.dtn.map = window.dtn.map || {};
window.dtn.map.createWeatherGraphicsWidget = createWeatherGraphicsWidget;
