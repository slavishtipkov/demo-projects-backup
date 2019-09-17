import * as React from "react";
import * as moment from "moment-timezone";
import { Moment } from "moment-timezone";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import { Units } from "@dtn/i18n-lib";
import {
  Coordinates,
  DailySurfaceData,
  HourlySurfaceData,
  ForecastProps,
  ObservedAt,
  FullDate,
} from "../../../interfaces";
import { Consumer as I18nConsumer } from "../../../i18n";
import {
  FetchCurrentConditionsDataAction,
  SetErrorMessageAction,
  ChangeCurrentConditionsByForecast,
} from "../../../store/actions";
import LoadingIndicator from "../../components/loader";
import { ERRORS } from "../../../constants";
import ErrorContainer from "../../components/error-container";
import FooterContainer from "../../components/footer";
import CurrentConditionsByObservation from "../../components/current-conditions-by-observation";
import CurrentConditionsByForecast from "../../components/current-conditions-by-forecast";

export const Message = styled.p`
  display: block;
  max-width: 90%;
  margin: 30px auto 0;
  font-family: LatoBold, sans-serif;
  font-size: 14px;
  text-align: center;
`;

export const ForecastContainer = styled.div`
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  width: 100%;
  padding-bottom: 10px;
  text-align: left;
`;

export interface Props {
  readonly loading: boolean;
  readonly visibleFields: ForecastProps;
  readonly currentConditionsByObservation?: ReadonlyArray<HourlySurfaceData>;
  readonly currentConditionsByForecast?: ReadonlyArray<DailySurfaceData>;
  readonly error?: string;
  readonly coordinates: Coordinates;
  readonly days: number;
  readonly theme?: ThemeProp;
  readonly units?: string;
  readonly fetchCurrentConditionsDataAction: (
    coordinates: Coordinates,
    days: number,
    units?: string,
  ) => FetchCurrentConditionsDataAction;
  readonly setErrorMessage: (error: string) => SetErrorMessageAction;
  readonly changeCurrentConditionsByForecast: (
    currentConditionsByForecast: ReadonlyArray<DailySurfaceData>,
  ) => ChangeCurrentConditionsByForecast;
  readonly observedAt?: ObservedAt;
  readonly observedAtTime?: Date;
  readonly timezone?: string;
  readonly showCurrentObservation?: boolean;
}

export default class extends React.Component<Props> {
  static defaultProps: Partial<Props> = {};

  componentDidMount() {
    const isLatValid =
      this.props.coordinates && this.props.coordinates.lat
        ? this.props.coordinates.lat > -90 && this.props.coordinates.lat < 90
          ? true
          : false
        : false;
    const isLgtValid =
      this.props.coordinates && this.props.coordinates.lon
        ? this.props.coordinates.lon > -180 && this.props.coordinates.lon < 180
          ? true
          : false
        : false;

    if (this.props.coordinates.stationId) {
      this.props.fetchCurrentConditionsDataAction(
        this.props.coordinates,
        this.props.days,
        this.props.units,
      );
    } else if (isLatValid && isLgtValid) {
      this.props.fetchCurrentConditionsDataAction(
        this.props.coordinates,
        this.props.days,
        this.props.units,
      );
    } else {
      const errorMessage = ERRORS.invalidCoordinatesMessage;
      this.props.setErrorMessage(errorMessage.key);
    }
  }

