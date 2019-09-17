import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled from "../../../styled-components";

const Error = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 220px;
  text-transform: uppercase;
  background-color: rgba(230, 230, 230, 0.6);
  border: 1px solid #bfbfbf;
  color: #59595b;
  opacity: 0.6;
  font-size: 19px;
  margin-top: 15px;
  margin-left: 7px;
`;

export interface Props {
  readonly error?: string;
}

export default class NoDataErrorContainer extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => {
          return <Error>{t(`errors.${this.props.error}`)}</Error>;
        }}
      </I18nConsumer>
    );
  }
}
