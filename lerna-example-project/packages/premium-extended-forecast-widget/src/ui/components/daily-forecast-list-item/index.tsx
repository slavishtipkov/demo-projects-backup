import * as React from "react";
import * as moment from "moment-timezone";
import { Moment } from "moment-timezone";
import { Units } from "@dtn/i18n-lib";
import { Consumer as I18nConsumer } from "../../../i18n";
import {
  DailyForecast,
  ShortDate,
  FullDate,
  HourlyObservationData,
  Precipitation,
} from "../../../interfaces";
import { noValue, FIRST_WEATHER_CODE, LAST_WEATHER_CODE } from "../../../constants";
import styled, { css } from "../../../styled-components";
import Icon from "../icons";
import MobileView from "./mobile-view";
import ExpandedViewContainer from "./expanded-view";
import TemperatureContainer from "./temperature-container";
import ImageContainer from "./image-container";
import ArrowContainer from "./arrow-container";
import { getClearOrMostlyClearDescription } from "../../../utils";

const Item = styled("div")`
  border-bottom: 1px solid #d5d5d6;
  position: relative;

  &:last-of-type {
    border-bottom: none;
  }
`;

export interface ItemContainerProps {
  readonly isExtendable: boolean;
}

const ItemContainer = styled<ItemContainerProps, "div">("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.3125em 1.5em;
  ${({ isExtendable }) =>
    isExtendable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `};
`;

export interface DayProps {
  readonly isMobile: boolean;
}

const Day = styled<DayProps, "div">("div")`
  line-height: 19px;
  flex: 1;
  max-width: 30%;
  ${({ isMobile }) =>
    isMobile &&
    css`
      max-width: 35%;
    `};
`;

export interface DayContainerProps {
  readonly isMobile: boolean;
}

const DayContainer = styled<DayContainerProps, "div">("div")`
  ${({ isMobile }) =>
    isMobile &&
    css`
      display: flex;
    `};
`;

const DateContainerWrapper = styled("div")`
  display: flex;
  flex-direction: column;
`;

const DayOfWeek = styled("span")`
  font-weight: bold;
  text-transform: uppercase;
`;

const DateContainer = styled("span")`
  text-transform: uppercase;
`;

export interface ImageContainerProps {
  readonly isMobile: boolean;
}

const Description = styled("span")`
  flex: 1;
  max-width: 30%;
  word-break: break-word;
  word-wrap: break-word;
`;

export interface PrecipChanceProps {
  readonly isDesktop: boolean;
}

const PrecipChance = styled<PrecipChanceProps, "div">("div")`
  ${({ isDesktop }) =>
    isDesktop &&
    css`
      flex: 1;
      max-width: 30%;
    `};
`;

export interface PrecipAmountProps {
  readonly isDesktop: boolean;
}

const PrecipAmount = styled<PrecipAmountProps, "div">("div")`
  ${({ isDesktop }) =>
    isDesktop &&
    css`
      flex: 1;
      max-width: 30%;
    `};
`;

export interface DailyForecastListItemProps {
  readonly dailyForecastData: DailyForecast;
  readonly hourlyObservation: HourlyObservationData;
  readonly units?: string;
  readonly index: number;
  readonly isMobile: boolean;
  readonly timezone?: string;
}

export interface StateProps {
  readonly isExtended: boolean;
}

export default class DailyForecastListItem extends React.Component<
  DailyForecastListItemProps,
  StateProps
> {
  constructor(props: DailyForecastListItemProps) {
    super(props);
    this.state = { isExtended: false };
  }

  render(): JSX.Element {
    const dayOfWeek = this.generateDayLabel();
    const date = this.generateDate();
    const fullDate = this.generateFullDate();
    const iconWrapper = this.generateWeatherIconWrapper();

    const isNightIconShouldBeShown = iconWrapper === "nightIcons";
    const weatherCode = this.props.dailyForecastData
      ? this.props.dailyForecastData.weatherCode
      : undefined;
    const clearOrMostlyClear = getClearOrMostlyClearDescription(
      isNightIconShouldBeShown,
      weatherCode,
    );

    const imageContainer = (
      <ImageContainer
        iconWrapper={iconWrapper}
        weatherCode={this.props.dailyForecastData.weatherCode}
        width={this.props.isMobile ? "95%" : "30px"}
        height={"30px"}
        isMobileView={this.props.isMobile}
      />
    );

    return (
      <I18nConsumer>
        {({ t }) => (
          <Item>
            <ItemContainer
              className="item"
              onClick={this.handleExtendDay}
              isExtendable={this.props.index < 5 && !this.props.isMobile}
            >
              {!this.props.isMobile && (
                <ArrowContainer index={this.props.index} isExpandedView={this.state.isExtended} />
              )}

              <Day isMobile={this.props.isMobile}>
                <DayContainer isMobile={this.props.isMobile}>
                  <DateContainerWrapper>
                    <DayOfWeek>{t(`days.dayOfWeekShort.${dayOfWeek}`)}</DayOfWeek>
                    <DateContainer>{`${t(`months.monthsShort.${date.month}`)} ${
                      date.day
                    }`}</DateContainer>
                  </DateContainerWrapper>
                  {this.props.isMobile && imageContainer}
                </DayContainer>
                {this.props.isMobile && (
                  <Description>
                    {this.props.dailyForecastData.weatherCode >= FIRST_WEATHER_CODE &&
                    this.props.dailyForecastData.weatherCode <= LAST_WEATHER_CODE
                      ? clearOrMostlyClear !== ""
                        ? t(`common.${clearOrMostlyClear}`)
                        : t(`weatherDescriptions.${this.props.dailyForecastData.weatherCode}`)
                      : this.checkFieldValue(this.props.dailyForecastData.weatherDescription) &&
                        this.checkWeatherDescription(
                          this.props.dailyForecastData.weatherDescription,
                        )
                      ? this.props.dailyForecastData.weatherDescription
                      : noValue}
                  </Description>
                )}
              </Day>

              {!this.props.isMobile && imageContainer}
              {!this.props.isMobile && (
                <Description>
                  {this.props.dailyForecastData.weatherCode >= FIRST_WEATHER_CODE &&
                  this.props.dailyForecastData.weatherCode <= LAST_WEATHER_CODE
                    ? clearOrMostlyClear !== ""
                      ? t(`common.${clearOrMostlyClear}`)
                      : t(`weatherDescriptions.${this.props.dailyForecastData.weatherCode}`)
                    : this.checkFieldValue(this.props.dailyForecastData.weatherDescription) &&
                      this.checkWeatherDescription(this.props.dailyForecastData.weatherDescription)
                    ? this.props.dailyForecastData.weatherDescription
                    : noValue}
                </Description>
              )}

              {this.props.isMobile && (
                <MobileView
                  maxTemperature={this.props.dailyForecastData.maxTemperature}
                  minTemperature={this.props.dailyForecastData.minTemperature}
                  precipitation={this.props.dailyForecastData.precipitation}
                  units={this.props.units}
                  convertUnits={this.convertUnits}
                  isMobileView={this.props.isMobile}
                  checkFieldValue={this.checkFieldValue}
                  getPrecipitation={this.getPrecipitation}
                />
              )}

              {!this.props.isMobile && (
                <TemperatureContainer
                  maxTemperature={this.props.dailyForecastData.maxTemperature}
                  minTemperature={this.props.dailyForecastData.minTemperature}
                  isCurrentConditions={false}
                  temperature={0}
                  units={this.props.units}
                  convertUnits={this.convertUnits}
                  isMobileView={this.props.isMobile}
                  checkFieldValue={this.checkFieldValue}
                />
              )}

              {!this.props.isMobile && (
                <PrecipChance isDesktop={!this.props.isMobile}>
                  {this.getPrecipitation(this.props.dailyForecastData.precipitation)
                    .precipChance !== "-"
                    ? `${
                        this.getPrecipitation(this.props.dailyForecastData.precipitation)
                          .precipChance
                      }%`
                    : noValue}
                </PrecipChance>
              )}
              {!this.props.isMobile && (
                <PrecipAmount isDesktop={!this.props.isMobile}>
                  {this.getPrecipitation(this.props.dailyForecastData.precipitation).precipType !==
                  "-"
                    ? `${t(
                        `common.${
                          this.getPrecipitation(this.props.dailyForecastData.precipitation)
                            .precipType
                        }`,
                      )} -
                     ${
                       this.getPrecipitation(this.props.dailyForecastData.precipitation)
                         .precipAmount
                     }`
                    : noValue}
                </PrecipAmount>
              )}
            </ItemContainer>

            {this.state.isExtended && !this.props.isMobile && (
              <ExpandedViewContainer
                index={this.props.index}
                date={`${t(`days.dayOfWeekFull.${fullDate.dayOfWeekFull}`)}, ${t(
                  `months.monthsShort.${fullDate.month}`,
                )} ${date.day}`}
                dailyForecastData={this.props.dailyForecastData}
                hourlyObservation={this.props.hourlyObservation}
                iconWrapper={iconWrapper}
                convertUnits={this.convertUnits}
                units={this.props.units}
                checkFieldValue={this.checkFieldValue}
                showTime={this.showTime}
                timezone={this.props.timezone}
              />
            )}
          </Item>
        )}
      </I18nConsumer>
    );
  }

  private readonly checkWeatherDescription = (weatherDescription?: string) => {
    return typeof weatherDescription === "string";
  };

  private readonly convertUnits = (units?: string) => {
    if (units && units.toLowerCase() === "metric") {
      return {
        temperature: "C",
        distance: "km",
        speed: "kmh",
        amount: "mm",
        pressure: "mbar",
      };
    } else {
      return {
        temperature: "F",
        distance: "mi",
        speed: "mph",
        amount: "in",
        pressure: "inHg",
      };
    }
  };

  private readonly generateWeatherIconWrapper = () => {
    if (this.props.index !== 0) {
      return "dayIcons";
    } else {
      const currentTime = moment.utc().valueOf();
      let currentTimeUtcLocal = null;
      let sunrise = null;
      let sunset = null;

      if (this.props.timezone) {
        currentTimeUtcLocal = moment(currentTime)
          .tz(this.props.timezone)
          .valueOf();
        sunrise = moment(this.props.dailyForecastData.sunrise)
          .tz(this.props.timezone)
          .valueOf();
        sunset = moment(this.props.dailyForecastData.sunset)
          .tz(this.props.timezone)
          .valueOf();
      } else {
        currentTimeUtcLocal = moment(currentTime).valueOf();
        sunrise = moment(this.props.dailyForecastData.sunrise).valueOf();
        sunset = moment(this.props.dailyForecastData.sunset).valueOf();
      }

      return currentTimeUtcLocal > sunrise && currentTimeUtcLocal < sunset
        ? "dayIcons"
        : "nightIcons";
    }
  };

  private readonly generateDayLabel = () => {
    return this.props.index === 0
      ? "today"
      : moment(this.props.dailyForecastData.date).format("ddd");
  };

  private readonly generateDate = (): ShortDate => {
    const formatData = moment.localeData().longDateFormat("ll");
    const formatDataWithoutYear = formatData.replace(/Y/g, "").replace(/^\W|\W$|\W\W/, "");
    const fullDate = moment(this.props.dailyForecastData.date)
      .format(formatDataWithoutYear)
      .toString();
    const date = fullDate.split(" ");

    return {
      month: date[0],
      day: date[1],
    };
  };

  private readonly generateFullDate = (): FullDate => {
    const dayOfWeekFull = moment(this.props.dailyForecastData.date).format("dddd");
    const dataWithoutYear = this.generateDate();

    return {
      dayOfWeekFull,
      month: dataWithoutYear.month,
      day: dataWithoutYear.day,
    };
  };

  private readonly handleExtendDay = () => {
    if (this.props.index < 5) {
      this.setState({ isExtended: !this.state.isExtended });
    }
  };

  private readonly checkFieldValue = (fieldValue: any) => {
    if (fieldValue !== null && fieldValue !== undefined) {
      return true;
    }
    return false;
  };

  private readonly showTime = (date: Moment) => {
    if (this.props.timezone) {
      return moment(date)
        .tz(this.props.timezone)
        .format("h:mm a");
    }
    return moment(date).format("h:mm a");
  };

  private readonly getPrecipitation = (precipitation: ReadonlyArray<Precipitation>) => {
    const units = this.convertUnits(this.props.units);
    const rainPrecipitation = precipitation.find(p => p.type.toLowerCase() === "rain");
    const freezingRainPrecipitation = precipitation.find(
      p => p.type.toLowerCase() === "freezing rain",
    );
    const snowPrecipitation = precipitation.find(p => p.type.toLowerCase() === "snow");

    const quantityOfLiquid = rainPrecipitation ? rainPrecipitation.amount : null;
    const quantityOfIce = freezingRainPrecipitation ? freezingRainPrecipitation.amount : null;
    const quantityOfSnow = snowPrecipitation ? snowPrecipitation.amount : null;

    let precipType = "";
    let precipAmount = "";
    let precipChance = "";

    if (quantityOfLiquid === null || quantityOfLiquid === 0) {
      if (quantityOfLiquid === 0 && rainPrecipitation && rainPrecipitation.probability !== 0) {
        precipType = "rain";
        precipChance = rainPrecipitation ? `${rainPrecipitation.probability}` : "-";
        precipAmount = `L: ${quantityOfLiquid} ${units.amount}`;
      } else {
        precipType = "-";
        precipAmount = "-";
        precipChance = "-";
      }
    } else if (quantityOfSnow !== null && quantityOfSnow !== 0) {
      precipType = "snow";
      precipChance = rainPrecipitation ? `${rainPrecipitation.probability}` : "-";
      const quantityOfSnowConverted = this.convertQuantityOfIce(quantityOfSnow);
      precipAmount = `S: ${quantityOfSnowConverted} ${units.amount} L: ${quantityOfLiquid} ${
        units.amount
      }`;
    } else if (quantityOfIce !== null && quantityOfIce !== 0) {
      precipType = "freezingRain";
      precipChance = rainPrecipitation ? `${rainPrecipitation.probability}` : "-";
      precipAmount = `I: ${quantityOfIce} ${units.amount} L: ${quantityOfLiquid} ${units.amount}`;
    } else {
      precipType = "rain";
      precipChance = rainPrecipitation ? `${rainPrecipitation.probability}` : "-";
      precipAmount = `L: ${quantityOfLiquid} ${units.amount}`;
    }

    return {
      precipType,
      precipAmount,
      precipChance,
    };
  };

  private readonly convertQuantityOfIce = (quantityOfSnow: number) => {
    if (this.props.units && this.props.units.toLowerCase() === "metric") {
      if (quantityOfSnow <= 0) {
        return "0";
      }
      if (quantityOfSnow < 1) {
        return "<1";
      }
      if (quantityOfSnow < 3) {
        return "1-3";
      }
      if (quantityOfSnow < 6) {
        return "3-6";
      }
      if (quantityOfSnow < 10) {
        return "6-10";
      }
      if (quantityOfSnow < 20) {
        return "10-20";
      }
      if (quantityOfSnow < 30) {
        return "20-30";
      }

      return ">30";
    } else {
      if (quantityOfSnow <= 0) {
        return "0";
      }
      if (quantityOfSnow < 0.25) {
        return "<1/4";
      }
      if (quantityOfSnow < 1) {
        return "1/4-1";
      }
      if (quantityOfSnow < 3) {
        return "1-3";
      }
      if (quantityOfSnow < 5) {
        return "3-5";
      }
      if (quantityOfSnow < 7) {
        return "5-7";
      }
      if (quantityOfSnow < 10) {
        return "7-10";
      }
      if (quantityOfSnow < 13) {
        return "10-13";
      }
      if (quantityOfSnow < 15) {
        return "13-15";
      }

      return "15+";
    }
  };
}
