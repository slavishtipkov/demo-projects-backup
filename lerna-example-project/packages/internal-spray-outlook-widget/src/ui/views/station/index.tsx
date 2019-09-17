import { Clock, Units } from "@dtn/i18n-lib";
import * as moment from "moment-timezone";
import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import { DayOutlook, StationOutlook } from "../../../interfaces";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import { ForecastStation, NextSprayRecommendation } from "../../components/location-info";
import OutlookBar from "../../components/outlook-bar";
import OutlookList from "../../components/outlook-list";
import SettingsToggleButton from "../../components/settings-toggle-button";

const Header = styled.header`
  margin-bottom: 20px;

  > * + * {
    margin-top: 10px;
  }
`;

export const Message = styled.p`
  display: block;
  max-width: 90%;
  margin: 30px auto 0;
  font-family: LatoBold, sans-serif;
  font-size: 14px;
  text-align: center;
`;

export const BackLink = styled.div`
  margin-bottom: 10px;
  text-align: right;

  @media (min-width: 768px) {
    float: right;
    margin-bottom: 0;
  }
`;

export interface Props {
  readonly outlook: StationOutlook;
  readonly selectedDate?: moment.Moment;
  readonly omitNighttimeHours?: boolean;
  readonly clock?: Clock;
  readonly units?: Units;
  readonly onSettingsClick: () => void;
}

export interface State {
  readonly selectedDate: moment.Moment;
  readonly isDesktop: boolean;
  readonly isMobile: boolean;
}

export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let isDesktop = window.matchMedia("(min-width: 768px)").matches;
    this.state = {
      isDesktop,
      isMobile: !isDesktop,
      selectedDate: props.selectedDate || moment().tz(moment.tz.guess()),
    };
  }

  handleDaySelect = (outlook: StationOutlook, nextDate: moment.Moment) => {
    this.setState({
      selectedDate: nextDate,
    });
  };

  handleSettingsClick = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.onSettingsClick();
  };

  render(): JSX.Element {
    let { selectedDate } = this.state;
    let { outlook, omitNighttimeHours, clock, units } = this.props;
    let dayOutlook = outlook.days.find(f => isSameDay(f.date, selectedDate));
    // Default to first day if no match found
    if (dayOutlook === undefined) dayOutlook = outlook.days[0];

    let showNoDataMessage = false;
    if (dayOutlook.hours.length === 0) {
      showNoDataMessage = true;
    }

    let showNoHoursInDayMessage = false;
    if (omitNighttimeHours) {
      let hours = dayOutlook.hours.filter(h => h.daylight);

      if (hours.length === 0) {
        showNoHoursInDayMessage = true;
      } else if (hours.length === 1 && hours[0].type === "OBSERVED") {
        showNoHoursInDayMessage = true;
      }
    }

    let link = (t: any) => (
      <a href="#" onClick={this.handleSettingsClick}>
        {t("common.settingsLink")}
      </a>
    );

    return (
      <I18nConsumer>
        {({ t }) => (
          <div data-testid="station-view">
            <BackLink>
              <SettingsToggleButton icon="gear" onClick={this.props.onSettingsClick} />
            </BackLink>
            <Header>
              <ForecastStation station={outlook.station} location={outlook.location} bold long />
              <NextSprayRecommendation when={outlook.nextSprayRecDate} bold clock={clock} />
            </Header>

            <OutlookBar
              outlook={outlook}
              onDaySelect={this.handleDaySelect}
              showColors={false}
              selectedDay={selectedDate}
            />
            <OutlookBar
              outlook={outlook}
              onDaySelect={this.handleDaySelect}
              showDates={false}
              selectedDay={selectedDate}
            />

            <br />
            <br />
            {showNoDataMessage ? (
              <Message>{t("station.noDataAvailable")}</Message>
            ) : showNoHoursInDayMessage ? (
              <Message>{t("station.noRemainingDayHours", { settingsLink: link(t) })}</Message>
            ) : (
              <OutlookList
                day={dayOutlook as DayOutlook}
                openFirst={this.state.isMobile}
                openAll={this.state.isDesktop}
                omitNighttimeHours={omitNighttimeHours}
                units={units}
                clock={clock}
              />
            )}
          </div>
        )}
      </I18nConsumer>
    );
  }
}

function isSameDay(a: moment.Moment, b: moment.Moment): boolean {
  return a.year() === b.year() && a.dayOfYear() === b.dayOfYear();
}
