export const numberOfDaysAllowed = 15;

export const ERRORS: {
  readonly noDataErrorMessage: {
    readonly key: string;
    readonly value: string;
  };
  readonly numberOfDaysAllowedErrorMessage: {
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
  numberOfDaysAllowedErrorMessage: {
    key: "numberOfDaysAllowedErrorMessage",
    value: `Error: Maximum allowed days for fetching data is ${numberOfDaysAllowed}.`,
  },
  invalidCoordinatesMessage: {
    key: "invalidCoordinatesMessage",
    value:
      "Error: Invalid coordinates. Latitude should be a number in the range from -90 to 90. Longitude should be a number in the range from -180 to 180.",
  },
};
