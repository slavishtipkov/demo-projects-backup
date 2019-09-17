import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import styled, { css } from "../../../styled-components";
import DayPicker from "react-day-picker";
import { DatePickerWrapper } from "./date-picker-style";
import * as moment from "moment-timezone";
import { ChangeRange } from "../../../store";

export interface DropdownWrapperProps {
  readonly width: number;
}

export const DropdownWrapper = styled<DropdownWrapperProps, "div">("div")`
  font-family: Arial;
  font-size: 14px;
  position: absolute;
  width: calc((100% - 40px) / 3);

  ${({ width }) =>
    width &&
    `
      max-width: calc((${width}px - 54px) / 3);
    `};

  ${({ width }) =>
    width <= 600 &&
    `
      max-width: calc(${width}px - 14px);
    `};

  ${({ width }) =>
    width <= 600 &&
    css`
       {
        width: calc(100% - 32px);
      }
    `};
`;

export const DropdownHeader = styled.div`
  padding-left: 10px;
  display: block;
  color: #797979;
  cursor: pointer;
  font-family: Arial;
  font-size: 12px;
`;

export const DropdownToggle = styled.div`
  cursor: pointer;
  color: #303030;
  background-color: #ffffff;
  border: none;
  border-bottom: 1px solid #cccccc;
  padding: 5px 5px 5px 10px;
  line-height: 1.5;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  outline: 0;
  text-align: left;
  height: 35px;

  &:focus {
    outline: 0;
  }

  &::after {
    display: inline-block;
    width: 0;
    height: 0;
    color: #747474;
    float: right;
    margin-right: 5px;
    margin-top: 9px;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }
`;

export interface DropdownContainerPros {
  readonly expanded: boolean;
}

export const DropdownContainer = styled<DropdownContainerPros, "ul">("ul")`
  list-style-type: none;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  padding: 14px 0 0 0;
  margin: 0;
  box-shadow: 0 0 10px #f1f1f1;
  background-color: #ffffff;
  width: 100%;
  display: none;
  min-width: 280px;
  max-width: 100%;

  ${({ expanded }) =>
    expanded &&
    css`
      display: block;
    `};
`;

export interface DropdownItemPros {
  readonly active: boolean;
}

export const DropdownItem = styled<DropdownItemPros, "li">("li")`
  display: block;
  width: 100%;
  padding: 7px 10px;
  font-weight: bold;
  color: #303030;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  box-sizing: border-box;
  cursor: pointer;

  ${({ active }) =>
    active &&
    css`
      background-color: #f1f1f1;
    `};

  &:hover {
    background-color: rgba(0, 147, 208, 0.1);
  }
`;

export interface DropdownOption {
  readonly key: string;
  readonly value: string;
}

export interface Props {
  readonly dropdownName: string;
  readonly isDropdownExpanded: boolean;
  readonly options: ReadonlyArray<DropdownOption>;
  readonly selectedOption?: DropdownOption;
  readonly label: string;
  readonly toggleDropdown: (dropdownName: string) => void;
  readonly changeSelectedOption: (dropdownName: string, selectedOption: DropdownOption) => void;
  readonly selectedDays: {
    readonly start: string;
    readonly end: string;
  };
  readonly width: number;
  readonly changeRange: (range: { readonly start: string; readonly end: string }) => ChangeRange;
}

export interface State {
  readonly from: Date | null;
  readonly to: Date | null;
  readonly enteredTo: Date | null;
}

