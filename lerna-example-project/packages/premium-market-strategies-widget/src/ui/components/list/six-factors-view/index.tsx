import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import { SixFactorsMarketStrategies } from "../../../../interfaces";
import Header from "./header";
import Content from "./content";

export interface Props {
  readonly marketStrategiesData: SixFactorsMarketStrategies;
  readonly charts: ReadonlyArray<{ readonly url: string; readonly id: string }>;
  readonly isExpanded: boolean;
  readonly toggleExpand: (containerName: string) => void;
}

export default class SixFactorsView extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <div>
            <Header
              heading={`DTN Six Factors${String.fromCharCode(174)} View`}
              isExpanded={this.props.isExpanded}
              toggleExpand={this.props.toggleExpand}
            />
            {this.props.isExpanded && (
              <Content
                marketStrategiesData={this.props.marketStrategiesData}
                charts={this.props.charts}
              />
            )}
          </div>
        )}
      </I18nConsumer>
    );
  }
}
