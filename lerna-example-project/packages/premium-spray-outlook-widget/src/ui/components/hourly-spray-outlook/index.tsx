import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled from "../../../styled-components";
import ArrowContainer from "../icons/arrow-container";
import HourlySprayOutlookList from "./list";
import { SprayOutlookForecast } from "@dtn/api-lib";
import { Units } from "@dtn/i18n-lib";

export interface HourlySprayOutlookHeaderProps {
  readonly isExpanded: boolean;
}

const HourlySprayOutlookHeader = styled<HourlySprayOutlookHeaderProps, "div">("div")`
  cursor: pointer;
  position: relative;
  padding: 10px;
  font-weight: bold;
  font-size: 14px;
  color: #333333;
  border-top: 1px solid rgb(213, 213, 214);
  border-bottom: ${({ isExpanded }) => (isExpanded ? "1px solid rgb(213, 213, 214)" : "none")};
`;

export interface Props {
  readonly units: Units;
  readonly activeDay: number;
  readonly loading: boolean;
  readonly daytimeOnly?: boolean;
  readonly sprayOutlookForecast: SprayOutlookForecast;
  readonly expandHourly?: boolean;
  readonly generateWeatherIconWrapper: (dateTime: string, index: number) => string;
}

export interface State {
  readonly isExpanded: boolean;
}

export default class HourlySprayOutlookIndex extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isExpanded: props.expandHourly !== undefined ? props.expandHourly : false };
  }

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <div>
            <HourlySprayOutlookHeader
              onClick={this.toggleIsExpanded}
              isExpanded={this.state.isExpanded}
            >
              {t(`labels.hourlySprayOutlook`)}
              <ArrowContainer isExpandedView={this.state.isExpanded} />
            </HourlySprayOutlookHeader>
            {this.props.sprayOutlookForecast && this.state.isExpanded && (
              <HourlySprayOutlookList
                sprayOutlookDayForecast={this.props.sprayOutlookForecast.days[this.props.activeDay]}
                loading={this.props.loading}
                units={this.props.units}
                timezone={this.props.sprayOutlookForecast.station.timezoneId}
                generateWeatherIconWrapper={this.props.generateWeatherIconWrapper}
                activeDay={this.props.activeDay}
                daytimeOnly={this.props.daytimeOnly}
              />
            )}
          </div>
        )}
      </I18nConsumer>
    );
  }

  private readonly toggleIsExpanded = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  };
}
