import "@dtn/polyfills-lib";
import { CreateAdvancedFuturesChartWidget, createAdvancedFuturesChartWidget } from "./library";

/* tslint:disable readonly-keyword */
declare global {
  interface Window {
    dtn: {
      futures: {
        createAdvancedFuturesChartWidget: CreateAdvancedFuturesChartWidget;
      };
    };
  }
}

window.dtn = window.dtn || {};
window.dtn.futures = window.dtn.futures || {};
window.dtn.futures.createAdvancedFuturesChartWidget = createAdvancedFuturesChartWidget;
