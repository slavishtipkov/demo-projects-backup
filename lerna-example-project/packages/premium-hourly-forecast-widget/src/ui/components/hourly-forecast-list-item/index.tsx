import * as React from "react";
import * as moment from "moment-timezone";
import { Units } from "@dtn/i18n-lib";
import { Consumer as I18nConsumer } from "../../../i18n";
import { HourlyForecast, VisibleFields, DayForecast, PrecipType } from "../../../interfaces";
import styled, { css } from "../../../styled-components";
import Icon from "../icons";
import { Subject } from "rxjs";
import { FIRST_WEATHER_CODE, LAST_WEATHER_CODE } from "../../../constants";
import { getWindDirection, getClearOrMostlyClearDescription } from "../../../utils";

export interface ItemContainerProps {
  readonly endOfDay?: boolean;
  readonly hasDayRow: boolean;
  readonly descriptionHeight: number;
  readonly precipTypeHeight: number;
  readonly precipAmountHeight: number;
  readonly degHeight: number;
}

const ItemContainer = styled<ItemContainerProps, "div">("div")`
  padding: 0 4px;
  border-top: 0.5px solid #d5d5d6;
  word-break: break-word;
  word-wrap: break-word;
  box-sizing: content-box !important;

  ${({ endOfDay }) =>
    endOfDay &&
    css`
      border-right: 0.5px solid #d5d5d6;
    `};

  ${({ hasDayRow }) =>
    !hasDayRow &&
    css`
      border-top: none;
    `};

  & > .weatherIcon {
    padding: 0 5px;
    overflow: hidden;
  }

  & > .weatherDesc {
    ${({ descriptionHeight }) =>
      descriptionHeight &&
      css`
        height: ${descriptionHeight}px;
      `};
  }

  & > .precipType {
    ${({ precipTypeHeight }) =>
      precipTypeHeight &&
      css`
        height: ${precipTypeHeight}px;
      `};
  }

  & > .degItem {
    ${({ degHeight }) =>
      degHeight &&
      css`
        height: ${degHeight}px;
        font-weight: normal;
      `};
  }

  & > .precipAmount {
    ${({ precipAmountHeight }) =>
      precipAmountHeight &&
      css`
        height: ${precipAmountHeight}px;
      `};
  }
`;

export interface HourProps {}

const ColItem = styled("div")`
  padding: 9.6px 5px;
  width: 76px;
  text-align: center;
  box-sizing: content-box !important;
`;

export interface HourlyForecastListItemProps {
  readonly hourlyForecastData: HourlyForecast;
  readonly visibleFields: VisibleFields;
  readonly units?: string;
  readonly index: number;
  readonly endOfDay?: boolean;
  readonly weatherSubject: Subject<number>;
  readonly precipTypeSubject: Subject<number>;
  readonly precipAmountSubject: Subject<number>;
  readonly weatherDegSubject: Subject<number>;
  readonly degHeight: number;
  readonly precipTypeHeight: number;
  readonly precipAmountHeight: number;
  readonly descriptionHeight: number;
  readonly dayForecastData?: ReadonlyArray<DayForecast>;
  readonly timezone?: string;
  readonly precipData: {
    readonly precipType: string | undefined;
    readonly precipAmount: string | undefined;
    readonly precipChance: string | undefined;
  };
}

export default class HourlyForecastListItem extends React.Component<HourlyForecastListItemProps> {
  private weatherDescRef: any;
  private precipTypeRef: any;
  private precipAmountRef: any;
  private degRef: any;

  componentDidMount(): void {
    if (this.weatherDescRef) {
      this.props.weatherSubject.next(this.weatherDescRef.clientHeight);
    }
    if (this.precipTypeRef) {
      this.props.precipTypeSubject.next(this.precipTypeRef.clientHeight);
    }
    if (this.degRef) {
      this.props.weatherDegSubject.next(this.degRef.clientHeight);
    }
    if (this.precipAmountRef) {
      this.props.precipAmountSubject.next(this.precipAmountRef.clientHeight);
    }
  }

