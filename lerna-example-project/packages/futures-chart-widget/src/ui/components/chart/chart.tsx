import * as React from "react";
import * as ReactDOM from "react-dom";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { LineSeries, CandlestickSeries, OHLCSeries } from "react-stockcharts/lib/series";
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
import * as moment from "moment-timezone";
import { HistoricPrice } from "../../../interfaces";
import { colorPalette } from "../../../constants";
import { tooltipContent, backgroundShapeSVG, tooltipSVG } from "./tooltips";
import { generateId, getRandomLength } from "../../../store/utils";

export interface Props {
  readonly type: string;
  readonly data: ReadonlyArray<HistoricPrice>;
  readonly width?: number;
  readonly widgetWidth: number;
  readonly ratio?: number;
  readonly symbol?: string;
  readonly chartType: string;
  readonly interval: string;
}

export interface State {
  readonly rightMargin: number;
}

class ChartBase extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      rightMargin: 10,
    };
  }
  private yAxisRef: any;

  componentDidMount(): void {
    const yAxisNode: any = ReactDOM.findDOMNode(this.yAxisRef);
    if (yAxisNode) {
      this.setState({
        rightMargin: this.calculateRightMargin(
          yAxisNode.childNodes[0].getBoundingClientRect().width,
        ),
      });
    }
  }

  render(): JSX.Element {
    const { type, data: initialData, width, ratio } = this.props;
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d: HistoricPrice) =>
      moment(d.date).toDate(),
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(initialData);

    const showGrid = true;
    const margin = { left: 10, right: this.state.rightMargin, top: 20, bottom: 25 };
    const height = 270;
    const gridWidth = (width as number) - margin.left - margin.right;

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
      <ChartCanvas
        height={height}
        width={width as number}
        ratio={ratio as number}
        margin={margin}
        type={type}
        seriesName={baseChartId}
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        panEvent={false}
        zoomEvent={false}
        maintainPointsPerPixelOnResize={false}
      >
        <Chart
          id={`${baseChartId}-${generateId(getRandomLength())}`}
          yExtents={[(d: HistoricPrice) => [d.high, d.low]]}
          padding={{ top: 10, bottom: 20 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            tickStroke={colorPalette.axis}
            stroke="#E5E5E5"
            tickStrokeOpacity={0}
            ticks={this.calculateXAxisTicks()}
          />
          <YAxis
            // tslint:disable-next-line:jsx-no-lambda
            ref={ref => (this.yAxisRef = ref)}
            ticks={10}
            axisAt="right"
            orient="right"
            tickStroke={colorPalette.axis}
            stroke="#E5E5E5"
            // tslint:disable-next-line:jsx-no-lambda
            tickFormat={(d: number) => this.formatAxisNumbers(d)}
            {...yGrid}
          />
          {this.renderChartSeries()}
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            // tslint:disable-next-line:jsx-no-lambda
            displayFormat={(d: number) => this.formatAxisNumbers(d)}
            // tslint:disable-next-line:jsx-no-lambda
            yAccessor={(d: HistoricPrice) => d.close}
            // tslint:disable-next-line:jsx-no-lambda
            fill={(d: HistoricPrice) => this.getIndicatorColor(d, "close")}
            fontSize={11}
            yAxisPad={-1}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            // tslint:disable-next-line:jsx-no-lambda
            displayFormat={(d: number) => this.formatAxisNumbers(d)}
            fontSize={11}
          />
          <CrossHairCursor />
          {this.props.chartType === "line" && (
            <CurrentCoordinate
              // tslint:disable-next-line:jsx-no-lambda
              yAccessor={(d: HistoricPrice) => d.close}
              fill={colorPalette.series[0]}
              r={4}
            />
          )}

          <HoverTooltip
            // tslint:disable-next-line:jsx-no-lambda
            yAccessor={(d: HistoricPrice) => d.close || 0}
            fill="#f8f8f8"
            bgFill="#f8f8f8"
            opacity={0.9}
            stroke="rgba(90,90,90,0.3)"
            fontFill="#474747"
            fontFamily="Arial, Helvetica Neue, Helvetica, sans-serif"
            backgroundShapeSVG={backgroundShapeSVG}
            tooltipSVG={tooltipSVG}
            tooltipContent={tooltipContent(
              [],
              this.props.interval,
              this.props.data,
              this.props.symbol,
            )}
            fontSize={11}
          />
        </Chart>
      </ChartCanvas>
    );
  }

  private readonly renderChartSeries = () => {
    if (this.props.chartType === "line") {
      return (
        <LineSeries
          // tslint:disable-next-line:jsx-no-lambda
          yAccessor={(d: HistoricPrice) => d.close}
          stroke={colorPalette.series[0]}
          strokeWidth={3}
        />
      );
    } else if (this.props.chartType === "bar") {
      return (
        <OHLCSeries
          // tslint:disable-next-line:jsx-no-lambda
          fill={(d: HistoricPrice) =>
            (d.close as number) > (d.open as number)
              ? colorPalette.indicator.up
              : colorPalette.indicator.down
          }
          // tslint:disable-next-line:jsx-no-lambda
          stroke={(d: HistoricPrice) =>
            (d.close as number) > (d.open as number)
              ? colorPalette.indicator.up
              : colorPalette.indicator.down
          }
          strokeWidth={2}
        />
      );
    } else {
      return (
        <CandlestickSeries
          // tslint:disable-next-line:jsx-no-lambda
          fill={(d: HistoricPrice) =>
            (d.close as number) > (d.open as number)
              ? colorPalette.indicator.up
              : colorPalette.indicator.down
          }
          // tslint:disable-next-line:jsx-no-lambda
          stroke={(d: HistoricPrice) =>
            (d.close as number) > (d.open as number)
              ? colorPalette.indicator.up
              : colorPalette.indicator.down
          }
          // tslint:disable-next-line:jsx-no-lambda
          wickStroke={(d: HistoricPrice) =>
            (d.close as number) > (d.open as number)
              ? colorPalette.indicator.up
              : colorPalette.indicator.down
          }
          opacity={1}
        />
      );
    }
  };

  private readonly getIndicatorColor = (indicatorData: HistoricPrice, compareField: string) => {
    const previousIndex =
      this.props.data.findIndex((d: HistoricPrice) => d.date === indicatorData.date) - 1;
    if (this.props.data[previousIndex]) {
      if (
        (indicatorData[compareField] as number) >
        (this.props.data[previousIndex][compareField] as number)
      ) {
        return colorPalette.indicator.up;
      } else if (
        (indicatorData[compareField] as number) <
        (this.props.data[previousIndex][compareField] as number)
      ) {
        return colorPalette.indicator.down;
      }
      return colorPalette.indicator.same;
    } else {
      return colorPalette.indicator.same;
    }
  };

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

  private readonly calculateRightMargin = (yPrice: number) => {
    return yPrice + 10;
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
}

const LineChart = fitWidth(ChartBase);
export default LineChart;
