import { Units } from "@dtn/i18n-lib";
import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import { DailyForecast, Coordinates, ObservedAt } from "../../../interfaces";
import {
  FetchWeatherForecastData,
  SelectActiveDay,
  SetAllowDaySelection,
  SetErrorMessage,
  HideFooter,
} from "../../../store";
import styled, { ThemeProvider, ThemeProp } from "../../../styled-components";
import DailyForecastList from "../../components/daily-forecast-list";
import { ERRORS, numberOfDaysAllowed } from "../../../constants";

let Reset = styled.div`
  h1 {
    margin: 0;
  }

  ol,
  ul {
    margin: 0;
    padding: 0;
  }
`;

export interface Props {
  readonly theme?: ThemeProp;
  readonly units?: string;
  readonly weatherForecastData: ReadonlyArray<DailyForecast>;
  readonly coordinates: Coordinates;
  readonly days: number;
  readonly allowDaySelection: boolean;
  readonly activeDay: number;
  readonly fetchWeatherForecastData: (
    coordinates: Coordinates,
    days: number,
    units?: string,
    showFooter?: boolean,
  ) => FetchWeatherForecastData;
  readonly setActiveDay: (activeDay: number) => SelectActiveDay;
  readonly setAllowDaySelection: (allowDaySelection: boolean) => SetAllowDaySelection;
  readonly loading: boolean;
  readonly error?: string;
  readonly setErrorMessage: (error: string) => SetErrorMessage;
  readonly observedAt?: ObservedAt;
  readonly observedAtTime?: Date;
  readonly showFooter?: boolean;
  readonly hideFooter: () => HideFooter;
  readonly timezone?: string;
}

export default class IndexView extends React.Component<Props> {
  static defaultProps: Partial<Props> = {};

  componentDidMount(): void {
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

    // if lat, long and days are in correct format fetch data
    if (this.props.coordinates && this.props.coordinates.stationId) {
      this.props.fetchWeatherForecastData(
        this.props.coordinates,
        this.props.days,
        this.props.units,
        this.props.showFooter,
      );
    } else if (
      isLatValid &&
      isLgtValid &&
      (this.props.days < numberOfDaysAllowed || this.props.days === numberOfDaysAllowed)
    ) {
      this.props.fetchWeatherForecastData(
        this.props.coordinates,
        this.props.days,
        this.props.units,
        this.props.showFooter,
      );
    } else if (isLatValid && isLgtValid && this.props.days > numberOfDaysAllowed) {
      const errorMessage = ERRORS.numberOfDaysAllowedErrorMessage;
      this.props.setErrorMessage(errorMessage.key);
    } else {
      const errorMessage = ERRORS.invalidCoordinatesMessage;
      this.props.setErrorMessage(errorMessage.key);
    }

    this.props.setAllowDaySelection(this.props.allowDaySelection);
  }

  render(): JSX.Element {
    let { props } = this;

    return (
      <I18nConsumer>
        {({ t }) => (
          <Reset>
            <ThemeProvider theme={this.props.theme}>
              <DailyForecastList
                weatherForecastData={this.props.weatherForecastData}
                units={this.props.units}
                onDaySelect={this.setActiveDay}
                activeDay={this.props.activeDay}
                loading={this.props.loading}
                error={this.props.error}
                allowDaySelection={this.props.allowDaySelection}
                setError={this.setError}
                observedAt={this.props.observedAt}
                observedAtTime={this.props.observedAtTime}
                showFooter={this.props.showFooter}
                timezone={this.props.timezone}
              />
            </ThemeProvider>
          </Reset>
        )}
      </I18nConsumer>
    );
  }

  private readonly setActiveDay = (day: number) => {
    this.props.setActiveDay(day);
  };

  private readonly setError = (err: string) => {
    this.props.setErrorMessage(err);
  };
}
