import { Clock } from "@dtn/i18n-lib";
import * as React from "react";
import { HourOutlook } from "../../../interfaces";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import { getColorForRisk } from "../../../utils";

export const Bar = styled.div`
  display: flex;
  flex-wrap: nowrap;

  > * {
    flex: 0 0 auto;
  }
`;

interface HourProps {
  readonly hour: HourOutlook;
  readonly clock?: Clock;
  readonly blank?: boolean;
  readonly className?: string;
}
const hour: React.SFC<HourProps> = ({ hour, clock, blank, className }) => (
  <div className={className} data-testid="spray-outlook-hour">
    {clock === Clock.TWENTY_FOUR_HOUR ? hour.dateTime.format("HH:mm") : hour.dateTime.format("hA")}
    <div>{hour.dateTime.format("M/D")}</div>
  </div>
);
const Hour = styled<HourProps>(hour)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 44px;
  height: 44px;
  background-color: ${({ hour, blank }) => (blank ? "#ccc" : getColorForRisk(hour.risk))};
  color: #ffffff;
`;

export interface DayProps {
  readonly hours: ReadonlyArray<HourOutlook>;
  readonly clock?: Clock;
  readonly omitNighttimeHours?: boolean;
  readonly className?: string;
}
const day: React.SFC<DayProps> = ({ hours, omitNighttimeHours, clock, className }) => {
  return (
    <div className={className}>
      {hours.map((hour, i) => (
        <div key={i}>
          <Hour hour={hour} blank={omitNighttimeHours && !hour.daylight} clock={clock} />
        </div>
      ))}
    </div>
  );
};
export const Day = styled<DayProps>(day)`
  display: flex;
  flex-wrap: nowrap;

  > * {
    flex: 0 0 auto;
  }

  > * + * {
    margin-left: 5px;
  }

  & + & {
    margin-left: 5px;
  }
`;
