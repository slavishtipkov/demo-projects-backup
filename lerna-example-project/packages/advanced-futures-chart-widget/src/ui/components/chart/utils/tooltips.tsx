import * as React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { colorPalette } from "../../../../constants";
import { HistoricPrice } from "../../../../interfaces";

export const backgroundChartShapeSVG = (
  {
    fill,
    stroke,
    opacity,
  }: { readonly fill: string; readonly stroke: string; readonly opacity: number },
  { height, width }: { readonly height: string; readonly width: number },
) => {
  return (
    <rect
      height={parseFloat(height)}
      width={width < 112 ? 112 : width}
      fill={fill}
      opacity={opacity}
      stroke={stroke}
      rx="5"
      ry="5"
    />
  );
};

export const tooltipChartSVG = (
  {
    fontFamily,
    fontSize,
    fontFill,
  }: { readonly fontFamily: string; readonly fontSize: number; readonly fontFill: string },
  content: {
    readonly x: string;
    readonly y: ReadonlyArray<{
      readonly label: string;
      readonly value: string;
      readonly series: number;
    }>;
  },
) => {
  const X = 6;
  const Y = 10;

  let tspans: ReadonlyArray<any> = [];
  const startY = Y + fontSize * 0.9;

  for (let i = 0; i < content.y.length; i++) {
    let y = content.y[i];
    let textY = startY + fontSize * (1.1 * (i + 1));

    tspans = [
      ...tspans,
      // tslint:disable-next-line:jsx-wrap-multiline
      <tspan
        key={`L-${i}`}
        x={X}
        y={textY}
        fill={colorPalette.series[y.series]}
        className="series-label"
      >
        {y.label}
      </tspan>,
    ];

    tspans = [
      ...tspans,
      // tslint:disable-next-line:jsx-wrap-multiline
      <tspan key={i} className="tooltip-label" x={X + 16}>
        {`${"  =  "}`}
      </tspan>,
    ];

    tspans = [
      ...tspans,
      // tslint:disable-next-line:jsx-wrap-multiline
      <tspan key={`V-${i}`} x={X + 28} className="tooltip-value">
        {y.value}
      </tspan>,
    ];
  }
  return (
    <text fontFamily={fontFamily} fontSize={fontSize} fill={fontFill}>
      <tspan x={X} y={startY - 5} className="tooltip-date">
        {content.x}
      </tspan>
      {tspans}
    </text>
  );
};

export const calculateChange = (currentItem: HistoricPrice, data: ReadonlyArray<HistoricPrice>) => {
  const numberFormat = format(".2f");
  const previousIndex = data.findIndex((d: HistoricPrice) => d.date === currentItem.date) - 1;
  const previousItem = data[previousIndex];
  if (previousItem) {
    const convertedChangeNumber = numberFormat(
      (currentItem.close as number) - (previousItem.close as number),
    );
    const convertedChangePercent = numberFormat(parseFloat(convertedChangeNumber) / 100);
    return `${convertedChangeNumber}(${convertedChangePercent}%)`;
  } else {
    return "-(-%)";
  }
};

export const tooltipChartContent = (
  ys: ReadonlyArray<{ readonly label: string; readonly value: Function }>,
  interval: string,
  data: ReadonlyArray<HistoricPrice>,
  symbol?: string,
) => {
  const dateFormat = interval.includes("Mi")
    ? timeFormat("%-m/%-d/%Y %-I:%M%p")
    : timeFormat("%-m/%-d/%Y");
  const numberFormat = format(".2f");

  return ({
    currentItem,
    xAccessor,
  }: {
    readonly currentItem: HistoricPrice;
    readonly xAccessor: Function;
  }) => {
    return {
      x: dateFormat(xAccessor(currentItem)),
      y: [
        {
          label: "La",
          value: currentItem.close !== null && currentItem.close_text,
        },
        {
          label: "H",
          value: currentItem.high !== null && currentItem.high_text,
        },
        {
          label: "L",
          value: currentItem.low !== null && currentItem.low_text,
        },
        {
          label: "O",
          value: currentItem.open !== null && currentItem.open_text,
        },
        {
          label: "V",
          value: currentItem.volume !== null && numberFormat(currentItem.volume),
        },
        {
          label: "Ch",
          value: currentItem.close !== null && calculateChange(currentItem, data),
        },
        {
          label: String.fromCharCode(9644),
          value: symbol ? symbol : "-",
          series: 0,
        },
      ]
        .concat(
          ys.map((each: { readonly label: string; readonly value: Function }) => ({
            label: each.label,
            value: each.value(currentItem),
          })),
        )
        .filter(
          (line: { readonly label: string; readonly value: string | boolean | null }) => line.value,
        ),
    };
  };
};

