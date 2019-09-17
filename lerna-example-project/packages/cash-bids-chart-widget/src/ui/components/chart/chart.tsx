import * as React from "react";
import * as ReactDOM from "react-dom";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import * as moment from "moment-timezone";
import { CHART } from "../../../constants";
import styled from "../../../styled-components";
import { tooltipContent, backgroundShapeSVG, tooltipSVG } from "./utils/tooltips";
import { generateId, getRandomLength } from "../../../store/utils";

import { ChartCanvas, Chart } from "react-stockcharts";
import { LineSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  EdgeIndicator,
  CurrentCoordinate,
  MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";
import { CashBidChartData } from "../../../interfaces";

const ChartContainer = styled("div")`
  position: relative;
  width: 100%;
  height: auto;

  svg {
    height: 100% !important;
    width: 100% !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
  }
`;

export interface SubChartContainerProps {
  readonly height: number;
  readonly rightMargin: number;
  readonly borderColor: string;
  readonly prevChartHeight?: number;
  readonly showCurrentBasis?: boolean;
  readonly show3YearAverageBasis?: boolean;
}

const FirstChartContainer = styled<SubChartContainerProps, "div">("div")`
  position: absolute;
  top: 20px;
  left: 10px;
  ${({ height }) =>
    height &&
    `
      height: ${height}px;
    `};
  ${({ rightMargin }) =>
    rightMargin &&
    `
      width: calc(100% - (${rightMargin}px + 10px));
    `};
  ${({ borderColor }) =>
    borderColor &&
    `
      border-top: 1px solid ${borderColor};
      border-left: 1px solid ${borderColor};
      border-bottom: 1px solid ${borderColor};
    `};
  ${({ showCurrentBasis, show3YearAverageBasis }) =>
    !showCurrentBasis &&
    !show3YearAverageBasis &&
    `
      border-bottom: none;
    `};
`;

const SecondChartContainer = styled<SubChartContainerProps, "div">("div")`
  position: absolute;
  left: 10px;
  ${({ height, prevChartHeight }) =>
    height &&
    `
      height: ${height}px;
      top: calc(${prevChartHeight}px + 50px);
    `};
  ${({ rightMargin }) =>
    rightMargin &&
    `
      width: calc(100% - (${rightMargin}px + 10px));
    `};
  ${({ borderColor }) =>
    borderColor &&
    `
      border-top: 1px solid ${borderColor};
      border-left: 1px solid ${borderColor};
    `};
`;

export interface Props {
  readonly type: string;
  readonly data: ReadonlyArray<CashBidChartData>;
  readonly height?: number;
  readonly width?: number;
  readonly ratio?: number;
  readonly widgetWidth: number;
  readonly symbol?: string;
  readonly isBasis3YrAvgNull?: boolean;
  readonly isCashPrice3YrAvgNull?: boolean;
  readonly showCurrentBasis: boolean;
  readonly show3YearAverageBasis: boolean;
  readonly show3YearAverageCashPrice: boolean;
}

export interface State {
  readonly rightMargin: number;
}

class CashBids extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      rightMargin: 10,
    };
  }

  private yRefPrice: any;
  private yRefBasis: any;

  componentDidMount(): void {
    const yNodePrice: any = ReactDOM.findDOMNode(this.yRefPrice);
    const yNodeBasis: any = ReactDOM.findDOMNode(this.yRefBasis);
    const axisRefs: ReadonlyArray<any> = [yNodePrice, yNodeBasis];

    const yNodes: ReadonlyArray<number> = [
      axisRefs[0] ? axisRefs[0].childNodes[0].getBoundingClientRect().width : 0,
      axisRefs[1] ? axisRefs[1].childNodes[0].getBoundingClientRect().width : 0,
    ];

    this.setState({
      rightMargin: this.calculateRightMargin(yNodes),
    });
  }

  render(): JSX.Element {
    const { data: initialData, type, height, width, ratio } = this.props;
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d: CashBidChartData) =>
      moment
        .utc(d.dateTimeStamp)
        .local()
        .toDate(),
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(initialData);

    // GRID
    const margin = { left: 10, right: this.state.rightMargin, top: 20, bottom: 30 };
    const gridWidth = (width as number) - margin.left - margin.right;
    const showGrid = true;
    const yGrid = showGrid
      ? {
          innerTickSize: -1 * gridWidth,
          tickStrokeDasharray: "Solid",
          tickStrokeOpacity: 0.2,
          tickStrokeWidth: 1,
        }
      : {};
    const baseChartId = generateId(getRandomLength());

    return (
      <ChartContainer>
        <FirstChartContainer
          height={CHART.FIRST_CHART_HEIGHT}
          rightMargin={this.state.rightMargin}
          borderColor={CHART.BORDER_COLOR}
          showCurrentBasis={this.props.showCurrentBasis}
          show3YearAverageBasis={this.props.show3YearAverageBasis}
        />
        {(this.props.showCurrentBasis || this.props.show3YearAverageBasis) && (
          <SecondChartContainer
            height={CHART.SECOND_CHART_HEIGHT}
            prevChartHeight={CHART.FIRST_CHART_HEIGHT}
            rightMargin={this.state.rightMargin}
            borderColor={CHART.BORDER_COLOR}
          />
        )}

        <ChartCanvas
          ratio={ratio as number}
          width={width as number}
          height={
            this.props.showCurrentBasis || this.props.show3YearAverageBasis
              ? CHART.CHART_CANVAS_HEIGHT
              : CHART.ONLY_ONE_AXIS
          }
          margin={margin}
          type={type}
          pointsPerPxThreshold={1}
          seriesName={baseChartId}
          data={data}
          xAccessor={xAccessor}
          displayXAccessor={displayXAccessor}
          xScale={xScale}
          panEvent={false}
          zoomEvent={false}
          maintainPointsPerPixelOnResize={false}
        >
          <Chart
            id={`${baseChartId}-${generateId(getRandomLength())}`}
            // tslint:disable-next-line:jsx-no-lambda
            yExtents={(d: CashBidChartData) => [d.cashPrice, d.cashPrice3YrAvg]}
            height={CHART.FIRST_CHART_HEIGHT}
          >
            {!this.props.showCurrentBasis && !this.props.show3YearAverageBasis && (
              <XAxis
                axisAt="bottom"
                orient="bottom"
                stroke={CHART.BORDER_COLOR}
                tickStroke={CHART.AXIS_VALUES_COLOR}
                displayFormat={timeFormat("%-m/%-d/%Y")}
                ticks={this.calculateXAxisTicks()}
                tickStrokeOpacity={0}
              />
            )}
            <YAxis
              axisAt="right"
              orient="right"
              stroke={CHART.BORDER_COLOR}
              tickStroke={CHART.AXIS_VALUES_COLOR}
              // tslint:disable-next-line:jsx-no-lambda
              tickFormat={(d: number) => this.formatAxisNumbers(d)}
              ticks={5}
              // tslint:disable-next-line:jsx-no-lambda
              ref={ref => (this.yRefPrice = ref)}
              {...yGrid}
            />

            {!this.props.isCashPrice3YrAvgNull && this.props.show3YearAverageCashPrice && (
              <LineSeries
                // tslint:disable-next-line:jsx-no-lambda
                yAccessor={(d: CashBidChartData) => d.cashPrice3YrAvg}
                strokeDasharray="Solid"
                stroke={CHART.YR_CURRENT_CASH_PRICE_COLOR}
                // tslint:disable-next-line:jsx-no-lambda
                strokeWidth={CHART.LINE_SERIES_STROKE_WIDTH}
              />
            )}

            {!this.props.isCashPrice3YrAvgNull && this.props.show3YearAverageCashPrice && (
              <CurrentCoordinate
                // tslint:disable-next-line:jsx-no-lambda
                yAccessor={(d: CashBidChartData) => d.cashPrice3YrAvg}
                fill={CHART.YR_CURRENT_CASH_PRICE_COLOR}
                r={4}
              />
            )}

            <LineSeries
              // tslint:disable-next-line:jsx-no-lambda
              yAccessor={(d: CashBidChartData) => d.cashPrice}
              strokeDasharray="Solid"
              stroke={CHART.CURRENT_CASH_PRICE_COLOR}
              strokeWidth={CHART.LINE_SERIES_STROKE_WIDTH}
            />
            <CurrentCoordinate
              // tslint:disable-next-line:jsx-no-lambda
              yAccessor={(d: CashBidChartData) => d.cashPrice}
              fill={CHART.CURRENT_CASH_PRICE_COLOR}
              r={4}
            />
            <EdgeIndicator
              itemType="last"
              orient="right"
              edgeAt="right"
              // tslint:disable-next-line:jsx-no-lambda
              displayFormat={(d: number) => this.formatAxisNumbers(d)}
              // tslint:disable-next-line:jsx-no-lambda
              yAccessor={(d: CashBidChartData) => d.cashPrice}
              // tslint:disable-next-line:jsx-no-lambda
              fill={(d: CashBidChartData) => this.getIndicatorColor(d, "cashPrice")}
              fontSize={11}
            />
            <MouseCoordinateY
              at="right"
              orient="right"
              // tslint:disable-next-line:jsx-no-lambda
              displayFormat={(d: number) => this.formatAxisNumbers(d)}
              fontSize={11}
            />
            <CrossHairCursor />
          </Chart>

          {/* Second yAxis */}

          {(this.props.showCurrentBasis || this.props.show3YearAverageBasis) && (
            <Chart
              id={`${baseChartId}-${generateId(getRandomLength())}`}
              // tslint:disable-next-line:jsx-no-lambda
              yExtents={(d: CashBidChartData) => [d.basis3YrAvg, d.basis]}
              height={CHART.SECOND_CHART_HEIGHT}
              // tslint:disable-next-line:jsx-no-lambda
              origin={(w: number, h: number) => [0, 250]}
              // padding={{ top: 10, bottom: 10 }}
            >
              <XAxis
                axisAt="bottom"
                orient="bottom"
                stroke={CHART.BORDER_COLOR}
                tickStroke={CHART.AXIS_VALUES_COLOR}
                displayFormat={timeFormat("%-m/%-d/%Y")}
                ticks={this.calculateXAxisTicks()}
                tickStrokeOpacity={0}
              />
              <YAxis
                axisAt="right"
                orient="right"
                ticks={2}
                // tslint:disable-next-line:jsx-no-lambda
                tickFormat={(d: number) => this.formatAxisNumbers(d)}
                stroke={CHART.BORDER_COLOR}
                tickStroke={CHART.AXIS_VALUES_COLOR}
                ref={ref => (this.yRefBasis = ref)}
                {...yGrid}
              />

              {!this.props.isBasis3YrAvgNull && this.props.show3YearAverageBasis && (
                <LineSeries
                  // tslint:disable-next-line:jsx-no-lambda
                  yAccessor={(d: CashBidChartData) => d.basis3YrAvg}
                  strokeDasharray="Solid"
                  stroke={CHART.YR_CURRENT_BASIS_COLOR}
                  strokeWidth={CHART.LINE_SERIES_STROKE_WIDTH}
                />
              )}

              {!this.props.isBasis3YrAvgNull && this.props.show3YearAverageBasis && (
                <CurrentCoordinate
                  // tslint:disable-next-line:jsx-no-lambda
                  yAccessor={(d: CashBidChartData) => d.basis3YrAvg}
                  fill={CHART.YR_CURRENT_BASIS_COLOR}
                  r={4}
                />
              )}

              {this.props.showCurrentBasis && (
                <LineSeries
                  // tslint:disable-next-line:jsx-no-lambda
                  yAccessor={(d: CashBidChartData) => d.basis}
                  strokeDasharray="Solid"
                  stroke={CHART.CURRENT_BASIS_COLOR}
                  strokeWidth={CHART.LINE_SERIES_STROKE_WIDTH}
                />
              )}

              <MouseCoordinateY
                at="right"
                orient="right"
                // tslint:disable-next-line:jsx-no-lambda
                displayFormat={(d: number) => this.formatAxisNumbers(d)}
                fontSize={11}
              />

              {this.props.showCurrentBasis && (
                <CurrentCoordinate
                  // tslint:disable-next-line:jsx-no-lambda
                  yAccessor={(d: CashBidChartData) => d.basis}
                  fill={CHART.CURRENT_BASIS_COLOR}
                  r={4}
                />
              )}
              {this.props.showCurrentBasis && (
                <EdgeIndicator
                  itemType="last"
                  orient="right"
                  edgeAt="right"
                  // tslint:disable-next-line:jsx-no-lambda
                  displayFormat={(d: number) => this.formatAxisNumbers(d)}
                  // tslint:disable-next-line:jsx-no-lambda
                  yAccessor={(d: CashBidChartData) => d.basis}
                  // tslint:disable-next-line:jsx-no-lambda
                  fill={(d: CashBidChartData) => this.getIndicatorColor(d, "basis")}
                  fontSize={11}
                />
              )}
              <MouseCoordinateY
                at="right"
                orient="right"
                // tslint:disable-next-line:jsx-no-lambda
                displayFormat={(d: number) => this.formatAxisNumbers(d)}
                fontSize={11}
              />
              {/* <CrossHairCursor /> */}
            </Chart>
          )}

          <HoverTooltip
            fill="#f8f8f8"
            bgFill="#f8f8f8"
            opacity={0.9}
            stroke="rgba(90,90,90,0.3)"
            fontFill="#474747"
            fontFamily="Arial, Helvetica Neue, Helvetica, sans-serif"
            backgroundShapeSVG={backgroundShapeSVG}
            tooltipSVG={tooltipSVG}
            fontSize={11}
            tooltipContent={tooltipContent(
              [],
              this.props.showCurrentBasis,
              this.props.show3YearAverageBasis,
              this.props.show3YearAverageCashPrice,
            )}
          />
        </ChartCanvas>
      </ChartContainer>
    );
  }

  private readonly calculateXAxisTicks = () => {
    if (this.props.widgetWidth < 500) {
      return 2;
    } else if (this.props.widgetWidth < 800) {
      return 4;
    } else if (this.props.widgetWidth < 1100) {
      return 10;
    } else {
      return 12;
    }
  };

  private readonly calculateRightMargin = (yNodes: ReadonlyArray<number>) => {
    const maxWidth = Math.max(...yNodes);

    return maxWidth + 10;
  };

  private readonly formatAxisNumbers = (d: number) => {
    const hasNoDigitsAfterDecimalPoint = d - Math.floor(d) === 0;
    const hasOneDigitAfterDecimalPoint = d * 10 - Math.floor(d * 10) === 0;

    if (d >= 10000) {
      return format(".2s")(d);
    } else if (hasNoDigitsAfterDecimalPoint) {
      return format(".0f")(d);
    } else if (hasOneDigitAfterDecimalPoint) {
      return format(".1f")(d);
    } else {
      return format(".2f")(d);
    }
  };

  private readonly getIndicatorColor = (indicatorData: CashBidChartData, price: string) => {
    const previousIndex =
      this.props.data.findIndex(
        (d: CashBidChartData) => d.dateTimeStamp === indicatorData.dateTimeStamp,
      ) - 1;
    if (this.props.data[previousIndex]) {
      if ((indicatorData[price] as number) > (this.props.data[previousIndex][price] as number)) {
        return CHART.PRICE_UP_COLOR;
      } else if (
        (indicatorData[price] as number) < (this.props.data[previousIndex][price] as number)
      ) {
        return CHART.PRICE_DOWN_COLOR;
      }
      return CHART.PRICE_SAME_COLOR;
    } else {
      return CHART.PRICE_SAME_COLOR;
    }
  };
}

export default fitWidth(CashBids);
