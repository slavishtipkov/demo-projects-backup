import { Commodities } from "@dtn/api-lib";

export const COOKIE_NAME = "dtnPremiumRequestId";
export const COOKIE_EXPIRES_AFTER_DAYS = 1826;

export const ALL_COMMODITIES: ReadonlyArray<Commodities> = [
  "CANOLA",
  "CATTLE",
  "CORN",
  "COTTON",
  "CRUDE_OIL",
  "DAIRY",
  "DIESEL",
  "FEED_CORN",
  "GASOLINE",
  "HRS_WHEAT",
  "NATURAL_GAS",
  "RICE",
  "SOYBEAN_MEAL",
  "SOYBEANS",
  "SRW_WHEAT",
  "SWINE",
];

export const ERRORS: {
  readonly noDataErrorMessage: {
    readonly key: string;
    readonly value: string;
  };
  readonly wrongConfigMessage: {
    readonly key: string;
    readonly value: string;
  };
  readonly [key: string]: {
    readonly key: string;
    readonly value: string;
  };
} = {
  noDataErrorMessage: {
    key: "noDataErrorMessage",
    value: "Error: No data for the selected commodity.",
  },
  wrongConfigMessage: {
    key: "wrongConfigMessage",
    value:
      "Error: Invalid widget configuration. Make sure that defaultCommodity field is in correct format.",
  },
};

export const TEXT_TYPES: ReadonlyArray<string> = [
  "glossary",
  "understanding",
  "disclaimer",
  "philosophy",
];

export const ICON_MAP: ReadonlyArray<{ readonly key: string; readonly value: string }> = [
  {
    key: "glossary",
    value: "Glossary of Terms",
  },
  {
    key: "understanding",
    value: "Six Factors Overview",
  },
  {
    key: "disclaimer",
    value: "Disclaimer",
  },
  {
    key: "philosophy",
    value: "Philosophy",
  },
];

export const TABS: {
  readonly [key: string]: string;
} = {
  glossary: "Glossary of Terms",
  understanding: "Six Factors Overview",
  disclaimer: "Disclaimer",
  philosophy: "Philosophy",
};

export const TABS_MOBILE: {
  readonly [key: string]: string;
} = {
  glossary: "Glossary",
  understanding: "Six Factors",
  disclaimer: "Disclaimer",
  philosophy: "Philosophy",
};

export const MOBILE_WIDTH = 620;
