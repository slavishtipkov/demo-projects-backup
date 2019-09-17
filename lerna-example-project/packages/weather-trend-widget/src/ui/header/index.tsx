import * as React from "react";
import * as moment from "moment-timezone";
import styled from "../../styled-components";
import { Consumer as I18nConsumer } from "../../i18n";
import { WeatherFields } from "../../interfaces";

const HeaderContainer = styled("div")`
  color: #59595b;
  padding: 0 15px;
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
  readonly weatherField: WeatherFields;
  readonly dateRange: [Date, Date];
  readonly updatedAt: Date;
}

export default class Header extends React.Component<Props> {
  render(): JSX.Element {
    let format = "MMMM Do, YYYY";
    let start = moment(this.props.dateRange[0])
      .utc()
      .format(format);
    let end = moment(this.props.dateRange[1])
      .utc()
      .format(format);
    return (
      <I18nConsumer>
        {({ t }) => (
          <HeaderContainer>
            <TitleContainer>{t(`weatherFields.${this.props.weatherField}`)}</TitleContainer>
            <DateContainer>{`${start} - ${end}`}</DateContainer>
          </HeaderContainer>
        )}
      </I18nConsumer>
    );
  }
}