  render(): JSX.Element {
    const degreeSymbol = String.fromCharCode(176);
    const iconWrapper = this.generateWeatherIconWrapper(this.props.hourlyForecastData);

    const isNightIconShouldBeShown = iconWrapper === "nightIcons";
    const weatherCode = this.props.hourlyForecastData
      ? this.props.hourlyForecastData.weatherCode
      : undefined;
    const clearOrMostlyClear = getClearOrMostlyClearDescription(
      isNightIconShouldBeShown,
      weatherCode,
    );

    return (
      <I18nConsumer>
        {({ t }) => (
          <ItemContainer
            endOfDay={this.props.endOfDay}
            hasDayRow
            descriptionHeight={this.props.descriptionHeight}
            precipTypeHeight={this.props.precipTypeHeight}
            precipAmountHeight={this.props.precipAmountHeight}
            degHeight={this.props.degHeight}
          >
            <ColItem>{this.getHour()}</ColItem>

            <ColItem className="weatherIcon">
              <Icon
                wrapper={iconWrapper}
                icon={`${this.props.hourlyForecastData.weatherCode}`}
                color="currentColor"
                width={"95%"}
                height={"35px"}
              />
            </ColItem>

            {this.props.visibleFields.skyCover && (
              <ColItem
                className="weatherDesc"
                // tslint:disable-next-line:jsx-no-lambda
                innerRef={comp => (this.weatherDescRef = comp)}
              >
                {this.props.hourlyForecastData.weatherDescription
                  ? this.props.hourlyForecastData.weatherCode &&
                    this.props.hourlyForecastData.weatherCode >= FIRST_WEATHER_CODE &&
                    this.props.hourlyForecastData.weatherCode <= LAST_WEATHER_CODE
                    ? clearOrMostlyClear !== ""
                      ? t(`common.${clearOrMostlyClear}`)
                      : t(`weatherDescriptions.${this.props.hourlyForecastData.weatherCode}`)
                    : this.props.hourlyForecastData.weatherDescription &&
                      this.checkWeatherDescription(this.props.hourlyForecastData.weatherDescription)
                    ? this.props.hourlyForecastData.weatherDescription
                    : "-"
                  : "-"}
              </ColItem>
            )}

            {this.props.visibleFields.temp_feelsLike && (
              <ColItem
                className="degItem"
                // tslint:disable-next-line:jsx-no-lambda
                innerRef={comp => (this.degRef = comp)}
              >
                {`${this.getTemperature(degreeSymbol)}${this.temperatureUnits(
                  this.props.units,
                )} / ${this.getFeelsLike(degreeSymbol)}${this.temperatureUnits(this.props.units)}`}
              </ColItem>
            )}

            {this.props.visibleFields.windDirections && (
              <ColItem>
                {this.checkFieldValue(this.props.hourlyForecastData.windDirection)
                  ? getWindDirection(this.props.hourlyForecastData.windDirection)
                  : "-"}
              </ColItem>
            )}

            {this.props.visibleFields.windSpeeds && (
              <ColItem>
                {this.checkFieldValue(this.props.hourlyForecastData.windSpeed)
                  ? `${this.props.hourlyForecastData.windSpeed}${this.speedUnits()}`
                  : "-"}
              </ColItem>
            )}

            {this.props.visibleFields.dewPoint && (
              <ColItem>
                {this.checkFieldValue(this.props.hourlyForecastData.dewPoint)
                  ? `${this.props.hourlyForecastData.dewPoint}${degreeSymbol}`
                  : "-"}
              </ColItem>
            )}

            {this.props.visibleFields.humidity && (
              <ColItem>
                {this.checkFieldValue(this.props.hourlyForecastData.relativeHumidity)
                  ? `${this.props.hourlyForecastData.relativeHumidity}%`
                  : "-"}
              </ColItem>
            )}

            {this.props.visibleFields.precipType && (
              <ColItem
                className="precipType"
                // tslint:disable-next-line:jsx-no-lambda
                innerRef={comp => (this.precipTypeRef = comp)}
              >
                {this.checkFieldValue(this.props.precipData.precipType)
                  ? t(`common.${this.props.precipData.precipType}`)
                  : "-"}
              </ColItem>
            )}

            {this.props.visibleFields.precipChance && (
              <ColItem>
                {this.checkFieldValue(this.props.precipData.precipChance)
                  ? `${this.props.precipData.precipChance}%`
                  : "-"}
              </ColItem>
            )}

            {this.props.visibleFields.precipAmount && (
              <ColItem
                className="precipAmount"
                // tslint:disable-next-line:jsx-no-lambda
                innerRef={comp => (this.precipAmountRef = comp)}
              >
                {this.checkFieldValue(this.props.precipData.precipAmount)
                  ? `${this.props.precipData.precipAmount}`
                  : "-"}
              </ColItem>
            )}
          </ItemContainer>
        )}
      </I18nConsumer>
    );
  }