export const tooltipVolumeContent = (
  ys: ReadonlyArray<{ readonly label: string; readonly value: Function }>,
  interval: string,
  data: ReadonlyArray<HistoricPrice>,
  symbol?: string,
) => {
  const dateFormat = interval.includes("Mi")
    ? timeFormat("%-m/%-d/%Y %-I:%M%p")
    : timeFormat("%-m/%-d/%Y");
  const numberFormat = format(".2f");
  return ({
    currentItem,
    xAccessor,
  }: {
    readonly currentItem: HistoricPrice;
    readonly xAccessor: Function;
  }) => {
    return {
      x: dateFormat(xAccessor(currentItem)),
      y: [
        {
          label: "V",
          value: currentItem.volume !== null && numberFormat(currentItem.volume),
        },
        {
          label: "OI",
          value: currentItem.oi !== null && !isNaN(currentItem.oi) && numberFormat(currentItem.oi),
        },
      ]
        .concat(
          ys.map((each: { readonly label: string; readonly value: Function }) => ({
            label: each.label,
            value: each.value(currentItem),
          })),
        )
        .filter((line: { readonly label: string; readonly value: string | boolean }) => line.value),
    };
  };
};

export const backgroundVolumeShapeSVG = (
  {
    fill,
    stroke,
    opacity,
  }: { readonly fill: string; readonly stroke: string; readonly opacity: number },
  { height, width }: { readonly height: string; readonly width: string },
) => {
  return (
    <rect
      height={parseFloat(height) + 5}
      width={parseFloat(width) + 10}
      fill={fill}
      opacity={opacity}
      stroke={stroke}
      rx="5"
      ry="5"
    />
  );
};

export const backgroundStudyShapeSVG = (
  {
    fill,
    stroke,
    opacity,
  }: { readonly fill: string; readonly stroke: string; readonly opacity: number },
  { height, width }: { readonly height: string; readonly width: string },
) => {
  return (
    <rect
      height={parseFloat(height) + 5}
      width={parseFloat(width) + 3 < 68 ? 68 : parseFloat(width) + 3}
      fill={fill}
      opacity={opacity}
      stroke={stroke}
      rx="5"
      ry="5"
    />
  );
};

export const backgroundMACDShapeSVG = (
  {
    fill,
    stroke,
    opacity,
  }: { readonly fill: string; readonly stroke: string; readonly opacity: number },
  { height, width }: { readonly height: string; readonly width: number },
) => {
  return (
    <rect
      height={parseFloat(height) + 10}
      width={width < 120 ? 120 : width}
      fill={fill}
      opacity={opacity}
      stroke={stroke}
      rx="5"
      ry="5"
    />
  );
};

export const tooltipMACDContent = (
  ys: ReadonlyArray<{ readonly label: string; readonly value: Function }>,
  interval: string,
  data: ReadonlyArray<HistoricPrice>,
  symbol?: string,
) => {
  const dateFormat = interval.includes("Mi")
    ? timeFormat("%-m/%-d/%Y %-I:%M%p")
    : timeFormat("%-m/%-d/%Y");
  const numberFormat = format(".2f");
  return ({
    currentItem,
    xAccessor,
  }: {
    readonly currentItem: HistoricPrice;
    readonly xAccessor: Function;
  }) => {
    return {
      x: dateFormat(xAccessor(currentItem)),
      y: [
        {
          label: "Divergence",
          value:
            currentItem.macd.divergence !== undefined &&
            numberFormat(currentItem.macd.divergence as number),
        },
        {
          label: "MACD",
          value:
            currentItem.macd.macd !== undefined && numberFormat(currentItem.macd.macd as number),
        },
        {
          label: "Signal",
          value:
            currentItem.macd.signal !== undefined &&
            numberFormat(currentItem.macd.signal as number),
        },
      ]
        .concat(
          ys.map((each: { readonly label: string; readonly value: Function }) => ({
            label: each.label,
            value: each.value(currentItem),
          })),
        )
        .filter((line: { readonly label: string; readonly value: string | boolean }) => line.value),
    };
  };
};

