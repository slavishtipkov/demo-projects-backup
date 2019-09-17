import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled, { css } from "../../../styled-components";

const HeadersContainer = styled("div")`
  font-size: 14px;
  color: #95989a;
  display: flex;
  padding: 0.3125em 1.5em;
`;

const HeaderItem = styled("div")`
  flex: 1;
  max-width: 30%;
  padding-right: 2px;
  word-break: break-word;
  word-wrap: break-word;

  &:first-of-type {
    max-width: 60%;
    flex-grow: 2;
  }
`;

export interface Props {}

export default class HeaderRowContainer extends React.Component<Props> {
  render(): JSX.Element {
    return <HeadersContainer>{this.renderHeaderRowTitles()}</HeadersContainer>;
  }

  readonly renderHeaderRowTitles = () => {
    const headers: ReadonlyArray<string> = [
      "day",
      "description",
      "highLow",
      "precipChance",
      "precipAmount",
    ];

    return headers.map(item => {
      return (
        <I18nConsumer key={item}>
          {({ t }) => <HeaderItem>{t(`headers.${item}`)}</HeaderItem>}
        </I18nConsumer>
      );
    });
  };
}
