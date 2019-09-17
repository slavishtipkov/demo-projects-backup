import { Clock } from "@dtn/i18n-lib";
import * as React from "react";
import { StationOutlook } from "../../../interfaces";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import { LocationInfo } from "../location-info";
import { Bar, Day } from "../outlook-hourly-bar";

const Scroller = styled.ul`
  display: block;
  overflow-x: scroll;
  overflow-y: hidden;
`;

const Outlook = styled.li`
  position: relative;

  & + & {
    margin-top: 15px;
  }
`;

const OutlookLocation = styled.div`
  position: absolute;
  left: 0;
  height: 50px;
  transform: translateZ(0);
`;

const OutlookForecast = styled.div`
  height: 50px;
  padding-top: 57px;
  white-space: nowrap;
`;

export interface Props {
  readonly outlooks: ReadonlyArray<StationOutlook>;
  readonly omitNighttimeHours?: boolean;
  readonly clock?: Clock;
  readonly onOutlookSelect: (outlook: StationOutlook, date: Date) => void;
}

export default class extends React.Component<Props> {
  handleOutlookSelect = (outlook: StationOutlook) => {
    this.props.onOutlookSelect(outlook, new Date());
  };

  render(): JSX.Element {
    let { outlooks, omitNighttimeHours, clock } = this.props;

    outlooks = outlooks
      .map(o => ({
        ...o,
        days: o.days.map(d => ({
          ...d,
          hours: d.hours.filter(h => {
            if (h.type === "OBSERVED") return false;
            return true;
          }),
        })),
      }))
      // Filter out any outlooks that don't have hours available
      .filter(o => o.days[1].hours.length > 0);

    return (
      <Scroller data-testid="hourly-overview">
        {outlooks.map(outlook => (
          <Outlook key={outlook.location.locationName}>
            <OutlookLocation>
              <LocationInfo outlook={outlook} onSelect={this.handleOutlookSelect} clock={clock} />
            </OutlookLocation>
            <OutlookForecast>
              <Bar>
                {outlook.days.map((d, i) => (
                  <Day
                    key={i}
                    hours={d.hours}
                    omitNighttimeHours={omitNighttimeHours}
                    clock={clock}
                  />
                ))}
              </Bar>
            </OutlookForecast>
          </Outlook>
        ))}
      </Scroller>
    );
  }
}
