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
    align-items: center;

    & > .error-icon {
      padding-right: 3px;
    }
  }
`;

const DocumentationLink = styled("div")`
  margin-top: 5px;
  margin-left: 17px;
  color: #2b2b2b;

  .doc-link {
    color: #4040d2;
  }
`;

export interface Props {
  readonly error?: string;
}

export default class ErrorContainer extends React.Component<Props> {
  render(): JSX.Element {
    const documentationLink = "https://cs-widget-docs.dtn.com/index.html";

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
              {this.props.error && this.props.error.includes("Invalid API key") ? null : (
                <DocumentationLink>
                  <span>{t("errors.seeDocumentation")}</span>
                  <a href={documentationLink} target="_blank" className="doc-link">
                    {documentationLink}
                  </a>
                </DocumentationLink>
              )}
            </Error>
          );
        }}
      </I18nConsumer>
    );
  }
}
