import { Clock, Units } from "@dtn/i18n-lib";
import * as moment from "moment-timezone";
import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import { DayOutlook } from "../../../interfaces";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import { Title } from "./data-point";
import Hour from "./hour";

const List = styled.ol`
  padding: 0;
  list-style: none;

  > li + li {
    margin-top: 1px;
  }
`;

const HeaderRow = styled.div`
  display: none;
  overflow: hidden;

  @media (min-width: 768px) {
    display: block;
    padding: 0 5px;

    > *:nth-child(n) {
      float: left;
      width: 20%;
    }

    > *:last-child {
      position: absolute;
      right: 5px;
      width: auto;
      text-align: right;
      color: #999999;
    }
  }
`;

export interface Props {
  readonly day: DayOutlook;
  readonly openFirst: boolean;
  readonly openAll: boolean;
  readonly clock?: Clock;
  readonly units?: Units;
  readonly omitNighttimeHours?: boolean;
}
export interface State {
  readonly expanded?: boolean;
}
export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      expanded: props.openAll,
    };
  }

  handleExpandCollapseAll = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };

  render(): JSX.Element {
    let { day, openFirst, openAll, omitNighttimeHours, clock, units } = this.props;

    openAll = this.state.expanded ? true : false;

    return (
      <I18nConsumer>
        {({ t }) => (
          <div>
            <HeaderRow>
              <div>
                <Title>{t("station.title.sprayOutlook")}</Title>
              </div>
              <div>
                <Title>{t("station.title.inversionRisk")}</Title>
              </div>
              <div>
                <Title>{t("station.title.precipitationRisk")}</Title>
              </div>
              <div>
                <Title>{t("station.title.windDirectionSpeed")}</Title>
              </div>
              <div>
                <Title>{t("station.title.tempDewPoint")}</Title>
              </div>
              <i
                onClick={this.handleExpandCollapseAll}
                className="icon icon_circle-full-arrow-right"
                style={{
                  transform: openAll ? "rotate(90deg)" : "none",
                  cursor: "pointer",
                }}
              />
            </HeaderRow>
            <List>
              {day.hours
                .filter(hour => {
                  if (omitNighttimeHours && !hour.daylight) {
                    return false;
                  }
                  return true;
                })
                .map((hour, i) => (
                  <li key={i}>
                    <Hour
                      outlook={hour}
                      sunrise={day.sunrise}
                      sunset={day.sunset}
                      clock={clock}
                      units={units}
                      defaultOpen={openAll || (isToday(day.date) && i === 1 && openFirst)}
                    />
                  </li>
                ))}
            </List>
          </div>
        )}
      </I18nConsumer>
    );
  }
}

function isToday(date: moment.Moment): boolean {
  let today = moment();
  return (
    date.year() === today.year() && date.month() === today.month() && date.date() === today.date()
  );
}
