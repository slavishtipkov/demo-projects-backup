import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled from "../../../styled-components";
import Icon from "../icons";

const Error = styled("div")`
  font-size: 12px;
  padding-top: 5px;
  color: #ff4836;
  font-weight: 700;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;

  & > .error-wrapper {
    display: flex;

    & > .error-icon {
      padding-right: 3px;
    }
  }
`;

export interface Props {
  readonly error: string | undefined;
}

export default class ErrorContainer extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => {
          return (
            <Error>
              <div className="error-wrapper">
                <span className="error-icon">
                  <Icon icon="error" color="#ff4836" width="14px" height="14px" wrapper="common" />
                </span>
                <span> {t(`errors.${this.props.error}`)}</span>
              </div>
            </Error>
          );
        }}
      </I18nConsumer>
    );
  }
}
