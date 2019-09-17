import * as React from "react";
import * as moment from "moment-timezone";
import { Units } from "@dtn/i18n-lib";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled, { css } from "../../../styled-components";
import Icon from "../icons";
import { ICON_RISC_COLORS } from "../../../constants";
import { SprayOutlookForecast } from "@dtn/api-lib";

export interface ItemContainerProps {
  readonly active: boolean;
}

const ItemContainer = styled<ItemContainerProps, "div">("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding: 0 0.3125em;
  width: 20%;
  padding-bottom: 5px;
  ${({ active }) =>
    active &&
    css`
      border-bottom: 5px solid #0b94cf;
    `};

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 320px) {
    flex-direction: row;
    align-items: center;
    width: 100%;
  }
`;

export interface DayProps {
  readonly active: boolean;
}

const Day = styled<DayProps, "div">("div")`
  font-weight: normal;
  font-weight: bold;
  color: #333333;

  @media (max-width: 320px) {
    flex: 1;
  }
`;

const ImageContainer = styled("div")`
  margin: 0.3125em 0;
  text-align: center;
  height: auto;
  overflow: hidden;

  @media (max-width: 320px) {
    flex: 1;
  }
`;

const TemperatureContainer = styled("div")`
  display: flex;
  flex-direction: column;
  font-size: 0.875em;

  @media (max-width: 320px) {
    flex: 1;
    align-items: flex-end;
  }
`;

const TemperatureHigh = styled("span")`
  font-weight: bold;
`;

const TemperatureLow = styled("span")`
  font-weight: normal;
`;

export interface DailyForecastListItemProps {
  readonly units?: string;
  readonly index: number;
  readonly onDaySelect: (activeDay: number) => void;
  readonly activeDay: number;
  readonly sprayOutlookForecast: SprayOutlookForecast;
}

const temperatureUnits = (units?: string) => {
  return units && units.toLowerCase() === "metric" ? "C" : "F";
};

export default class DailyForecastListItem extends React.Component<DailyForecastListItemProps> {
  render(): JSX.Element {
    const dayOfWeek = this.generateDayLabel();
    const degreeSymbol = String.fromCharCode(176);
    const iconWrapper = "common";
    const iconColor = this.props.sprayOutlookForecast
      ? ICON_RISC_COLORS[this.props.sprayOutlookForecast.days[this.props.index].risk.value]
      : "";

    return (
      <I18nConsumer>
        {({ t }) => (
          <ItemContainer
            onClick={this.handleDaySelect}
            active={this.props.activeDay === this.props.index}
          >
            <Day active={this.props.activeDay === this.props.index}>{t(`days.${dayOfWeek}`)}</Day>
            <ImageContainer>
              <Icon
                wrapper={iconWrapper}
                icon={this.props.sprayOutlookForecast.days[this.props.index].risk.value}
                color={iconColor}
                width={"70%"}
                height={"35px"}
              />
            </ImageContainer>
          </ItemContainer>
        )}
      </I18nConsumer>
    );
  }

  private readonly handleDaySelect = () => {
    this.props.onDaySelect(this.props.index);
  };

  private readonly generateDayLabel = () => {
    let m = moment(this.props.sprayOutlookForecast.days[this.props.index].date).tz(
      this.props.sprayOutlookForecast.station.timezoneId,
    );
    let t = moment().tz(this.props.sprayOutlookForecast.station.timezoneId);
    return m.isSame(t, "day") ? "today" : m.format("ddd");
  };
}
