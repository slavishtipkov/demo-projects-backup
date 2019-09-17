export const ERRORS: {
  readonly [key: string]: { readonly key?: string; readonly value?: string };
} = {};

export const colorPalette = {
  axis: "#59595B",
  grid: "#59595B",
  series: ["#0093D0"],
  indicator: {
    same: "#59595B",
    up: "#00B259",
    down: "#FF4836",
  },
};

export const INTERVALS_DICTIONARY: {
  readonly [key: string]: { readonly key: string; readonly duration: string };
} = {
  mi: { key: "Mi", duration: "2-D" },
  "1-mi": { key: "Mi", duration: "2-D" },
  "5-mi": { key: "5-Mi", duration: "2-D" },
  "15-mi": { key: "15-Mi", duration: "1-W" },
  "30-mi": { key: "30-Mi", duration: "2-W" },
  "60-mi": { key: "60-Mi", duration: "1-M" },
  d: { key: "D", duration: "3-M" },
  "1-d": { key: "D", duration: "3-M" },
  w: { key: "W", duration: "12-M" },
  "1-w": { key: "W", duration: "12-M" },
  m: { key: "M", duration: "12-M" },
  "1-m": { key: "M", duration: "12-M" },
};

export const DROPDOWN_OPTIONS_DICTIONARY: {
  readonly [key: string]: ReadonlyArray<{ readonly key: string; readonly value: string }>;
} = {
  mi: [{ key: "2-D", value: "2 Days" }],
  "1-mi": [{ key: "2-D", value: "2 Days" }],
  "5-mi": [{ key: "2-D", value: "2 Days" }],
  "15-mi": [{ key: "1-W", value: "1 Week" }],
  "30-mi": [{ key: "2-W", value: "2 Weeks" }],
  "60-mi": [{ key: "1-M", value: "1 Month" }],
  d: [
    { key: "3-M", value: "3 Months" },
    { key: "6-M", value: "6 Months" },
    { key: "12-M", value: "1 Year" },
    { key: "60-M", value: "5 Years" },
  ],
  "1-d": [
    { key: "3-M", value: "3 Months" },
    { key: "6-M", value: "6 Months" },
    { key: "12-M", value: "1 Year" },
    { key: "60-M", value: "5 Years" },
  ],
  w: [{ key: "12-M", value: "1 Year" }, { key: "60-M", value: "5 Years" }],
  "1-w": [{ key: "12-M", value: "1 Year" }, { key: "60-M", value: "5 Years" }],
  m: [{ key: "12-M", value: "1 Year" }, { key: "60-M", value: "5 Years" }],
  "1-m": [{ key: "12-M", value: "1 Year" }, { key: "60-M", value: "5 Years" }],
};

export const CHART_INTERVALS: ReadonlyArray<{ readonly key: string; readonly value: string }> = [
  { key: "Mi", value: "1 Minute" },
  { key: "5-Mi", value: "5 Minutes" },
  { key: "15-Mi", value: "15 Minutes" },
  { key: "30-Mi", value: "30 Minutes" },
  { key: "60-Mi", value: "60 Minutes" },
  { key: "D", value: "Daily" },
  { key: "W", value: "Weekly" },
  { key: "M", value: "Monthly" },
];

export const CHART_INTERVALS_DICTIONARY: ReadonlyArray<{
  readonly key: string;
  readonly value: string;
}> = [
  { key: "mi", value: "1 Minute" },
  { key: "1-mi", value: "1 Minute" },
  { key: "5-mi", value: "5 Minutes" },
  { key: "15-mi", value: "15 Minutes" },
  { key: "30-mi", value: "30 Minutes" },
  { key: "60-mi", value: "60 Minutes" },
  { key: "d", value: "Daily" },
  { key: "1-d", value: "Daily" },
  { key: "w", value: "Weekly" },
  { key: "1-w", value: "Weekly" },
  { key: "m", value: "Monthly" },
  { key: "1-m", value: "Monthly" },
];

export const CHART_TYPES: ReadonlyArray<{ readonly key: string; readonly value: string }> = [
  { key: "line", value: "Line" },
  { key: "bar", value: "Bar" },
  { key: "candlestick", value: "Candlestick" },
];
