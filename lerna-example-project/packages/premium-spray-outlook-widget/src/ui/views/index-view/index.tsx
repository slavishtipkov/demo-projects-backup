import { SprayOutlookForecast, SprayOutlookThresholds } from "@dtn/api-lib";
import { Units } from "@dtn/i18n-lib";
import { Coordinates } from "@dtn/types-lib";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as moment from "moment-timezone";
import * as React from "react";
import { DEFAULT_THRESHOLDS } from "../../../constants";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled, { ThemeProp, ThemeProvider } from "../../../styled-components";
import HourlySprayOutlookIndex from "../../components/hourly-spray-outlook";
import LoadingIndicator from "../../components/loader";
import SettingsContainer from "../../components/settings";
import SprayOutlookList from "../../components/spray-outlook-list";
import FooterContainer from "../../components/footer";

let Reset = styled.div`
  h1 {
    margin: 0;
  }

  ol,
  ul {
    margin: 0;
    padding: 0;
  }
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
`;

const WidgetContainer = styled("div")`
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  background-color: #ffffff;
  text-align: left;
  padding: 10px 0;
`;

const ContentWrapper = styled("div")`
  border: 1px solid #eaeaea;
`;

export interface WidgetItemWrapperProps {
  readonly showZipCode: boolean;
}

export interface Props {
  readonly theme?: ThemeProp;
  readonly units: Units;
  readonly loading: boolean;
  readonly coordinates?: Coordinates;
  readonly sprayOutlook?: SprayOutlookForecast;
  readonly thresholds: SprayOutlookThresholds;
  readonly fetchSprayOutlookForecast: (
    coordinates: Coordinates,
    thresholds: SprayOutlookThresholds,
  ) => void;
  readonly showHourly?: "EXPANDED" | boolean;
  readonly observedAt?: { readonly city: string; readonly time: Date };
}

export interface State {
  readonly selectedDay: number;
  readonly isTooltipOpen: boolean;
  readonly isSettingsOpen: boolean;
}

export default class IndexView extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  constructor(props: Props, state: State) {
    super(props, state);
    this.state = { isTooltipOpen: false, isSettingsOpen: false, selectedDay: 0 };
  }

  readonly resetView = () => {
    this.setState({
      isSettingsOpen: false,
      isTooltipOpen: false,
      selectedDay: 0,
    });
  };

  render(): JSX.Element {
    const defaultSettings = DEFAULT_THRESHOLDS[this.props.units];

    return (
      <I18nConsumer>
        {({ t }) => (
          <Reset>
            <ThemeProvider theme={this.props.theme}>
              <WidgetContainer>
                {!this.state.isSettingsOpen && (
                  <div>
                    <ContentWrapper>
                      {this.props.loading && <LoadingIndicator />}

                      {!this.props.loading && this.props.sprayOutlook && (
                        <SprayOutlookList
                          units={this.props.units}
                          onDaySelect={this.handleDaySelect}
                          activeDay={this.state.selectedDay}
                          sprayOutlookForecast={this.props.sprayOutlook}
                          isTooltipOpen={this.state.isTooltipOpen}
                          changeTooltipState={this.setTooltipState}
                          changeSettingsState={this.setSettingsState}
                        />
                      )}

                      {!this.props.loading && this.props.sprayOutlook && this.props.showHourly && (
                        <HourlySprayOutlookIndex
                          loading={this.props.loading}
                          activeDay={this.state.selectedDay}
                          sprayOutlookForecast={this.props.sprayOutlook}
                          units={this.props.units}
                          expandHourly={this.props.showHourly === "EXPANDED"}
                          generateWeatherIconWrapper={this.generateWeatherIconWrapper}
                          daytimeOnly={this.props.thresholds.daytimeOnlyApplication}
                        />
                      )}
                    </ContentWrapper>

                    {!this.props.loading && this.props.sprayOutlook && this.props.observedAt && (
                      <FooterContainer
                        observedAt={this.props.observedAt}
                        timezone={this.props.sprayOutlook.station.timezoneId}
                      />
                    )}
                  </div>
                )}

                {this.state.isSettingsOpen && (
                  <div>
                    <SettingsContainer
                      changeSettingsState={this.setSettingsState}
                      thresholds={this.props.thresholds}
                      defaultSettings={defaultSettings}
                      units={this.props.units}
                      setThresholds={this.handleSetThresholds}
                    />
                  </div>
                )}
              </WidgetContainer>
            </ThemeProvider>
          </Reset>
        )}
      </I18nConsumer>
    );
  }

  private readonly handleSetThresholds = (thresholds: SprayOutlookThresholds) => {
    this.props.fetchSprayOutlookForecast(this.props.coordinates!, thresholds);
  };

  private readonly handleDaySelect = (d: number) => {
    this.setState({
      selectedDay: d,
    });
  };

  private readonly setTooltipState = () => {
    this.setState({ isTooltipOpen: !this.state.isTooltipOpen });
  };

  private readonly setSettingsState = () => {
    this.setState({
      isSettingsOpen: !this.state.isSettingsOpen,
      isTooltipOpen: false,
    });
  };

  private readonly generateWeatherIconWrapper = (dateTime: string, index: number) => {
    let sunrise = null;
    let sunset = null;
    let localTime = null;

    let timezone = this.props.sprayOutlook && this.props.sprayOutlook.station.timezoneId;

    if (timezone) {
      sunrise = moment(
        this.props.sprayOutlook ? this.props.sprayOutlook.days[index].sunrise : new Date(),
      )
        .tz(timezone)
        .valueOf();
      sunset = moment(
        this.props.sprayOutlook ? this.props.sprayOutlook.days[index].sunset : new Date(),
      )
        .tz(timezone)
        .valueOf();
      localTime = moment(dateTime)
        .tz(timezone)
        .valueOf();
    } else {
      sunrise = moment(
        this.props.sprayOutlook ? this.props.sprayOutlook.days[index].sunrise : new Date(),
      ).valueOf();
      sunset = moment(
        this.props.sprayOutlook ? this.props.sprayOutlook.days[index].sunset : new Date(),
      ).valueOf();
      localTime = moment(dateTime).valueOf();
    }

    if (localTime > sunrise && localTime < sunset) {
      return "dayIcons";
    }

    return "nightIcons";
  };
}
