import * as React from "react";
import * as moment from "moment-timezone";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import styled from "../../../../styled-components";
import { SixFactorsMarketsText } from "../../../../interfaces";
import { TABS, MOBILE_WIDTH, TABS_MOBILE } from "../../../../constants";
import Tab from "./tab";

const Tabs = styled("div")`
  display: flex;
  flex-direction: row;
  padding: 20px 10px 10px 10px;
`;

const CreatedDate = styled("p")`
  padding: 0 12px;
`;

const TabContent = styled("div")`
  padding: 12px;
  font-size: 13px;
  text-align: justify;
  color: #5a5a5c;

  /* Default tags values, in case the user page uses normalize.js */
  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    color: #5a5a5c !important;
  }

  strong,
  b {
    font-weight: bold !important;
    color: #5a5a5c !important;
  }

  h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    font-weight: bold;
    color: #5a5a5c !important;
  }

  h2 {
    display: block;
    font-size: 1.5em;
    margin-top: 0.83em;
    margin-bottom: 0.83em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
    color: #5a5a5c !important;
  }

  h3 {
    display: block;
    font-size: 1.17em;
    margin-top: 1em;
    margin-bottom: 1em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
    color: #5a5a5c !important;
  }

  h4 {
    display: block;
    font-size: 1em;
    margin-top: 1.33em;
    margin-bottom: 1.33em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
    color: #5a5a5c !important;
  }

  ol {
    display: block;
    list-style-type: decimal;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    padding-inline-start: 40px;
    color: #5a5a5c !important;
  }

  ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    padding-inline-start: 40px;
    color: #5a5a5c !important;
  }
`;

export interface Props {
  readonly moreInformationTexts: ReadonlyArray<SixFactorsMarketsText>;
  readonly onTabSelect: (activeTab: number) => void;
  readonly activeTab: number;
  readonly width: number;
}

export interface State {
  readonly isExpanded: boolean;
  readonly activeTab: number;
}

export default class Content extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isExpanded: false,
      activeTab: this.props.activeTab,
    };
  }

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <div>
            <Tabs>{this.renderTabs()}</Tabs>
            <CreatedDate>
              {moment(this.props.moreInformationTexts[this.props.activeTab].createdDate).format(
                "M/D/YYYY | h:mm A z",
              )}
            </CreatedDate>
            <TabContent
              dangerouslySetInnerHTML={{
                __html: this.props.moreInformationTexts[this.props.activeTab].text,
              }}
            />
          </div>
        )}
      </I18nConsumer>
    );
  }

  renderTabs = () => {
    return this.props.moreInformationTexts.map((text: SixFactorsMarketsText, index: number) => {
      return (
        <Tab
          key={`tab-${index}`}
          index={index}
          onTabSelect={this.props.onTabSelect}
          activeTab={this.props.activeTab}
          title={
            this.props.width > MOBILE_WIDTH ? TABS[text.textTypeId] : TABS_MOBILE[text.textTypeId]
          }
          width={this.props.width}
        />
      );
    });
  };
}
