import { Clock, Units } from "@dtn/i18n-lib";
import * as moment from "moment-timezone";
import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import { HourOutlook, PrecipRisk, Risk, RiskValue, WindRiskValue } from "../../../interfaces";
import { withTheme, ThemeProp } from "../../../styled-components";
import { getColorForRisk } from "../../../utils";
import Icon from "../icons";
import RiskLabel from "../risk-label";
import Accordion from "./accordion";
import CardToRow from "./card-to-row";
import DataPoint from "./data-point";
import {
  OutlookRisk,
  PrecipRisk as PrecipRiskComponent,
  WeatherCondition,
  Wind,
  WindDirection,
  WindSpeedRisk,
} from "./data-points";
import WeatherIcon from "./weather-icon";

export interface Props {
  readonly outlook: HourOutlook;
  readonly sunrise: moment.Moment;
  readonly sunset: moment.Moment;
  readonly defaultOpen: boolean;
  readonly theme: { readonly baseWeatherIconUrl: string };
  readonly units?: Units;
  readonly clock?: Clock;
}

export interface State {
  readonly isOpen: boolean;
}

export class Hour extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: props.defaultOpen,
    };
  }

  componentWillReceiveProps(props: Props) {
    this.setState({
      isOpen: props.defaultOpen,
    });
  }

  handleAccordionToggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render(): JSX.Element {
    let { outlook, sunrise, sunset, clock } = this.props;
    let { type } = outlook;
    let { isOpen } = this.state;
    let risk = type === "OBSERVED" ? { value: "N/A", display: "" } : outlook.risk;
    return (
      <I18nConsumer>
        {({ t }) => (
          <div data-testid="outlook-hour">
            <Accordion.Header risk={risk} onClick={this.handleAccordionToggle} isOpen={isOpen}>
              {outlook.type === "OBSERVED" && "Last Observation "}
              {outlook.dateTime.format(clock === Clock.TWENTY_FOUR_HOUR ? "HH:mm" : "h:mm A")}
              {getSunriseSunsetTime(outlook.dateTime, sunrise, sunset, clock, t)}
            </Accordion.Header>
            <Accordion.Body risk={risk} isOpen={isOpen}>
              <CardToRow>
                <div data-testid="outlook-spray-outlook">
                  <DataPoint title={<span>{t("station.title.sprayOutlook")}</span>}>
                    <OutlookRisk risk={outlook.risk}>
                      {getStatusIcon(outlook.risk)}
                      {formatOutlook(outlook.risk)}
                    </OutlookRisk>
                  </DataPoint>
                </div>
                <div data-testid="outlook-inversion-risk">
                  <DataPoint title={<span>{t("station.title.inversionRisk")}</span>}>
                    <RiskLabel risk={outlook.inversionRisk.risk}>
                      {formatInversionRisk(outlook.inversionRisk)}
                    </RiskLabel>
                  </DataPoint>
                </div>
                <div data-testid="outlook-precipitation-risk">
                  <DataPoint title={<span>{t("station.title.pecipitationRisk")}</span>}>
                    <PrecipRiskComponent risk={outlook.precipRisk.risk}>
                      {formatPrecipRisk(outlook.precipRisk)}
                    </PrecipRiskComponent>
                  </DataPoint>
                </div>
                <div data-testid="outlook-wind-risk">
                  <DataPoint title={t("station.title.windDirectionSpeed")}>
                    <Wind>
                      <WindDirection direction={outlook.windRisk.direction}>
                        {outlook.windRisk.direction}
                        {outlook.windRisk.direction !== "n/a" && (
                          <Icon icon="arrow" color={"#666"} size={32} />
                        )}
                      </WindDirection>
                      <WindSpeedRisk risk={outlook.windRisk.risk}>
                        {formatWindSpeed(outlook.windRisk)}
                      </WindSpeedRisk>
                    </Wind>
                  </DataPoint>
                </div>
                <div data-testid="outlook-weather-condition-risk">
                  <DataPoint title={t("station.title.tempDewPoint")}>
                    <WeatherCondition>
                      <WeatherIcon condition={outlook.weatherCondition} theme={this.props.theme} />
                      <div>
                        <RiskLabel risk={outlook.temperatureRisk.risk}>
                          {formatTempOrDew(outlook.temperatureRisk)}
                        </RiskLabel>
                        <br />
                        <RiskLabel risk={outlook.dewpointRisk.risk}>
                          {formatTempOrDew(outlook.dewpointRisk)}
                        </RiskLabel>
                      </div>
                    </WeatherCondition>
                  </DataPoint>
                </div>
              </CardToRow>
            </Accordion.Body>
          </div>
        )}
      </I18nConsumer>
    );
  }
}

export default withTheme(Hour);

function formatInversionRisk(inversion: RiskValue): string {
  if (inversion.risk.value === "high") {
    return "Inversion Likely";
  } else if (inversion.risk.value === "medium") {
    return "Inversion Possible";
  }
  return "--";
}

function formatTempOrDew(tempOrDew: RiskValue): string {
  if (tempOrDew.value === null) {
    return "--";
  }
  return `${tempOrDew.value}˚ ${tempOrDew.units}`;
}

function formatWindSpeed(wind: WindRiskValue): string {
  if (wind.display !== "") {
    return wind.display;
  }
  if (wind.gust !== null) {
    return `${wind.value} G ${wind.gust} ${wind.units}`;
  }
  return `${wind.value} ${wind.units}`;
}

function formatPrecipRisk(precip: PrecipRisk): string {
  return `${precip.display}`;
}

function formatOutlook(risk: Risk): string {
  let { value } = risk;
  if (value === "n/a") {
    return "n/a";
  } else if (value === "low") {
    return "clear";
  } else if (value === "medium") {
    return "caution";
  } else {
    return "warning";
  }
}

function getStatusIcon(risk: Risk): React.ReactNode {
  let { value } = risk;
  if (value === "n/a") {
    return <></>;
  } else if (value === "low") {
    return <Icon icon={"clear"} size={32} color={getColorForRisk(risk)} />;
  } else if (value === "medium") {
    return <Icon icon={"caution"} size={32} color={getColorForRisk(risk)} />;
  } else {
    return <Icon icon={"warning"} size={32} color={getColorForRisk(risk)} />;
  }
}

function getSunriseSunsetTime(
  date: moment.Moment,
  sunrise: moment.Moment,
  sunset: moment.Moment,
  clock = Clock.TWELVE_HOUR,
  t: typeof translationFunction,
): React.ReactNode | void {
  let formatString = clock === Clock.TWELVE_HOUR ? "HH:mm" : "h:mm A";
  if (compareHours(date, sunrise)) {
    return (
      <span>{t("station.sunrise", { sunriseTime: moment(sunrise).format(formatString) })}</span>
    );
  } else if (compareHours(date, sunset)) {
    return <span>{t("station.sunset", { sunsetTime: moment(sunset).format(formatString) })}</span>;
  }
}

function compareHours(a: moment.Moment, b: moment.Moment): boolean {
  return (
    a.year() === b.year() &&
    a.month() === b.month() &&
    a.date() === b.date() &&
    a.hour() === b.hour()
  );
}
