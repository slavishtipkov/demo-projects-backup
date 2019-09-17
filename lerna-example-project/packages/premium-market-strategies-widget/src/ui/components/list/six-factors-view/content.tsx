import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import styled from "../../../../styled-components";
import { SixFactorsMarketStrategies } from "../../../../interfaces";
import Chart from "./chart";

const Wrapper = styled("div")`
  padding: 12px;
`;

export interface Props {
  readonly marketStrategiesData: SixFactorsMarketStrategies;
  readonly charts: ReadonlyArray<{ readonly url: string; readonly id: string }>;
}

export interface State {
  readonly isExpanded: boolean;
}

export default class Content extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    return <I18nConsumer>{({ t }) => <Wrapper>{this.renderCharts()}</Wrapper>}</I18nConsumer>;
  }

  renderCharts = () => {
    return this.props.marketStrategiesData.charts.map((chart, index) => {
      const chartBlob = this.props.charts.find(chartImage => chartImage.id === chart.chartId);

      return (
        <Chart
          key={index}
          title={chart.title}
          description={chart.description}
          chartBlob={chartBlob}
        />
      );
    });
  };
}
