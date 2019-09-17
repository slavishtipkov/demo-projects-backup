import { Units } from "@dtn/i18n-lib";
import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import {
  DailyForecast,
  Coordinates,
  ObservedAt,
  Station,
  HourlyObservationData,
} from "../../../interfaces";
import {
  PremiumWeatherForecastRequest,
  FetchPremiumWeatherForecastData,
  SetErrorMessage,
} from "../../../store";
import styled, { ThemeProvider, ThemeProp } from "../../../styled-components";
import DailyForecastList from "../../components/daily-forecast-list";
import { ERRORS, minDaysAllowed, maxDaysAllowed } from "../../../constants";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as PremiumLocationSelectWidget from "@dtn/premium-location-select-widget";

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
  readonly hourlyObservation: ReadonlyArray<HourlyObservationData>;
  readonly coordinates: Coordinates;
  readonly days?: number;
  readonly loading: boolean;
  readonly error?: string;
  readonly observedAt?: ObservedAt;
  readonly observedAtTime?: Date;
  readonly user: string;
  readonly widgetName: string;
  readonly coordinatesFromEpic?: boolean;
  readonly showDailyForecast: boolean;
  readonly zipCode?: string;
  readonly selectedStation?: Station;
  readonly showStationSelect: boolean;
  readonly showZipCode: boolean;
  readonly hasSuccessPremiumRequest: boolean;
  readonly timezone?: string;
  readonly fetchPremiumWeatherForecastData: (
    user: string,
    widgetName: string,
    coordinates: Coordinates,
    days?: number,
    units?: string,
  ) => PremiumWeatherForecastRequest;
  readonly fetchWeatherForecastData: (
    coordinates: Coordinates,
    days?: number,
    units?: string,
  ) => FetchPremiumWeatherForecastData;
  readonly setErrorMessage: (error: string) => SetErrorMessage;
  readonly getZipCodeByCoordinates: (coordinates: Coordinates) => ZipCodeWidget.GetZipCode;
  readonly setZipCode: (zipCode: string) => ZipCodeWidget.FetchZipCodeDataAction;
  readonly selectStation: (
    station: Station,
  ) => PremiumLocationSelectWidget.SelectSelectedStationAction;
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
    const areDaysValid = this.props.days
      ? this.props.days >= minDaysAllowed && this.props.days <= maxDaysAllowed
        ? true
        : false
      : true;

    if (this.props.selectedStation && areDaysValid) {
      this.props.selectStation(this.props.selectedStation);
    } else if (
      this.props.coordinates &&
      this.props.coordinates.lat &&
      this.props.coordinates.lon &&
      areDaysValid
    ) {
      if (isLatValid && isLgtValid) {
        if (!this.props.hasSuccessPremiumRequest) {
          this.props.fetchPremiumWeatherForecastData(
            this.props.user,
            this.props.widgetName,
            this.props.coordinates,
            this.props.days,
            this.props.units,
          );
        } else {
          this.props.fetchWeatherForecastData(
            this.props.coordinates,
            this.props.days,
            this.props.units,
          );
        }

        if (this.props.showZipCode) {
          this.props.getZipCodeByCoordinates({
            lat: this.props.coordinates.lat,
            lon: this.props.coordinates.lon,
          });
        }
      } else {
        const errorMessage = ERRORS.invalidCoordinatesMessage;
        this.props.setErrorMessage(errorMessage.key);
      }
    } else if (this.props.zipCode) {
      this.props.setZipCode(this.props.zipCode);
    } else if (
      this.props.selectedStation &&
      this.props.selectedStation.stationId &&
      !areDaysValid
    ) {
      const errorMessage = ERRORS.numberOfDaysAllowedErrorMessage;
      this.props.setErrorMessage(errorMessage.key);
    } else if (isLatValid && isLgtValid && this.props.days && !areDaysValid) {
      const errorMessage = ERRORS.numberOfDaysAllowedErrorMessage;
      this.props.setErrorMessage(errorMessage.key);
    } else if (!this.props.showZipCode && !this.props.showStationSelect) {
      const errorMessage = ERRORS.wrongConfigMessage;
      this.props.setErrorMessage(errorMessage.key);
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (
      nextProps.coordinatesFromEpic &&
      JSON.stringify(this.props.coordinates) !== JSON.stringify(nextProps.coordinates)
    ) {
      const isLatValid =
        nextProps.coordinates && nextProps.coordinates.lat
          ? nextProps.coordinates.lat > -90 && nextProps.coordinates.lat < 90
            ? true
            : false
          : false;
      const isLgtValid =
        nextProps.coordinates && nextProps.coordinates.lon
          ? nextProps.coordinates.lon > -180 && nextProps.coordinates.lon < 180
            ? true
            : false
          : false;
      const areDaysValid = nextProps.days
        ? nextProps.days >= minDaysAllowed && nextProps.days <= maxDaysAllowed
          ? true
          : false
        : true;

      if (nextProps.coordinates.stationId && areDaysValid) {
        if (!this.props.hasSuccessPremiumRequest) {
          this.props.fetchPremiumWeatherForecastData(
            nextProps.user,
            nextProps.widgetName,
            nextProps.coordinates,
            nextProps.days,
            nextProps.units,
          );
        } else {
          this.props.fetchWeatherForecastData(
            nextProps.coordinates,
            nextProps.days,
            nextProps.units,
          );
        }
      } else if (isLatValid && isLgtValid && areDaysValid) {
        if (!this.props.hasSuccessPremiumRequest) {
          this.props.fetchPremiumWeatherForecastData(
            nextProps.user,
            nextProps.widgetName,
            nextProps.coordinates,
            nextProps.days,
            nextProps.units,
          );
        } else {
          this.props.fetchWeatherForecastData(
            nextProps.coordinates,
            nextProps.days,
            nextProps.units,
          );
        }
      } else if (nextProps.coordinates.stationId && !areDaysValid) {
        const errorMessage = ERRORS.numberOfDaysAllowedErrorMessage;
        this.props.setErrorMessage(errorMessage.key);
      } else if (isLatValid && isLgtValid && !areDaysValid) {
        const errorMessage = ERRORS.numberOfDaysAllowedErrorMessage;
        this.props.setErrorMessage(errorMessage.key);
      } else {
        const errorMessage = ERRORS.invalidCoordinatesMessage;
        this.props.setErrorMessage(errorMessage.key);
      }
    }
  }

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <Reset>
            <ThemeProvider theme={this.props.theme}>
              <DailyForecastList
                weatherForecastData={this.props.weatherForecastData}
                hourlyObservation={this.props.hourlyObservation}
                units={this.props.units}
                loading={this.props.loading}
                error={this.props.error}
                setError={this.setError}
                observedAt={this.props.observedAt}
                observedAtTime={this.props.observedAtTime}
                showDailyForecast={this.props.showDailyForecast}
                showStationSelect={this.props.showStationSelect}
                showZipCode={this.props.showZipCode}
                timezone={this.props.timezone}
              />
            </ThemeProvider>
          </Reset>
        )}
      </I18nConsumer>
    );
  }

  private readonly setError = (err: string) => {
    this.props.setErrorMessage(err);
  };
}
