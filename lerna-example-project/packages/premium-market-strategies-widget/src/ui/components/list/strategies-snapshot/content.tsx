import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import styled from "../../../../styled-components";
import { Positions, SixFactorsMarketStrategies } from "../../../../interfaces";
import PositionTable from "./positions-table";
import { MOBILE_WIDTH } from "../../../../constants";
import { Commodities } from "@dtn/api-lib";

const Wrapper = styled("div")`
  padding: 12px;
`;

const Heading = styled("div")`
  font-size: 17px;
  margin-bottom: 10px;
`;

const Subheading = styled("div")`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export interface PositionsProps {
  readonly width: number;
}

const Positions = styled<PositionsProps, "div">("div")`
  display: flex;
  flex-direction: ${({ width }) => (width <= MOBILE_WIDTH ? "column" : "row")};

  .positions-heading {
    font-weight: bold;
  }
`;

const Texts = styled("div")`
  margin-top: 10px;
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
  readonly marketStrategiesData: SixFactorsMarketStrategies;
  readonly width: number;
  readonly defaultCommodity: Commodities;
}

export interface State {
  readonly isExpanded: boolean;
}

export default class Content extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <Wrapper>
            <Heading>{t("labels.strategiesSnapshot")}</Heading>
            <Subheading>
              {t(`commodities.${this.props.defaultCommodity}`)} {t("labels.positions")}
            </Subheading>
            <Positions width={this.props.width}>{this.renderPositions()}</Positions>
            <Texts
              dangerouslySetInnerHTML={{
                __html: this.props.marketStrategiesData.contentTexts[0].text,
              }}
            />
          </Wrapper>
        )}
      </I18nConsumer>
    );
  }

  private readonly renderPositions = () => {
    if (!this.props.marketStrategiesData.positions) {
      return <>{"No positions available"}</>;
    }
    return this.props.marketStrategiesData.positions
      .slice(0, 2)
      .map((position: Positions, i: number) => {
        return <PositionTable position={position} key={i} width={this.props.width} />;
      });
  };
}
