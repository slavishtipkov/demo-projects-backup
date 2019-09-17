import * as React from "react";
import CashBidsChart from "./chart";
import ChartLegend from "./chart-legend";
import ChartHeader from "./chart-header";
import styled from "../../../styled-components";
import NoDataErrorContainer from "../../components/error-container/no-data-error";
import { ERRORS } from "../../../constants";
import "@dtn/polyfills-lib";
import { CashBidChartData } from "../../../interfaces";

const ChartContainer = styled("div")`
  font-size: 16px;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  padding: 7px;
  border: 1px solid #bfbfbf;
  overflow-x: hidden;
  text-align: left;
  background-color: white;

  .react-stockcharts-enable-interaction {
    pointer-events: none;
  }

  .tooltip-text-wrapper {
    fill: #474747 !important;
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

  .react-stockcharts-grabbing-cursor,
  .react-stockcharts-crosshair-cursor,
  .react-stockchart {
    width: 100% !important;
    overflow: hidden !important;
  }
`;

export interface Props {
  readonly chartData: ReadonlyArray<CashBidChartData>;
  readonly updatedAt?: string;
  readonly location?: string;
  readonly commodity?: string;
  readonly deliveryEndDate?: string;
  readonly symbol?: string;
  readonly widgetWidth: number;
  readonly isBasis3YrAvgNull?: boolean;
  readonly isCashPrice3YrAvgNull?: boolean;
  readonly showCurrentBasis: boolean;
  readonly show3YearAverageBasis: boolean;
  readonly show3YearAverageCashPrice: boolean;
}

class ChartComponent extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <ChartContainer>
        <ChartHeader
          location={this.props.location}
          commodity={this.props.commodity}
          updatedAt={this.props.updatedAt}
          deliveryEndDate={this.props.deliveryEndDate}
          hasChartData={this.props.chartData.length > 1}
        />
        <div>
          {this.props.chartData.length <= 1 ? (
            <NoDataErrorContainer error={ERRORS.noDataErrorMessage.key} />
          ) : (
            <CashBidsChart
              type={"svg"}
              data={this.prepareData(this.props.chartData)}
              widgetWidth={this.props.widgetWidth}
              symbol={this.props.symbol}
              isBasis3YrAvgNull={this.props.isBasis3YrAvgNull}
              isCashPrice3YrAvgNull={this.props.isCashPrice3YrAvgNull}
              showCurrentBasis={this.props.showCurrentBasis}
              show3YearAverageBasis={this.props.show3YearAverageBasis}
              show3YearAverageCashPrice={this.props.show3YearAverageCashPrice}
            />
          )}
        </div>
        {this.props.chartData.length > 1 && (
          <ChartLegend
            isBasis3YrAvgNull={this.props.isBasis3YrAvgNull}
            isCashPrice3YrAvgNull={this.props.isCashPrice3YrAvgNull}
            showCurrentBasis={this.props.showCurrentBasis}
            show3YearAverageBasis={this.props.show3YearAverageBasis}
            show3YearAverageCashPrice={this.props.show3YearAverageCashPrice}
          />
        )}
      </ChartContainer>
    );
  }

  private readonly prepareData = (data: ReadonlyArray<CashBidChartData>) => {
    return data.map((d: CashBidChartData) => {
      const chartData = { ...d };
      Object.keys(d)
        .filter((k: string) => d[k] === null)
        // tslint:disable-next-line:no-delete
        .forEach(k => delete chartData[k]);

      return chartData;
    });
  };
}

export default ChartComponent;
