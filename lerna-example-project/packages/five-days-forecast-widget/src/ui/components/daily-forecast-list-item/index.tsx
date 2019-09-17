import * as React from "react";
import * as moment from "moment-timezone";
import { Units } from "@dtn/i18n-lib";
import { Consumer as I18nConsumer } from "../../../i18n";
import { DailyForecast } from "../../../interfaces";
import styled, { css } from "../../../styled-components";
import Icon from "../icons";

export interface ItemContainerProps {
  readonly active: boolean;
  readonly allowDaySelection: boolean;
}

const ItemContainer = styled<ItemContainerProps, "div">("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding: 0 0.3125em;
  width: 20%;
  padding-bottom: 10px;
  ${({ active }) =>
    active &&
    css`
      border-bottom: 5px solid #0b94cf;
    `};
  ${({ allowDaySelection }) =>
    allowDaySelection &&
    css`
      &:hover {
        cursor: pointer;
      }
    `};

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
  text-transform: uppercase;
  ${({ active }) =>
    active &&
    css`
      font-weight: bold;
    `};

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
  readonly dailyForecastData: DailyForecast;
  readonly units?: string;
  readonly index: number;
  readonly onDaySelect: (activeDay: number) => void;
  readonly activeDay: number;
  readonly allowDaySelection: boolean;
  readonly timezone?: string;
}

const temperatureUnits = (units?: string) => {
  return units && units.toLowerCase() === "metric" ? "C" : "F";
};

export default class DailyForecastListItem extends React.Component<DailyForecastListItemProps> {
  render(): JSX.Element {
    const dayOfWeek = this.generateDayLabel();
    const degreeSymbol = String.fromCharCode(176);
    const iconWrapper = this.generateWeatherIconWrapper();

    return (
      <I18nConsumer>
        {({ t }) => (
          <ItemContainer
            onClick={this.handleDaySelect}
            active={this.props.activeDay === this.props.index && this.props.allowDaySelection}
            allowDaySelection={this.props.allowDaySelection}
          >
            <Day active={this.props.activeDay === this.props.index && this.props.allowDaySelection}>
              {t(`days.${dayOfWeek}`)}
            </Day>
            <ImageContainer>
              <Icon
                wrapper={iconWrapper}
                icon={`${this.props.dailyForecastData.weatherCode}`}
                color="currentColor"
                width={"95%"}
                height={"35px"}
              />
            </ImageContainer>

            <TemperatureContainer>
              <TemperatureHigh>
                {this.props.dailyForecastData.maxTemperature}
                {degreeSymbol}
                {temperatureUnits(this.props.units)}
              </TemperatureHigh>

              <TemperatureLow>
                {this.props.dailyForecastData.minTemperature}
                {degreeSymbol}
                {temperatureUnits(this.props.units)}
              </TemperatureLow>
            </TemperatureContainer>
          </ItemContainer>
        )}
      </I18nConsumer>
    );
  }

  private readonly handleDaySelect = () => {
    if (this.props.allowDaySelection) {
      this.props.onDaySelect(this.props.index);
    }
  };

  private readonly generateWeatherIconWrapper = () => {
    if (this.props.index !== 0) {
      return "dayIcons";
    } else {
      let sunrise = null;
      let sunset = null;
      let localTime = null;

      if (this.props.timezone) {
        sunrise = moment(this.props.dailyForecastData.sunrise)
          .tz(this.props.timezone)
          .valueOf();
        sunset = moment(this.props.dailyForecastData.sunset)
          .tz(this.props.timezone)
          .valueOf();
        localTime = moment
          .utc()
          .tz(this.props.timezone)
          .valueOf();
      } else {
        sunrise = moment(this.props.dailyForecastData.sunrise).valueOf();
        sunset = moment(this.props.dailyForecastData.sunset).valueOf();
        localTime = moment.utc().valueOf();
      }

      if (localTime > sunrise && localTime < sunset) {
        return "dayIcons";
      }
      return "nightIcons";
    }
  };

  private readonly generateDayLabel = () => {
    return this.props.index === 0
      ? "today"
      : moment(this.props.dailyForecastData.date).format("ddd");
  };
}
