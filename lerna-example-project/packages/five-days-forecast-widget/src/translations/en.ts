import { numberOfDaysAllowed } from "../constants";

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
  common: {
    observed: "Observed",
    updated: "Updated",
    at: "at",
    in: "on",
    on: "on",
  },
  errors: {
    invalidCoordinatesMessage:
      "Error: Invalid coordinates. Latitude should be a number in the range from -90 to 90. Longitude should be a number in the range from -180 to 180.",
    noDataErrorMessage: "Error: No weather forecast data for the selected coordinates.",
    numberOfDaysAllowedErrorMessage: `Error: Maximum allowed days for fetching data is ${numberOfDaysAllowed}.`,
  },
};