  private readonly checkWeatherDescription = (weatherDescription?: string) => {
    return typeof weatherDescription === "string";
  };

  private readonly getTemperature = (degreeSymbol: string) => {
    return this.checkFieldValue(this.props.hourlyForecastData.temperature!)
      ? `${this.props.hourlyForecastData.temperature}${degreeSymbol}`
      : "-";
  };

  private readonly getFeelsLike = (degreeSymbol: string) => {
    return this.checkFieldValue(this.props.hourlyForecastData.feelsLike)
      ? `${this.props.hourlyForecastData.feelsLike}${degreeSymbol}`
      : "-";
  };

  private readonly temperatureUnits = (units?: string) => {
    return units && units.toLowerCase() === "metric" ? "C" : "F";
  };

  private readonly precipitationAmountUnits = () => {
    return this.props.units && this.props.units.toLowerCase() === "metric" ? "mm" : "in";
  };

  private readonly speedUnits = () => {
    return this.props.units && this.props.units.toLowerCase() === "metric" ? "kmh" : "mph";
  };

  private readonly checkFieldValue = (fieldValue: any) => {
    if (fieldValue !== null && fieldValue !== undefined) {
      return true;
    }
    return false;
  };

  private readonly getHour = () => {
    if (this.props.timezone) {
      return moment(this.props.hourlyForecastData.utcTime)
        .tz(this.props.timezone)
        .format("ha");
    }
    return moment(this.props.hourlyForecastData.utcTime).format("ha");
  };

  private readonly generateWeatherIconWrapper = (hourlyForecast: HourlyForecast) => {
    if (this.props.dayForecastData) {
      const dayForecast: ReadonlyArray<DayForecast> = this.props.dayForecastData.filter(d => {
        if (
          this.props.timezone &&
          moment(d.sunset)
            .tz(this.props.timezone)
            .date() ===
            moment(hourlyForecast.utcTime)
              .tz(this.props.timezone)
              .date()
        ) {
          return d;
        } else if (
          !this.props.timezone &&
          moment(d.sunset).date() === moment(hourlyForecast.utcTime).date()
        ) {
          return d;
        }
      });

      if (dayForecast.length !== 0) {
        let sunrise = null;
        let sunset = null;
        let localTime = null;

        if (this.props.timezone) {
          sunrise = moment(dayForecast[0].sunrise)
            .tz(this.props.timezone)
            .valueOf();
          sunset = moment(dayForecast[0].sunset)
            .tz(this.props.timezone)
            .valueOf();
          localTime = moment(hourlyForecast.utcTime)
            .tz(this.props.timezone)
            .valueOf();
        } else {
          sunrise = moment(dayForecast[0].sunrise).valueOf();
          sunset = moment(dayForecast[0].sunset).valueOf();
          localTime = moment(hourlyForecast.utcTime).valueOf();
        }

        if (localTime > sunrise && localTime < sunset) {
          return "dayIcons";
        }
        return "nightIcons";
      }
      return "dayIcons";
    }
    return "dayIcons";
  };
}
