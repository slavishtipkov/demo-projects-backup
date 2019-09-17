import { MAX_MIN_TEMP_SETTINGS } from "../constants";

export default {
  days: {
    today: "Today",
    Mon: "Mon",
    Tue: "Tue",
    Wed: "Wed",
    Thu: "Thu",
    Fri: "Fri",
    Sat: "Sat",
    Sun: "Sun",
  },
  noRecommendedSprayTime: "No Recommended Spray Time",
  common: {
    observed: "Observed",
    updated: "Updated",
    at: "at",
    in: "on",
    on: "on",
    nextSprayLabel: "Next Spray Window",
    settings: {
      header: "Settings",
      windThresholdsLabel: "Wind thresholds",
      temperatureLabel: "Temperature",
      minSprayWindowLabel: "Minimum Spray Window",
      rainFreeForecastPeriodLabel: "Rainfree forecast Period",
      consecutiveHours: "Consecutive Hour(s)",
      upperLimit: "Upper Limit",
      lowerLimit: "Lower Limit",
      tempInversionRiskLabel: "Temperature Inversion Risk",
      dayTimeOnlyLabel: "Daytime Only Applications",
      cancel: "Cancel",
      apply: "Apply",
    },
  },
  tooltip: {
    title: "Outlook Color Clarification",
    captions: {
      red: "Red = Poor spray conditions",
      yellow: "Yellow = Marginal spray conditions",
      green: "Green = Good spray conditions",
      gray: "Gray/Neutral = Unable to calculate",
    },
    content: {
      red:
        "Chance of precipitation is likely (exceeds 50%) or conditions for spraying outside of one or more of user's established thresholds",
      yellow:
        "Chance of precipitation is possible (chance between 20% and 50%) or, based on user's thresholds, wind gusts exceed the defined upper limit or temperature inversions are possible.",
      green:
        "Precipitation is unlikely and conditions for spraying are within user's established thresholds",
      gray: "Unable to evaluate Spray Outlook conditions due to missing data",
    },
  },
  labels: {
    hourlySprayOutlook: "Hourly Spray Outlook",
    inversionRisk: "Inversion Risk",
    precipitationRisk: "Precipitation Risk",
    windDirectionSpeed: "Wind Direction Speed",
    weatherTempDewPt: "Weather Temp / Dew Pt",
  },
  errors: {
    invalidCoordinatesMessage:
      "Error: Invalid coordinates. Latitude should be a number in the range from -90 to 90. Longitude should be a number in the range from -180 to 180.",
    noDataErrorMessage: "Error: No weather forecast data for the selected coordinates.",
    invalidTempMessageImperial: `The upper limit cannot be lower than the lower limit. The upper limit cannot exceed ${
      MAX_MIN_TEMP_SETTINGS.imperial.max
    } or the lower limit cannot be below ${MAX_MIN_TEMP_SETTINGS.imperial.min}.`,
    invalidTempMessageMetric: `The upper limit cannot be lower than the lower limit. The upper limit cannot exceed ${
      MAX_MIN_TEMP_SETTINGS.metric.max
    } or the lower limit cannot be below ${MAX_MIN_TEMP_SETTINGS.metric.min}.`,
    invalidUpperLimitNumberMessage: "The upper limit must be numeric value.",
    invalidLowerLimitNumberMessage: "The lower limit must be numeric value.",
    invalidWindNumberMessage: "The upper limit cannot be lower than the lower limit",
  },
};
