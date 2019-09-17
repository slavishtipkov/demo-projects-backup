import * as moment from "moment-timezone";
import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled from "../../../styled-components";

const Footer = styled("div")`
  display: flex;
  align-items: center;
  font-size: 0.75em;
  color: #5c5c5c !important;
  margin-top: 1.25em;
`;

const LogoContainer = styled("div")`
  margin-right: 7px;

  .dtn {
    height: 20px;
  }
`;

export interface Props {
  readonly observedAt: { readonly city: string; readonly time: Date };
  readonly timezone: string;
}

export default class FooterContainer extends React.Component<Props> {
  render(): JSX.Element {
    const observedAtTime = moment(this.props.observedAt.time)
      .tz(this.props.timezone)
      .format("ddd h:mm A zz");

    return (
      <I18nConsumer>
        {({ t }) => {
          return (
            <Footer>
              <LogoContainer>
                <img
                  className="dtn"
                  src="https://www.dtn.com/wp-content/uploads/2018/11/logo-dtn.png"
                />
              </LogoContainer>
              <span>
                {`${this.props.observedAt.city} - ${t("common.updated").toLowerCase()} ${t(
                  "common.on",
                )} ${observedAtTime}`}
              </span>
            </Footer>
          );
        }}
      </I18nConsumer>
    );
  }
}
