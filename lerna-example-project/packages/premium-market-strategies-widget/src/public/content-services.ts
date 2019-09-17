import "@dtn/polyfills-lib";
import {
  CreatePremiumMarketStrategiesWidget,
  createPremiumMarketStrategiesWidget,
} from "./library";

/* tslint:disable readonly-keyword */
declare global {
  interface Window {
    dtn: {
      marketStrategies: {
        createPremiumMarketStrategiesWidget: CreatePremiumMarketStrategiesWidget;
      };
    };
  }
}

window.dtn = window.dtn || {};
window.dtn.marketStrategies = window.dtn.marketStrategies || {};
window.dtn.marketStrategies.createPremiumMarketStrategiesWidget = createPremiumMarketStrategiesWidget;
