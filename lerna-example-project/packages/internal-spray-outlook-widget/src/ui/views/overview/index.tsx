import { Clock } from "@dtn/i18n-lib";
import * as moment from "moment-timezone";
import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import { StationOutlook } from "../../../interfaces";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import DailyOverview from "../../components/daily-overview";
import HourlyOverview from "../../components/hourly-overview";
import OutlookTimestamp from "../../components/outlook-timestamp";
import OverviewHeader from "../../components/overview-header";

export interface Props {
  readonly outlooks: ReadonlyArray<StationOutlook>;
  readonly forecastTimestamp: moment.Moment;
  readonly omitNighttimeHours?: boolean;
  readonly clock?: Clock;
  readonly onSettingsClick: () => void;
  readonly onOutlookSelect: (outlook: StationOutlook, date: moment.Moment) => void;
}

export interface State {
  readonly isMobile: boolean;
  readonly isDailyView: boolean;
}

export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let isDesktop = window.matchMedia("(min-width: 768px)").matches;
    this.state = {
      isMobile: !isDesktop,
      isDailyView: true,
    };
  }

  handleDaySelect = (outlook: StationOutlook, day: moment.Moment) => {
    this.props.onOutlookSelect(outlook, day);
  };

  handleOutlookSelect = (outlook: StationOutlook) => {
    this.props.onOutlookSelect(outlook, moment());
  };

  handleDailyHourlyToggle = () => {
    this.setState(state => ({ ...state, isDailyView: !state.isDailyView }));
  };

  render(): JSX.Element {
    let { outlooks, omitNighttimeHours, forecastTimestamp, clock } = this.props;
    let { isDailyView, isMobile } = this.state;

    let Footer = styled.div`
      margin-top: 30px;
      text-align: right;
    `;

    return (
      <div data-testid="overview-view">
        <OverviewHeader
          isHourlyView={!isDailyView}
          onToggle={this.handleDailyHourlyToggle}
          onSettingsClick={this.props.onSettingsClick}
        />
        {isDailyView ? (
          <DailyOverview
            outlooks={outlooks}
            onOutlookSelect={this.handleDaySelect}
            clock={clock}
            isMobile
          />
        ) : (
          <HourlyOverview
            outlooks={outlooks}
            omitNighttimeHours={omitNighttimeHours}
            clock={clock}
            onOutlookSelect={this.handleOutlookSelect}
          />
        )}
        <Footer>
          <I18nConsumer>
            {({ t }) => <OutlookTimestamp when={forecastTimestamp} clock={clock} t={t} />}
          </I18nConsumer>
        </Footer>
      </div>
    );
  }
}
