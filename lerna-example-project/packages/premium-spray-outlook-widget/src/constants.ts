import { Units } from "@dtn/i18n-lib";
import { SprayOutlookThresholds } from "@dtn/api-lib";

export const ERRORS: {
  readonly noDataErrorMessage: {
    readonly key: string;
    readonly value: string;
  };
  readonly invalidCoordinatesMessage: {
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
    value: "Error: No weather forecast data for the selected coordinates.",
  },
  invalidCoordinatesMessage: {
    key: "invalidCoordinatesMessage",
    value:
      "Error: Invalid coordinates. Latitude should be a number in the range from -90 to 90. Longitude should be a number in the range from -180 to 180.",
  },
};

export const COOKIE_NAME = "dtnPremiumRequestId";
export const COOKIE_EXPIRES_AFTER_DAYS = 1826;
export const ICON_RISC_COLORS: {
  readonly [key: string]: string;
} = {
  low: "#00b355",
  medium: "#d5c453",
  high: "#ea4636",
  "n/a": "#59595b",
};
export const WEATHER_CONDITIONS: {
  readonly [key: string]: string;
} = {
  low: "Clear",
  medium: "Caution",
  high: "Warning",
};

export const WIND_DIR_ICON_ROTATION: {
  readonly [key: string]: number;
} = {
  W: 0,
  NW: 45,
  N: 90,
  NE: 135,
  E: 180,
  SE: 225,
  SW: 315,
  S: 270,
};

export const DEFAULT_THRESHOLDS: { readonly [u in Units]: SprayOutlookThresholds } = {
  [Units.IMPERIAL]: {
    temperatureInversionRisk: true,
    daytimeOnlyApplication: false,
    rainfreeForecastPeriod: 10,
    minimumSprayWindow: 3,
    windThresholdUpperLimit: 10,
    windThresholdLowerLimit: 3,
    temperatureUpperLimit: 86,
    temperatureLowerLimit: 50,
  },
  [Units.METRIC]: {
    temperatureInversionRisk: true,
    daytimeOnlyApplication: false,
    rainfreeForecastPeriod: 10,
    minimumSprayWindow: 3,
    windThresholdUpperLimit: 16,
    windThresholdLowerLimit: 5,
    temperatureUpperLimit: 30,
    temperatureLowerLimit: 10,
  },
};

export const DEFAULT_DROPDOWN_SETTINGS: { readonly [k in Units]: any } = {
  [Units.IMPERIAL]: {
    maxWindThresholdDropdownOptions: {
      min: 1,
      max: 20,
    },
    minWindThresholdDropdownOptions: {
      min: 0,
      max: 20,
    },
    sprayWindowDropdownOptions: {
      min: 1,
      max: 10,
    },
    rainFreeDropdownOptions: {
      min: 1,
      max: 24,
    },
  },
  [Units.METRIC]: {
    maxWindThresholdDropdownOptions: {
      min: 1,
      max: 32,
    },
    minWindThresholdDropdownOptions: {
      min: 0,
      max: 32,
    },
    sprayWindowDropdownOptions: {
      min: 1,
      max: 10,
    },
    rainFreeDropdownOptions: {
      min: 1,
      max: 24,
    },
  },
};

export const MAX_MIN_TEMP_SETTINGS: {
  readonly [key: string]: any;
} = {
  imperial: {
    min: -70,
    max: 130,
  },
  metric: {
    min: -56,
    max: 54,
  },
};
