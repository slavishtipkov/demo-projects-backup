import "@dtn/polyfills-lib";
import { CreateAdvancedCashBidsChartWidget, createAdvancedCashBidsChartWidget } from "./library";

/* tslint:disable readonly-keyword */
declare global {
  interface Window {
    dtn: {
      cashBids: {
        createAdvancedCashBidsChartWidget: CreateAdvancedCashBidsChartWidget;
      };
    };
  }
}

window.dtn = window.dtn || {};
window.dtn.cashBids = window.dtn.cashBids || {};
window.dtn.cashBids.createAdvancedCashBidsChartWidget = createAdvancedCashBidsChartWidget;