  render(): JSX.Element {
    const currentDate = this.props.currentConditionsByForecast
      ? this.props.currentConditionsByForecast[0].date.toString()
      : "";
    const fullDate = this.generateFullDate(currentDate);
    const day = this.props.currentConditionsByForecast
      ? moment(this.props.currentConditionsByForecast[0].date).format("D")
      : "";

    const currentConditionsByObservationDay =
      this.props.currentConditionsByObservation && this.props.currentConditionsByObservation[0]
        ? moment(this.props.currentConditionsByObservation[0].localTime).format("D")
        : "";
    const currentConditionsByForecastDay =
      this.props.currentConditionsByForecast && this.props.currentConditionsByForecast[0]
        ? moment(this.props.currentConditionsByForecast[0].date).format("D")
        : "";
    const isToday =
      currentConditionsByObservationDay === currentConditionsByForecastDay ||
      currentConditionsByForecastDay === "";
    const iconWrapper = isToday ? this.generateWeatherIconWrapper() : "dayIcons";

    if (this.props.loading) {
      return <LoadingIndicator />;
    } else if (this.props.error) {
      return <ErrorContainer error={this.props.error} />;
    } else if (this.props.showCurrentObservation && isToday) {
      return (
        <ForecastContainer>
          <CurrentConditionsByObservation
            forecast={this.props.currentConditionsByObservation}
            iconWrapper={iconWrapper}
            visibleFields={this.props.visibleFields}
            units={this.props.units}
            temperatureUnits={this.temperatureUnits}
            speedUnits={this.speedUnits}
            pressureUnits={this.pressureUnits}
            sunrise={
              this.props.currentConditionsByForecast && this.props.currentConditionsByForecast[0]
                ? this.showTime(this.props.currentConditionsByForecast[0].sunrise)
                : ""
            }
            sunset={
              this.props.currentConditionsByForecast && this.props.currentConditionsByForecast[0]
                ? this.showTime(this.props.currentConditionsByForecast[0].sunset)
                : ""
            }
          />
          <FooterContainer
            observedAt={this.props.observedAt}
            observedAtTime={this.props.observedAtTime}
          />
        </ForecastContainer>
      );
    } else {
      return (
        <ForecastContainer>
          <CurrentConditionsByForecast
            forecast={this.props.currentConditionsByForecast}
            fullDate={fullDate}
            day={day}
            iconWrapper={iconWrapper}
            visibleFields={this.props.visibleFields}
            units={this.props.units}
            temperatureUnits={this.temperatureUnits}
            pressureUnits={this.pressureUnits}
            speedUnits={this.speedUnits}
            showTime={this.showTime}
          />
          <FooterContainer
            observedAt={this.props.observedAt}
            observedAtTime={this.props.observedAtTime}
          />
        </ForecastContainer>
      );
    }
  }

  private readonly temperatureUnits = (units: string | undefined) => {
    const degreeSymbol = String.fromCharCode(176);
    return units && units.toLowerCase() === "metric" ? degreeSymbol + "C" : degreeSymbol + "F";
  };

  private readonly speedUnits = (units: string | undefined) => {
    return units && units.toLowerCase() === "metric" ? "kmh" : "mph";
  };

  private readonly pressureUnits = (units: string | undefined) => {
    return units && units.toLowerCase() === "metric" ? "mbar" : "inHg";
  };

  private readonly generateWeatherIconWrapper = () => {
    if (
      this.props.currentConditionsByForecast &&
      this.props.currentConditionsByForecast.length > 0
    ) {
      let sunrise = null;
      let sunset = null;
      let localTime = null;
      const firstDayForecast = this.props.currentConditionsByForecast[0];

      if (this.props.timezone) {
        sunrise = moment(firstDayForecast.sunrise)
          .tz(this.props.timezone)
          .valueOf();
        sunset = moment(firstDayForecast.sunset)
          .tz(this.props.timezone)
          .valueOf();
        localTime = moment
          .utc()
          .tz(this.props.timezone)
          .valueOf();
      } else {
        sunrise = moment(firstDayForecast.sunrise).valueOf();
        sunset = moment(firstDayForecast.sunset).valueOf();
        localTime = moment.utc().valueOf();
      }

      if (localTime > sunrise && localTime < sunset) {
        return "dayIcons";
      }
      return "nightIcons";
    } else {
      return "dayIcons";
    }
  };

  private readonly generateFullDate = (date: string): FullDate => {
    const dayOfWeekFull = moment(date).format("dddd");
    const formatData = moment.localeData().longDateFormat("ll");
    const formatDataWithoutYear = formatData.replace(/Y/g, "").replace(/^\W|\W$|\W\W/, "");
    const fullDate = moment(date)
      .format(formatDataWithoutYear)
      .toString();
    const dataWithoutYear = fullDate.split(" ");

    return {
      dayOfWeekFull,
      month: dataWithoutYear[0],
      day: dataWithoutYear[1],
    };
  };

  private readonly showTime = (date: Moment) => {
    if (this.props.timezone) {
      return moment(date)
        .tz(this.props.timezone)
        .format("h:mm a");
    }

    return moment(date).format("h:mm a");
  };
}