export const tooltipMACDSVG = (
  {
    fontFamily,
    fontSize,
    fontFill,
  }: { readonly fontFamily: string; readonly fontSize: number; readonly fontFill: string },
  content: {
    readonly x: string;
    readonly y: ReadonlyArray<{
      readonly label: string;
      readonly value: string;
      readonly series?: number;
      readonly stroke: string;
    }>;
  },
) => {
  let tspans: ReadonlyArray<any> = [];
  const X = 8;
  const Y = 8;
  const startY = Y + fontSize * 0.9;

  for (let i = 0; i < content.y.length; i++) {
    let y = content.y[i];
    let textY = startY + 10 + fontSize * (1.35 * i + 1);

    if (y.series === undefined) {
      tspans = [
        ...tspans,
        // tslint:disable-next-line:jsx-wrap-multiline
        <tspan key={`L-${i}`} x={X} y={textY} fill={y.stroke} className="tooltip-label">
          {y.label}
        </tspan>,
      ];
    } else {
      tspans = [
        ...tspans,
        // tslint:disable-next-line:jsx-wrap-multiline
        <tspan
          key={`L-${i}`}
          x={X}
          y={textY}
          fill={colorPalette.series[y.series]}
          className="series-label"
        >
          {y.label}
        </tspan>,
      ];
    }

    tspans = [
      ...tspans,
      // tslint:disable-next-line:jsx-wrap-multiline
      <tspan key={i} className="tooltip-label" x={X + 65}>
        {`${"  =  "}`}
      </tspan>,
    ];

    tspans = [
      ...tspans,
      // tslint:disable-next-line:jsx-wrap-multiline
      <tspan key={`V-${i}`} x={X + 77} className="tooltip-value">
        {y.value}
      </tspan>,
    ];
  }
  return (
    <text
      fontFamily={fontFamily}
      fontSize={fontSize}
      fill={fontFill}
      className="tooltip-text-wrapper"
    >
      <tspan x={X} y={startY} className="tooltip-date">
        {content.x}
      </tspan>
      {tspans}
    </text>
  );
};

export const tooltipFastStoContent = (
  ys: ReadonlyArray<{ readonly label: string; readonly value: Function }>,
  interval: string,
  data: ReadonlyArray<HistoricPrice>,
  symbol?: string,
) => {
  const dateFormat = interval.includes("Mi")
    ? timeFormat("%-m/%-d/%Y %-I:%M%p")
    : timeFormat("%-m/%-d/%Y");
  const numberFormat = format(".2f");
  return ({
    currentItem,
    xAccessor,
  }: {
    readonly currentItem: HistoricPrice;
    readonly xAccessor: Function;
  }) => {
    return {
      x: dateFormat(xAccessor(currentItem)),
      y: [
        {
          label: "D",
          value: currentItem.fastSTO.D !== undefined && numberFormat(currentItem.fastSTO.D),
        },
        {
          label: "K",
          value: currentItem.fastSTO.K !== undefined && numberFormat(currentItem.fastSTO.K),
        },
      ]
        .concat(
          ys.map((each: { readonly label: string; readonly value: Function }) => ({
            label: each.label,
            value: each.value(currentItem),
          })),
        )
        .filter((line: { readonly label: string; readonly value: string | boolean }) => line.value),
    };
  };
};

