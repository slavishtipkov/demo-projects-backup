import "@dtn/polyfills-lib";
import { CreatePremiumSprayOutlookWidget, createPremiumSprayOutlookWidget } from "./library";

/* tslint:disable readonly-keyword */
declare global {
  interface Window {
    dtn: {
      sprayOutlook: {
        createPremiumSprayOutlookWidget: CreatePremiumSprayOutlookWidget;
      };
    };
  }
}

window.dtn = window.dtn || {};
window.dtn.sprayOutlook = window.dtn.sprayOutlook || {};
window.dtn.sprayOutlook.createPremiumSprayOutlookWidget = createPremiumSprayOutlookWidget;
