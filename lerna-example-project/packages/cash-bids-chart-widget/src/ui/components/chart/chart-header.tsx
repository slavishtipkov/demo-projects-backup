import * as React from "react";
import * as moment from "moment-timezone";
import styled from "../../../styled-components";
import { Consumer as I18nConsumer } from "../../../i18n";
import { DisplayDate } from "../../../interfaces";
import Icon from "../icons";

const HeaderContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #59595b;
  padding: 0 15px;
`;

const IconContainer = styled("div")`
  margin-right: 5px;

  .dtn {
    height: 20px;
  }
`;

const TitleContainer = styled("p")`
  margin: 5px 0;
  font-weight: bold;
  font-size: 18px;
`;

const DateContainer = styled("p")`
  margin: 5px 0;
  font-size: 12px;
`;

export interface Props {
  readonly updatedAt?: string;
  readonly location?: string;
  readonly commodity?: string;
  readonly deliveryEndDate?: string;
  readonly hasChartData: boolean;
}

export default class ChartHeader extends React.Component<Props> {
  render(): JSX.Element {
    const deliveryEndDate = this.generateDate(
      this.props.deliveryEndDate ? this.props.deliveryEndDate : "",
    );
    const updatedAt = this.generateDate(this.props.updatedAt ? this.props.updatedAt : "");

    return (
      <I18nConsumer>
        {({ t }) => (
          <HeaderContainer>
            <div>
              {this.props.hasChartData && (
                <div>
                  <TitleContainer>{`${this.props.location} - ${
                    this.props.commodity
                  }`}</TitleContainer>
                  <DateContainer>{`${t("deliveryEndDate")} ${
                    deliveryEndDate.month ? t(`months.${deliveryEndDate.month}`) : ""
                  } ${deliveryEndDate.date}`}</DateContainer>
                  <DateContainer>{`${t("updated")} ${
                    updatedAt.month ? t(`months.${updatedAt.month}`) : ""
                  } ${updatedAt.date}`}</DateContainer>
                </div>
              )}
            </div>
            <IconContainer>
              <img
                className="dtn"
                src="https://www.dtn.com/wp-content/uploads/2018/11/logo-dtn.png"
              />
            </IconContainer>
          </HeaderContainer>
        )}
      </I18nConsumer>
    );
  }

  private readonly generateDate = (
    date: string,
  ): { readonly month: string; readonly date: string } => {
    if (date !== "") {
      return {
        month: moment
          .utc(date)
          .local()
          .format("MMMM"),
        date: moment
          .utc(date)
          .local()
          .format(" D, YYYY h:mmA"),
      };
    } else {
      return {
        month: "",
        date: "",
      };
    }
  };
}
