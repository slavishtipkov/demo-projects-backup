import { Units } from "@dtn/i18n-lib";
import * as React from "react";
import { DailyForecast, ObservedAt } from "../../../interfaces";
import styled, { css } from "../../../styled-components";
import DailyForecastListItem from "../../components/daily-forecast-list-item";
import LoadingIndicator from "../../components/loader";
import ErrorContainer from "../../components/error-container";
import FooterContainer from "../../components/footer";
import { ERRORS } from "../../../constants";

export interface WrapperProps {
  readonly allowSelection: boolean;
}

const Wrapper = styled<WrapperProps, "div">("div")`
  font-size: 16px;
  padding: ${({ allowSelection }) => (allowSelection ? "0.9375em 0 0 0" : "0.9375em 0")};
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  background: #ffffff;
`;

const DaysContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  height: auto;
  color: #003764;

  @media (max-width: 320px) {
    display: block;
  }
`;

export interface Props {
  readonly weatherForecastData: ReadonlyArray<DailyForecast>;
  readonly units?: string;
  readonly onDaySelect: (activeDay: number) => void;
  readonly activeDay: number;
  readonly loading: boolean;
  readonly error?: string;
  readonly allowDaySelection: boolean;
  readonly setError: (error: string) => void;
  readonly observedAt?: ObservedAt;
  readonly observedAtTime?: Date;
  readonly showFooter?: boolean;
  readonly timezone?: string;
}

export default class extends React.Component<Props> {
  renderWeatherForecast = () => {
    return this.props.weatherForecastData.map((dailyForecast, index) => {
      return (
        <DailyForecastListItem
          dailyForecastData={dailyForecast}
          key={`${dailyForecast.date.toString()}-${index}`}
          units={this.props.units}
          index={index}
          onDaySelect={this.props.onDaySelect}
          activeDay={this.props.activeDay}
          allowDaySelection={this.props.allowDaySelection}
          timezone={this.props.timezone}
        />
      );
    });
  };

  render(): JSX.Element {
    if (this.props.loading) {
      return <LoadingIndicator />;
    } else if (this.props.error) {
      return <ErrorContainer error={this.props.error} />;
    } else if (this.props.weatherForecastData.length === 0) {
      // if no error is return but no forecast data is received - error message "No data message" is set
      this.props.setError(ERRORS.noDataErrorMessage.key);
      return <ErrorContainer error={this.props.error} />;
    } else {
      return (
        <Wrapper allowSelection={this.props.allowDaySelection}>
          <DaysContainer>{this.renderWeatherForecast()}</DaysContainer>
          {this.props.showFooter && (
            <FooterContainer
              observedAt={this.props.observedAt}
              observedAtTime={this.props.observedAtTime}
            />
          )}
        </Wrapper>
      );
    }
  }
}
