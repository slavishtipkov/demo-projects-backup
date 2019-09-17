import "@dtn/polyfills-lib";
import { CreateCashBidsChartWidget, createCashBidsChartWidget } from "./library";

/* tslint:disable readonly-keyword */
declare global {
  interface Window {
    dtn: {
      cashBids: {
        createCashBidsChartWidget: CreateCashBidsChartWidget;
      };
    };
  }
}

window.dtn = window.dtn || {};
window.dtn.cashBids = window.dtn.cashBids || {};
window.dtn.cashBids.createCashBidsChartWidget = createCashBidsChartWidget;
