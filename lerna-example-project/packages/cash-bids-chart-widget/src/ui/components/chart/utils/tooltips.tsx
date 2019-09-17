import * as React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { CashBidData } from "../../../../interfaces";

let offset = 0;

export const tooltipContent = (
  ys: ReadonlyArray<{ readonly label: string; readonly value: Function }>,
  showCurrentBasis: boolean,
  show3YearAverageBasis: boolean,
  show3YearAverageCashPrice: boolean,
) => {
  const dateFormat = timeFormat("%-m/%-d/%Y");
  const numberFormat = format(".2f");

  return ({
    currentItem,
    xAccessor,
  }: {
    readonly currentItem: CashBidData;
    readonly xAccessor: Function;
  }) => {
    offset =
      !show3YearAverageBasis ||
      !show3YearAverageCashPrice ||
      (currentItem.cashPrice3YrAvg === null || currentItem.basis3YrAvg === null) ||
      (!currentItem.cashPrice3YrAvg || !currentItem.basis3YrAvg)
        ? 15
        : 0;

    return {
      x: dateFormat(xAccessor(currentItem)),
      y: [
        {
          label: "Cash Price",
          value:
            currentItem.cashPrice !== null &&
            currentItem.cashPrice !== undefined &&
            numberFormat(currentItem.cashPrice),
        },
        {
          label: " ",
          separator: true,
          value:
            (currentItem.basis !== null ||
              currentItem.cashPrice3YrAvg !== null ||
              currentItem.basis3YrAvg !== null) &&
            " ",
        },
        {
          label: "Basis",
          value:
            currentItem.basis !== null &&
            currentItem.basis !== undefined &&
            showCurrentBasis &&
            numberFormat(currentItem.basis),
        },
        {
          label: "3 Yr Avg Cash",
          value:
            currentItem.cashPrice3YrAvg !== null &&
            currentItem.cashPrice3YrAvg !== undefined &&
            show3YearAverageCashPrice &&
            numberFormat(currentItem.cashPrice3YrAvg),
        },
        {
          label: "Price",
          nextLine: true,
          value:
            currentItem.cashPrice3YrAvg !== null &&
            currentItem.cashPrice3YrAvg !== undefined &&
            show3YearAverageCashPrice &&
            " ",
        },
        {
          label: " ",
          separator: true,
          value:
            currentItem.basis3YrAvg !== null &&
            currentItem.basis3YrAvg !== undefined &&
            show3YearAverageCashPrice &&
            " ",
        },
        {
          label: "3 Yr Avg Basis",
          value:
            currentItem.basis3YrAvg !== null &&
            currentItem.basis3YrAvg !== undefined &&
            show3YearAverageBasis &&
            numberFormat(currentItem.basis3YrAvg),
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

export const backgroundShapeSVG = (
  {
    fill,
    stroke,
    opacity,
  }: { readonly fill: string; readonly stroke: string; readonly opacity: number },
  { height, width }: { readonly height: string; readonly width: string },
) => {
  return (
    <rect
      height={parseFloat(height)}
      width={parseFloat(width) + offset + 5}
      fill={fill}
      opacity={opacity}
      stroke={stroke}
      rx="5"
      ry="5"
    />
  );
};

export const tooltipSVG = (
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
      readonly stroke: string;
      readonly separator?: boolean;
      readonly nextLine?: boolean;
    }>;
  },
) => {
  const X = 5;
  const Y = 10;

  let tspans: ReadonlyArray<any> = [];
  const startY = Y + fontSize * 0.9;
  let separatorDiff = 0;

  for (let i = 0; i < content.y.length; i++) {
    let y = content.y[i];
    let textY = startY + fontSize * (1.1 * (i + 1));

    if (content.y[i - 1] && content.y[i - 1].separator) {
      separatorDiff += 7;
      tspans = [
        ...tspans,
        // tslint:disable-next-line:jsx-wrap-multiline
        <tspan key={`L-${i}`} x={X} y={textY - 7} fill={y.stroke} className="series-label">
          {y.label}
        </tspan>,
      ];
    } else if (y.nextLine) {
      tspans = [
        ...tspans,
        // tslint:disable-next-line:jsx-wrap-multiline
        <tspan
          key={`L-${i}`}
          x={X}
          y={textY - (2 + separatorDiff)}
          fill={y.stroke}
          className="series-label"
        >
          {y.label}
        </tspan>,
      ];
    } else {
      separatorDiff = 0;
      tspans = [
        ...tspans,
        // tslint:disable-next-line:jsx-wrap-multiline
        <tspan key={`L-${i}`} x={X} y={textY} fill={y.stroke} className="series-label">
          {y.label}
        </tspan>,
      ];
    }

    tspans = [
      ...tspans,
      // tslint:disable-next-line:jsx-wrap-multiline
      <tspan key={`V-${i}`} x={X + 90} className="tooltip-value">
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
