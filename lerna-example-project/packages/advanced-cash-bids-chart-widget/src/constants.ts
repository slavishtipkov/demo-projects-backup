export const ERRORS: {
  readonly noDataErrorMessage: {
    readonly key: string;
    readonly value: string;
  };
  readonly [key: string]: { readonly key: string; readonly value: string };
} = {
  noDataErrorMessage: {
    key: "noDataErrorMessage",
    value: "Error: No Data Available.",
  },
};

export const CHART = {
  CHART_CANVAS_HEIGHT: 380,
  FIRST_CHART_HEIGHT: 220,
  ONLY_ONE_AXIS: 270,
  SECOND_CHART_HEIGHT: 80,
  LINE_SERIES_STROKE_WIDTH: 3,
  CURRENT_CASH_PRICE_COLOR: "#0093D0",
  YR_CURRENT_CASH_PRICE_COLOR: "#707070",
  CURRENT_BASIS_COLOR: "#F6A01A",
  YR_CURRENT_BASIS_COLOR: "#707070",
  PRICE_UP_COLOR: "#00B355",
  PRICE_DOWN_COLOR: "#FF4836",
  PRICE_SAME_COLOR: "#707070",
  BORDER_COLOR: "#bfbfbf",
  AXIS_VALUES_COLOR: "#59595B",
};

export const LOCATIONS: ReadonlyArray<{ readonly key: string; readonly value: string }> = [
  { key: "1", value: "LOCATION 1" },
  { key: "2", value: "LOCATION 2" },
];
