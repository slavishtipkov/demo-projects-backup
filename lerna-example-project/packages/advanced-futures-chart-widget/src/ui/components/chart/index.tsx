import * as React from "react";
import LineChart from "./chart";
import styled, { css } from "../../../styled-components";
import { ChangeYAxisState } from "../../../store";
import { HistoricPrice } from "../../../interfaces";

export interface Props {
  readonly width: number;
  readonly symbol?: string;
  readonly interval: string;
  readonly chartData: ReadonlyArray<HistoricPrice>;
  readonly chartType: string;
  readonly studies: {
    readonly sma: boolean;
    readonly rsi: boolean;
    readonly bollingerBands: boolean;
    readonly slowStochastic: boolean;
    readonly fastStochastic: boolean;
    readonly macd: boolean;
    readonly volume: boolean;
  };
  readonly yAxisState: ReadonlyArray<{
    readonly isDrawn: boolean;
    readonly study: string;
  }>;
  readonly changeYAxisState: (
    yAxisState: ReadonlyArray<{
      readonly isDrawn: boolean;
      readonly study: string;
    }>,
  ) => ChangeYAxisState;
}

export interface ChartWrapperProps {
  readonly isOHLC: boolean;
}

const ChartWrapper = styled<ChartWrapperProps, "div">("div")`
  .react-stockcharts-enable-interaction {
    pointer-events: none;
  }

  .tooltip-date {
    font: 800 10.3px sans-serif !important;
    fill: #474747 !important;
  }

  .series-label {
    font: 800 10.5px sans-serif !important;
  }

  .tooltip-label {
    font: 800 10.3px sans-serif !important;
    fill: #474747 !important;
  }

  .tooltip-value {
    fill: #474747 !important;
  }

  .react-stockcharts-edgeindicator {
    padding: 20px;
  }

  .react-stockcharts-grabbing-cursor,
  .react-stockcharts-crosshair-cursor {
    stroke: #bfbfbf;
    stroke-width: 1px;
    opacity: 1 !important;
    fill-opacity: 0 !important;
  }

  /* IE svg fix */
  .react-stockcharts-grabbing-cursor,
  .react-stockcharts-crosshair-cursor,
  .react-stockchart {
    overflow: hidden !important;
  }

  ${({ isOHLC }) =>
    isOHLC &&
    css`
      .react-stockcharts-ohlc * {
        stroke-width: 1.5 !important;
      }
    `};

  svg {
    height: 100% !important;
    width: 100% !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
  }
`;

class ChartComponent extends React.Component<Props> {
  render(): JSX.Element {
    if (this.props.chartData.length === 0) {
      // tslint:disable-next-line:jsx-use-translation-function
      return <div>Loading...</div>;
    }

    return (
      <ChartWrapper isOHLC={this.props.chartType === "bar"}>
        <div>
          <LineChart
            yAxisState={this.props.yAxisState}
            changeYAxisState={this.props.changeYAxisState}
            type={"svg"}
            data={this.props.chartData}
            widgetWidth={this.props.width}
            symbol={this.props.symbol}
            chartType={this.props.chartType}
            interval={this.props.interval}
            studies={this.props.studies}
          />
        </div>
      </ChartWrapper>
    );
  }
}

export default ChartComponent;
