import "@dtn/polyfills-lib";
import { CreateFuturesChartWidget, createFuturesChartWidget } from "./library";

/* tslint:disable readonly-keyword */
declare global {
  interface Window {
    dtn: {
      futures: {
        createFuturesChartWidget: CreateFuturesChartWidget;
      };
    };
  }
}

window.dtn = window.dtn || {};
window.dtn.futures = window.dtn.futures || {};
window.dtn.futures.createFuturesChartWidget = createFuturesChartWidget;