export const tooltipSlowStoContent = (
  ys: ReadonlyArray<{ readonly label: string; readonly value: Function }>,
  interval: string,
  data: ReadonlyArray<HistoricPrice>,
  symbol?: string,
) => {
  const dateFormat = interval.includes("Mi")
    ? timeFormat("%-m/%-d/%Y %-I:%M%p")
    : timeFormat("%-m/%-d/%Y");
  const numberFormat = format(".2f");
  return ({
    currentItem,
    xAccessor,
  }: {
    readonly currentItem: HistoricPrice;
    readonly xAccessor: Function;
  }) => {
    return {
      x: dateFormat(xAccessor(currentItem)),
      y: [
        {
          label: "D",
          value: currentItem.slowSTO.D !== undefined && numberFormat(currentItem.slowSTO.D),
        },
        {
          label: "K",
          value: currentItem.slowSTO.K !== undefined && numberFormat(currentItem.slowSTO.K),
        },
      ]
        .concat(
          ys.map((each: { readonly label: string; readonly value: Function }) => ({
            label: each.label,
            value: each.value(currentItem),
          })),
        )
        .filter((line: { readonly label: string; readonly value: string | boolean }) => line.value),
    };
  };
};

export const tooltipRSIContent = (
  ys: ReadonlyArray<{ readonly label: string; readonly value: Function }>,
  interval: string,
  data: ReadonlyArray<HistoricPrice>,
  symbol?: string,
) => {
  const dateFormat = interval.includes("Mi")
    ? timeFormat("%-m/%-d/%Y %-I:%M%p")
    : timeFormat("%-m/%-d/%Y");
  const numberFormat = format(".2f");
  return ({
    currentItem,
    xAccessor,
  }: {
    readonly currentItem: HistoricPrice;
    readonly xAccessor: Function;
  }) => {
    return {
      x: dateFormat(xAccessor(currentItem)),
      y: [
        {
          label: "RSI",
          value: !isNaN(currentItem.rsi) && numberFormat(currentItem.rsi),
        },
      ]
        .concat(
          ys.map((each: { readonly label: string; readonly value: Function }) => ({
            label: each.label,
            value: each.value(currentItem),
          })),
        )
        .filter((line: { readonly label: string; readonly value: string | boolean }) => line.value),
    };
  };
};

export const tooltipStudySVG = (
  {
    fontFamily,
    fontSize,
    fontFill,
  }: { readonly fontFamily: string; readonly fontSize: number; readonly fontFill: string },
  content: {
    readonly x: string;
    readonly y: ReadonlyArray<{
      readonly label: string;
      readonly value: string;
      readonly series?: number;
      readonly stroke: string;
    }>;
  },
) => {
  let tspans: ReadonlyArray<any> = [];
  const X = 8;
  const Y = 8;
  const startY = Y + fontSize * 0.9;

  for (let i = 0; i < content.y.length; i++) {
    let y = content.y[i];
    let textY = startY + 10 + fontSize * (1.35 * i + 1);

    if (y.series === undefined) {
      tspans = [
        ...tspans,
        // tslint:disable-next-line:jsx-wrap-multiline
        <tspan key={`L-${i}`} x={X} y={textY} fill={y.stroke} className="tooltip-label">
          {y.label}
        </tspan>,
      ];
    } else {
      tspans = [
        ...tspans,
        // tslint:disable-next-line:jsx-wrap-multiline
        <tspan
          key={`L-${i}`}
          x={X}
          y={textY}
          fill={colorPalette.series[y.series]}
          className="series-label"
        >
          {y.label}
        </tspan>,
      ];
    }

    tspans = [
      ...tspans,
      // tslint:disable-next-line:jsx-wrap-multiline
      <tspan key={i} className="tooltip-label" x={X + 13}>
        {`${"  =  "}`}
      </tspan>,
    ];

    tspans = [
      ...tspans,
      // tslint:disable-next-line:jsx-wrap-multiline
      <tspan key={`V-${i}`} x={X + 28} className="tooltip-value">
        {y.value}
      </tspan>,
    ];
  }
  return (
    <text
      fontFamily={fontFamily}
      fontSize={fontSize}
      fill={fontFill}
      className="tooltip-text-wrapper"
    >
      <tspan x={X} y={startY} className="tooltip-date">
        {content.x}
      </tspan>
      {tspans}
    </text>
  );
};
