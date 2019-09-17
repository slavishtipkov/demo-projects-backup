import * as React from "react";
import styled from "../../../../styled-components";
import { SixFactorsMarketStrategies } from "../../../../interfaces";

const Wrapper = styled("div")`
  padding: 12px;
`;

const Text = styled("div")`
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
  readonly marketStrategiesData: SixFactorsMarketStrategies;
}

export interface State {
  readonly isExpanded: boolean;
}

export default class Content extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    const historicalRecap = this.props.marketStrategiesData.contentTexts.filter(
      c => c.name.toLowerCase() === "historical overview",
    );
    const content =
      historicalRecap.length > 0
        ? historicalRecap[0].text
        : "There is no historical recap available.";

    return (
      <Wrapper>
        <Text dangerouslySetInnerHTML={{ __html: content }} />
      </Wrapper>
    );
  }
}
