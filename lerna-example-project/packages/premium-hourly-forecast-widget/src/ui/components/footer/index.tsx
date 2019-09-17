import * as React from "react";
import * as moment from "moment-timezone";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled from "../../../styled-components";
import Icon from "../icons";
import { ObservedAt } from "../../../interfaces";

const Footer = styled("div")`
  display: flex;
  align-items: center;
  font-size: 0.75em;
  color: #003764;
  margin-top: 1.25em;
`;

const LogoContainer = styled("div")`
  margin-right: 7px;

  .dtn {
    height: 20px;
  }
`;

export interface Props {
  readonly observedAt?: ObservedAt;
  readonly observedAtTime?: Date;
}

export default class FooterContainer extends React.Component<Props> {
  render(): JSX.Element {
    const observedAtTime = moment(this.props.observedAtTime)
      .tz(moment.tz.guess())
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
                {this.props.observedAt && this.props.observedAt.city
                  ? `${this.props.observedAt.city} - ${t("common.updated").toLowerCase()} ${t(
                      "common.on",
                    )} `
                  : `${t("common.updated")} ${t("common.on")} `}
                {observedAtTime}
              </span>
            </Footer>
          );
        }}
      </I18nConsumer>
    );
  }
}
