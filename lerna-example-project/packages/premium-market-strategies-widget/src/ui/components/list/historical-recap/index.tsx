import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import { SixFactorsMarketStrategies } from "../../../../interfaces";
import Header from "./header";
import Content from "./content";

export interface Props {
  readonly marketStrategiesData: SixFactorsMarketStrategies;
  readonly isExpanded: boolean;
  readonly toggleExpand: (containerName: string) => void;
}

export default class HistoricalRecap extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <div>
            <Header
              heading="Historical Recap"
              isExpanded={this.props.isExpanded}
              toggleExpand={this.props.toggleExpand}
            />
            {this.props.isExpanded && (
              <Content marketStrategiesData={this.props.marketStrategiesData} />
            )}
          </div>
        )}
      </I18nConsumer>
    );
  }
}