export default class DatePicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      from: new Date(this.props.selectedDays.start),
      to: new Date(this.props.selectedDays.end),
      enteredTo: new Date(this.props.selectedDays.end),
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    const { from, to, enteredTo } = this.state;
    if (from && enteredTo && !nextProps.isDropdownExpanded) {
      const end = to ? to.toISOString() : enteredTo.toISOString();
      if (
        this.props.selectedDays.start !== from.toISOString() ||
        this.props.selectedDays.end !== end
      ) {
        if (from.toISOString() !== end) {
          this.setState(this.setLastDayState(enteredTo), () => {
            if (this.state.from && this.state.to) {
              this.props.changeRange({
                start: this.state.from.toISOString(),
                end: this.state.to.toISOString(),
              });
            }
          });
        } else {
          this.handleResetClick();
          this.setDefaultRange();
        }
      }
    }
  }

  resetState = () => {
    return {
      from: null,
      to: null,
      enteredTo: null,
    };
  };

  setFirstDayState = (day: Date) => {
    return {
      from: day,
      to: null,
      enteredTo: null,
    };
  };

  setLastDayState = (day: Date) => {
    return {
      to: day,
      enteredTo: day,
    };
  };

  isSelectingFirstDay = (from: Date | null, to: Date | null, day: Date) => {
    const isBeforeFirstDay = from && DayPicker.DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  };

  handleDayClick = (day: Date) => {
    const { from, to } = this.state;
    const dateBefore = new Date();
    const dateNow = new Date();
    dateBefore.setMonth(dateBefore.getMonth() - 12);
    dateBefore.setDate(dateBefore.getDate() + 1);
    if (day >= dateBefore && day <= dateNow) {
      if (from && to && day >= from && day <= to) {
        this.handleResetClick();
        this.setDefaultRange();
        return;
      }
      if (this.isSelectingFirstDay(from, to, day)) {
        this.setState(this.setFirstDayState(day));
      } else {
        if (from && from.toISOString() !== day.toISOString()) {
          this.setState(this.setLastDayState(day), () => {
            if (this.state.from && this.state.to) {
              this.props.changeRange({
                start: this.state.from.toISOString(),
                end: this.state.to.toISOString(),
              });
              this.changeSelectedValue();
            }
          });
        }
      }
    }
  };

  setDefaultRange = () => {
    const previousDate = new Date();
    const dateNow = new Date();
    previousDate.setMonth(previousDate.getMonth() - 12);
    previousDate.setDate(previousDate.getDate() + 1);
    const parsedRange = {
      start: previousDate.toISOString(),
      end: dateNow.toISOString(),
    };
    this.props.changeRange(parsedRange);
  };

  handleDayMouseEnter = (day: Date) => {
    const { from, to } = this.state;
    const dateBefore = new Date();
    const dateNow = new Date();
    dateBefore.setMonth(dateBefore.getMonth() - 12);
    dateBefore.setDate(dateBefore.getDate() + 1);
    if (!this.isSelectingFirstDay(from, to, day)) {
      if (day >= dateBefore && day <= dateNow) {
        this.setState({
          enteredTo: day,
        });
      }
    }
  };

  handleResetClick = () => {
    this.setState(this.resetState());
  };

  render(): JSX.Element {
    const { from, to, enteredTo } = this.state;
    let selectedOption = "Select range";
    if (from && enteredTo) {
      selectedOption = `${moment(from).format("M/D/YYYY")} - ${moment(enteredTo).format(
        "M/D/YYYY",
      )}`;
    }

    const modifiers = { start: from, end: enteredTo };
    const dateBefore = new Date();
    dateBefore.setMonth(dateBefore.getMonth() - 12);
    dateBefore.setDate(dateBefore.getDate() + 1);
    const disabledDays = { before: dateBefore, after: new Date() };
    // tslint:disable-next-line:readonly-array
    const selectedDays = [from as Date, { from: from as Date, to: enteredTo as Date }];
    const WEEKDAYS_SHORT: ReadonlyArray<string> = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <I18nConsumer>
        {({ t }) => (
          <div>
            <DropdownWrapper width={this.props.width}>
              {/* tslint:disable-next-line:jsx-no-lambda */}
              <DropdownHeader onClick={() => this.props.toggleDropdown(this.props.dropdownName)}>
                {t(this.props.label)}
              </DropdownHeader>
              <DropdownToggle
                className="dropdown-btn"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => this.props.toggleDropdown(this.props.dropdownName)}
              >
                {selectedOption}
              </DropdownToggle>

              <DropdownContainer expanded={this.props.isDropdownExpanded}>
                <DatePickerWrapper>
                  <DayPicker
                    className="Range"
                    todayButton="Today"
                    fixedWeeks
                    disabledDays={disabledDays}
                    selectedDays={selectedDays}
                    modifiers={modifiers}
                    onDayClick={this.handleDayClick}
                    onDayMouseEnter={this.handleDayMouseEnter}
                    weekdaysShort={WEEKDAYS_SHORT as any}
                  />
                </DatePickerWrapper>
              </DropdownContainer>
            </DropdownWrapper>
          </div>
        )}
      </I18nConsumer>
    );
  }

  private changeSelectedValue(): void {
    this.props.toggleDropdown(this.props.dropdownName);
  }
}
