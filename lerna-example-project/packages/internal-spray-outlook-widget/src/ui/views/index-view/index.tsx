import { Clock, Units } from "@dtn/i18n-lib";
import * as moment from "moment-timezone";
import * as React from "react";
import {
  Consumer as I18nConsumer,
  Provider as I18nProvider,
  t as translationFunction,
} from "../../../i18n";
import {
  GetThresholdSettings,
  Location,
  StationOutlook,
  ThresholdSettings,
  View,
} from "../../../interfaces";
import {
  ChangeViewAction,
  FetchSprayOutlookAction,
  FetchThresholdDefaultsAction,
  FetchThresholdSettingsAction,
  SaveThresholdSettingsAction,
} from "../../../store";
import styled, { ThemeProvider, ThemeProp } from "../../../styled-components";
import { Views } from "../../../types";
import OverviewView from "../overview";
import StationView from "../station";
import ThresholdSettingsView from "../threshold-settings";

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
  readonly currentView: View;
  readonly locations: ReadonlyArray<Location>;
  readonly outlooks: ReadonlyArray<StationOutlook>;
  readonly units: Units;
  readonly settingsSaveInFlight: boolean;
  readonly changeView: (view: View) => ChangeViewAction;
  readonly fetchSprayOutlook: (locations: ReadonlyArray<Location>) => FetchSprayOutlookAction;
  readonly fetchThresholdDefaults: () => FetchThresholdDefaultsAction;
  readonly fetchThresholdSettings: () => FetchThresholdSettingsAction;
  readonly saveThresholdSettings: (settings: ThresholdSettings) => SaveThresholdSettingsAction;
  readonly settings?: GetThresholdSettings;
  readonly forecastTimestamp?: moment.Moment;
  readonly theme?: ThemeProp;
  readonly clock?: Clock;
  readonly previousView?: View;
}

export default class IndexView extends React.Component<Props> {
  static defaultProps: Partial<Props> = {
    clock: Clock.TWELVE_HOUR,
  };

  componentDidMount() {
    this.props.fetchThresholdSettings();

    if (
      this.props.currentView.view === Views.OVERVIEW ||
      this.props.currentView.view === Views.STATION
    ) {
      let { locations } = this.props;
      this.props.fetchSprayOutlook(locations);
    }
  }

  setStationView = (locationName: string, date?: Date) => {
    this.props.changeView({
      view: Views.STATION,
      locationName,
      date: moment(date),
    });
  };

  setOverviewView = () => {
    this.handleOverviewClick();
  };

  setSettingsView = () => {
    this.handleSettingsClick();
  };

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <Reset>
            <I18nProvider value={{ t }}>
              <ThemeProvider theme={this.props.theme}>{this.getView(t)}</ThemeProvider>
            </I18nProvider>
          </Reset>
        )}
      </I18nConsumer>
    );
  }

  private readonly handleOverviewClick = () => {
    this.props.changeView({ view: Views.OVERVIEW });
  };

  private readonly handleSettingsClick = () => {
    this.props.changeView({ view: Views.SETTINGS });
  };

  private readonly handleSettingsCancel = () => {
    let nextView = this.props.previousView;
    if (!nextView) {
      nextView = { view: Views.OVERVIEW };
    }
    this.props.changeView(nextView);

    if (this.props.outlooks.length === 0) {
      let { locations } = this.props;
      this.props.fetchSprayOutlook(locations);
    }
  };

  private readonly handleOutlookClick = (outlook: StationOutlook, date?: moment.Moment) => {
    this.props.changeView({
      view: Views.STATION,
      locationName: outlook.location.locationName,
      date,
    });
  };

  private readonly handlePreviousView = () => {
    if (this.props.previousView) {
      this.props.changeView(this.props.previousView);
    }
  };

  private getView(t: typeof translationFunction) {
    let { props, state } = this;
    let { outlooks, settings, forecastTimestamp, clock } = props;

    // Settings are required to display any view
    if (!settings) {
      return <div>{t("common.loading")}</div>;
    }

    let { currentView } = props;

    if (currentView.view === Views.SETTINGS) {
      return (
        <ThresholdSettingsView
          units={props.units}
          settings={props.settings}
          settingsSaveInFlight={props.settingsSaveInFlight}
          saveThresholdSettings={props.saveThresholdSettings}
          onCancel={this.handleSettingsCancel}
          onPreviousView={this.handlePreviousView}
        />
      );
    }

    if (outlooks.length === 0) {
      return <div>{t("common.loading")}</div>;
    }

    // Outlooks exist, find location that matches the outlook
    if (currentView.view === Views.STATION && currentView.locationName) {
      let selectedLocation = this.props.locations.find(
        location => location.locationName === currentView.locationName,
      )!;
      let { stationId } = selectedLocation;
      let match = outlooks.find(outlook => outlook.station.id === stationId);
      if (match) {
        return (
          <StationView
            outlook={match}
            selectedDate={currentView.date}
            omitNighttimeHours={settings.dayOnlyApplication}
            onSettingsClick={this.handleSettingsClick}
            units={props.units}
            clock={clock}
          />
        );
      }
    }

    // Couldnt match an outlook with the selected location, fallback to overview
    // let onOutlookSelect = (outlook: StationOutlook) => props.onViewChange(outlook.location);
    return (
      <OverviewView
        outlooks={outlooks}
        forecastTimestamp={forecastTimestamp as moment.Moment} // If outlooks exist, the timestamp will be populated as well
        onOutlookSelect={this.handleOutlookClick}
        omitNighttimeHours={settings.dayOnlyApplication}
        onSettingsClick={this.handleSettingsClick}
        clock={clock}
      />
    );
  }
}
