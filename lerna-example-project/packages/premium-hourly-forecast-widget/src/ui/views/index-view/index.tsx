import { Units } from "@dtn/i18n-lib";
import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import {
  HourlyForecast,
  Coordinates,
  ObservedAt,
  VisibleFields,
  DayForecast,
  Station,
} from "../../../interfaces";
import {
  PremiumHourlyForecastRequest,
  SetErrorMessage,
  FetchObservedAtData,
  FetchHourlyForecastData,
} from "../../../store";
import styled, { ThemeProvider, ThemeProp } from "../../../styled-components";
import HourlyForecastList from "../../components/hourly-forecast-list";
import { ERRORS } from "../../../constants";
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
  readonly user: string;
  readonly widgetName: string;
  readonly units?: string;
  readonly weatherForecastData: ReadonlyArray<HourlyForecast>;
  readonly dayForecastData?: ReadonlyArray<DayForecast>;
  readonly coordinates: Coordinates;
  readonly visibleFields: VisibleFields;
  readonly days: number;
  readonly loading: boolean;
  readonly error?: string;
  readonly observedAt?: ObservedAt;
  readonly observedAtTime?: Date;
  readonly coordinatesFromEpic?: boolean;
  readonly showHourlyForecast: boolean;
  readonly zipCode?: string;
  readonly selectedStation?: Station;
  readonly showStationSelect: boolean;
  readonly showZipCode: boolean;
  readonly hasSuccessPremiumRequest: boolean;
  readonly timezone?: string;

  readonly fetchPremiumHourlyForecastData: (
    user: string,
    widgetName: string,
    coordinates: Coordinates,
    days: number,
    units?: string,
  ) => PremiumHourlyForecastRequest;
  readonly fetchHourlyForecastData: (
    coordinates: Coordinates,
    days: number,
    units?: string,
  ) => FetchHourlyForecastData;
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
    if (this.props.selectedStation) {
      this.props.selectStation(this.props.selectedStation);
    } else if (this.props.coordinates && this.props.coordinates.lat && this.props.coordinates.lon) {
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

      if (isLatValid && isLgtValid) {
        if (!this.props.hasSuccessPremiumRequest) {
          this.props.fetchPremiumHourlyForecastData(
            this.props.user,
            this.props.widgetName,
            this.props.coordinates,
            this.props.days,
            this.props.units,
          );
        } else {
          this.props.fetchHourlyForecastData(
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

      // if lat, long and days are in correct format fetch data
      if (nextProps.coordinates.stationId) {
        if (!this.props.hasSuccessPremiumRequest) {
          this.props.fetchPremiumHourlyForecastData(
            nextProps.user,
            nextProps.widgetName,
            nextProps.coordinates,
            nextProps.days,
            nextProps.units,
          );
        } else {
          this.props.fetchHourlyForecastData(
            nextProps.coordinates,
            nextProps.days,
            nextProps.units,
          );
        }
      } else if (isLatValid && isLgtValid) {
        if (!this.props.hasSuccessPremiumRequest) {
          this.props.fetchPremiumHourlyForecastData(
            nextProps.user,
            nextProps.widgetName,
            nextProps.coordinates,
            nextProps.days,
            nextProps.units,
          );
        } else {
          this.props.fetchHourlyForecastData(
            nextProps.coordinates,
            nextProps.days,
            nextProps.units,
          );
        }
      } else {
        const errorMessage = ERRORS.invalidCoordinatesMessage;
        this.props.setErrorMessage(errorMessage.key);
      }
    }
  }

  render(): JSX.Element {
    return (
      <React.StrictMode>
        <I18nConsumer>
          {({ t }) => (
            <Reset>
              <ThemeProvider theme={this.props.theme}>
                <HourlyForecastList
                  weatherForecastData={this.props.weatherForecastData}
                  dayForecastData={this.props.dayForecastData}
                  visibleFields={this.props.visibleFields}
                  units={this.props.units}
                  loading={this.props.loading}
                  error={this.props.error}
                  setError={this.setError}
                  observedAt={this.props.observedAt}
                  observedAtTime={this.props.observedAtTime}
                  showHourlyForecast={this.props.showHourlyForecast}
                  showStationSelect={this.props.showStationSelect}
                  showZipCode={this.props.showZipCode}
                  timezone={this.props.timezone}
                />
              </ThemeProvider>
            </Reset>
          )}
        </I18nConsumer>
      </React.StrictMode>
    );
  }

  private readonly setError = (err: string) => {
    this.props.setErrorMessage(err);
  };
}
