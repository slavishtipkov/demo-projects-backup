import { Moment } from "moment-timezone";
import * as React from "react";
import { DayOutlook, StationOutlook } from "../../../interfaces";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import { getColorForRisk } from "../../../utils";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
`;

interface CellDateProps {
  readonly date: Moment;
}
const CellDate: React.SFC<CellDateProps> = ({ date }) => (
  <div>
    {date.format("M/D")}
    <br />
    {date.format("ddd")}
  </div>
);

interface CellProps {
  readonly day: DayOutlook;
  readonly background: boolean | void;
  readonly showDate: boolean | void;
  readonly selected: boolean;
  readonly className?: string;
  readonly onClick?: (date: Moment) => void;
}
const cell: React.SFC<CellProps> = props => {
  let { className, day, showDate, onClick } = props;
  let handleClick = () => {
    if (onClick) onClick(day.date);
  };
  return (
    <div className={className} onClick={handleClick} data-testid="spray-outlook-day">
      {showDate ? <CellDate date={day.date} /> : null}
    </div>
  );
};
const Cell = styled(cell)`
  position: relative;
  box-sizing: border-box;
  flex-basis: 100%;
  height: 47px;
  margin-left: 5px;
  background-color: ${({ day, background }) =>
    background ? getColorForRisk(day.risk) : "transparent"};
  border: ${({ selected, day }) => (selected ? `3px solid ${getColorForRisk(day.risk)}` : "none")};
  font-family: ${({ selected }) => (selected ? "'LatoBold', sans-serif" : "inherit")};
  color: ${({ background }) => (background ? "#FFFFFF" : "#333333")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  :first-child {
    margin-left: 0;
  }
`;

export interface Props {
  readonly outlook: StationOutlook;
  readonly onDaySelect?: (outlook: StationOutlook, date: Moment) => void;
  readonly showColors?: boolean;
  readonly showDates?: boolean;
  readonly selectedDay?: Moment;
}

export default class extends React.Component<Props> {
  static defaultProps: Partial<Props> = {
    showColors: true,
    showDates: true,
    onDaySelect: undefined,
  };

  handleDaySelect = (day: Moment) => {
    if (typeof this.props.onDaySelect === "function") {
      this.props.onDaySelect(this.props.outlook, day);
    }
  };

  render(): JSX.Element {
    let { outlook, showColors, showDates, selectedDay } = this.props;
    let { days } = outlook;
    return (
      <Row>
        {days.map((day, i) => {
          let handleClick = () => this.handleDaySelect(day.date);
          return (
            <Cell
              key={i}
              day={day}
              background={showColors}
              showDate={showDates}
              selected={selectedDay === undefined ? false : compareDates(selectedDay, day.date)}
              onClick={handleClick}
            />
          );
        })}
      </Row>
    );
  }
}

function compareDates(a: Moment, b: Moment) {
  return a.year() === b.year() && a.month() === b.month() && a.date() === b.date();
}
