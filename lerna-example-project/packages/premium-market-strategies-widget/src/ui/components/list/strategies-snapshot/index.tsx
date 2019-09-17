import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import styled from "../../../../styled-components";
import { SixFactorsMarketStrategies } from "../../../../interfaces";
import { FetchMarketStrategies } from "../../../../store";
import { DropdownOption } from "../../common/dropdown";
import Header from "./header";
import Content from "./content";
import { Commodities } from "@dtn/api-lib";

const Wrapper = styled("div")`
  position: relative;
`;

export interface Props {
  readonly dropdownOptions: ReadonlyArray<DropdownOption>;
  readonly marketStrategiesData: SixFactorsMarketStrategies;
  readonly defaultCommodity: Commodities;
  readonly width: number;
  readonly showCommodities: boolean;
  readonly fetchMarketStrategies: (commodity: Commodities) => FetchMarketStrategies;
}

export interface State {
  readonly isExpanded: boolean;
}

export default class StrategiesSnapshot extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <Wrapper>
            <Header
              dropdownOptions={this.props.dropdownOptions}
              marketStrategiesData={this.props.marketStrategiesData}
              defaultCommodity={this.props.defaultCommodity}
              fetchMarketStrategies={this.props.fetchMarketStrategies}
              width={this.props.width}
              showCommodities={this.props.showCommodities}
            />
            <Content
              marketStrategiesData={this.props.marketStrategiesData}
              defaultCommodity={this.props.defaultCommodity}
              width={this.props.width}
            />
          </Wrapper>
        )}
      </I18nConsumer>
    );
  }
}
