import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import { SixFactorsMarketsText } from "../../../../interfaces";
import Header from "./header";
import Content from "./content";

export interface Props {
  readonly moreInformationTexts: ReadonlyArray<SixFactorsMarketsText>;
  readonly width: number;
  readonly isExpanded: boolean;
  readonly toggleExpand: (containerName: string) => void;
}

export interface State {
  readonly activeTab: number;
}

export default class MoreInformation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <div>
            <Header
              heading="More Information"
              isExpanded={this.props.isExpanded}
              toggleExpand={this.props.toggleExpand}
            />
            {this.props.isExpanded && (
              <Content
                moreInformationTexts={this.props.moreInformationTexts}
                activeTab={this.state.activeTab}
                onTabSelect={this.setActiveTab}
                width={this.props.width}
              />
            )}
          </div>
        )}
      </I18nConsumer>
    );
  }

  private readonly setActiveTab = (tabIndex: number) => {
    this.setState({
      activeTab: tabIndex,
    });
  };
}
