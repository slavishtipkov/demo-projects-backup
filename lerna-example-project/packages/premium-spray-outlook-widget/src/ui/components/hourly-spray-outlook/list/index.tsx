import { SprayOutlookDayOutlook, SprayOutlookHourOutlook } from "@dtn/api-lib";
import * as React from "react";
import styled from "../../../../styled-components";
import HourlySprayOutlookListItem from "../item";
import { Units } from "@dtn/i18n-lib";

const Wrapper = styled("div")`
  max-height: 300px;
  overflow-y: auto;
`;

export interface Props {
  readonly units: Units;
  readonly loading: boolean;
  readonly daytimeOnly?: boolean;
  readonly sprayOutlookDayForecast: SprayOutlookDayOutlook;
  readonly timezone: string;
  readonly activeDay: number;
  readonly generateWeatherIconWrapper: (dateTime: string, index: number) => string;
}

export interface State {
  readonly isExtended: number | null;
}

export default class HourlySprayOutlookList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isExtended: null };
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (
      JSON.stringify(nextProps.sprayOutlookDayForecast) !==
      JSON.stringify(this.props.sprayOutlookDayForecast)
    ) {
      this.setState({ isExtended: null });
    }
  }

  renderOutlookItems = () => {
    let hours: ReadonlyArray<SprayOutlookHourOutlook> = this.props.sprayOutlookDayForecast.hours;
    if (this.props.daytimeOnly) {
      hours = hours.filter(h => h.daylight);
    }
    return hours.map((dailyForecast: SprayOutlookHourOutlook, index: number) => {
      return (
        <HourlySprayOutlookListItem
          key={index}
          index={index}
          sprayOutlookHour={dailyForecast}
          units={this.props.units}
          toggleIsExpanded={this.toggleIsExpanded}
          isExpanded={this.state.isExtended === index}
          isLastItem={index === this.props.sprayOutlookDayForecast.hours.length - 1}
          timezone={this.props.timezone}
          generateWeatherIconWrapper={this.props.generateWeatherIconWrapper}
          activeDay={this.props.activeDay}
        />
      );
    });
  };

  render(): JSX.Element {
    return <Wrapper>{this.renderOutlookItems()}</Wrapper>;
  }

  private readonly toggleIsExpanded = (index: number) => {
    if (this.state.isExtended !== index) {
      this.setState({ isExtended: index });
    } else {
      this.setState({ isExtended: null });
    }
  };
}
