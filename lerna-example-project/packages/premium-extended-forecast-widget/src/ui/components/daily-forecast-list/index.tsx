import { Units } from "@dtn/i18n-lib";
import * as React from "react";
import { DailyForecast, ObservedAt, HourlyObservationData } from "../../../interfaces";
import styled, { css } from "../../../styled-components";
import DailyForecastListItem from "../../components/daily-forecast-list-item";
import LoadingIndicator from "../../components/loader";
import ErrorContainer from "../../components/error-container";
import FooterContainer from "../../components/footer";
import HeaderRowContainer from "./header-row";
import { ERRORS } from "../../../constants";
import { mobileViewPixels } from "../../../constants";
import * as ZipCodeWidget from "@dtn/zip-code-widget";
import * as PremiumLocationSelectWidget from "@dtn/premium-location-select-widget";

const Wrapper = styled("div")`
  font-size: 16px;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  background: #ffffff;
  padding: 0 10px 10px 10px;
  text-align: left;
`;

export interface HeaderWidgetsWrapperProps {
  readonly widgetContainerWidth: number;
}

const HeaderWidgetsWrapper = styled<HeaderWidgetsWrapperProps, "div">("div")`
  display: flex;
  width: 100%;
  align-items: baseline;
  ${({ widgetContainerWidth }) =>
    widgetContainerWidth <= 665 &&
    css`
      display: block;
    `};
`;

const WidgetContent = styled("div")`
  margin-top: 20px;
`;

export interface WidgetItemWrapperProps {
  readonly showStationSelect: boolean;
  readonly showZipCode: boolean;
  readonly widgetContainerWidth: number;
}

const WidgetZipCodeWrapper = styled<WidgetItemWrapperProps, "div">("div")`
  width: ${({ widgetContainerWidth, showStationSelect, showZipCode }) =>
    widgetContainerWidth > 665 && showStationSelect && showZipCode ? `50%` : `100%`};
  display: ${({ showZipCode }) => !showZipCode && "none"};

  ${({ showStationSelect, showZipCode, widgetContainerWidth }) =>
    showZipCode &&
    showStationSelect &&
    widgetContainerWidth > 665 &&
    css`
      &:last-of-type {
        margin-left: 10px;
      }
    `};

  ${({ widgetContainerWidth }) =>
    widgetContainerWidth <= 480 &&
    css`
      .item {
        padding: 0.125em 0.6875em;
      }
    `};

  & > div {
    margin: 10px 0;
  }
`;

const WidgetLocationSelectWrapper = styled<WidgetItemWrapperProps, "div">("div")`
  width: ${({ widgetContainerWidth, showStationSelect, showZipCode }) =>
    widgetContainerWidth > 665 && showStationSelect && showZipCode ? `50%` : `100%`};
  display: ${({ showStationSelect }) => !showStationSelect && "none"};

  ${({ showStationSelect, showZipCode, widgetContainerWidth }) =>
    showZipCode &&
    showStationSelect &&
    widgetContainerWidth > 665 &&
    css`
      &:last-of-type {
        margin-left: 10px;
      }
    `};

  ${({ widgetContainerWidth }) =>
    widgetContainerWidth <= 480 &&
    css`
      .item {
        padding: 0.125em 0.6875em;
      }
    `};

  & > div {
    margin: 10px 0;
  }
`;

export interface StationWrapperProps {
  readonly widgetContainerWidth: number;
}

const StationWrapper = styled<StationWrapperProps, "div">("div")`
  margin-top: 0 !important;
  padding: 0 3px !important;

  ${({ widgetContainerWidth }) =>
    widgetContainerWidth <= 665 &&
    css`
      width: 100%;
      margin: -15px 0 -3px 0 !important;
    `};
`;

const DaysContainer = styled("div")`
  font-size: 14px;
  color: #003764;
  border: 1px solid #d5d5d6;
`;

export interface Props {
  readonly weatherForecastData: ReadonlyArray<DailyForecast>;
  readonly hourlyObservation: ReadonlyArray<HourlyObservationData>;
  readonly units?: string;
  readonly loading: boolean;
  readonly error?: string;
  readonly observedAt?: ObservedAt;
  readonly observedAtTime?: Date;
  readonly showDailyForecast: boolean;
  readonly showStationSelect: boolean;
  readonly showZipCode: boolean;
  readonly timezone?: string;
  readonly setError: (error: string) => void;
}

export interface StateProps {
  readonly widgetContainerWidth: number;
}

export default class extends React.Component<Props, StateProps> {
  private widgetContainerRef: any;

  // tslint:disable-next-line:member-ordering
  constructor(props: Props) {
    super(props);
    this.state = { widgetContainerWidth: 0 };
  }

  componentDidMount(): void {
    this.handleWidgetResize();
    window.addEventListener("resize", this.handleWidgetResize);
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.handleWidgetResize);
  }

  handleWidgetResize = () => {
    this.setState({ widgetContainerWidth: this.widgetContainerRef.clientWidth });
  };

  renderWeatherForecast = () => {
    const isMobile = this.state.widgetContainerWidth <= mobileViewPixels;

    return this.props.weatherForecastData.map((dailyForecast, index) => {
      return (
        <DailyForecastListItem
          dailyForecastData={dailyForecast}
          hourlyObservation={this.props.hourlyObservation[0]}
          key={`${dailyForecast.date.toString()}-${index}`}
          units={this.props.units}
          index={index}
          isMobile={isMobile}
          timezone={this.props.timezone}
        />
      );
    });
  };

  render(): JSX.Element {
    const isMobile = this.state.widgetContainerWidth <= mobileViewPixels;

    return (
      // tslint:disable-next-line:jsx-no-lambda
      <Wrapper innerRef={(ref: any) => (this.widgetContainerRef = ref)}>
        <HeaderWidgetsWrapper widgetContainerWidth={this.state.widgetContainerWidth}>
          <WidgetZipCodeWrapper
            showZipCode={this.props.showZipCode}
            showStationSelect={this.props.showStationSelect}
            widgetContainerWidth={this.state.widgetContainerWidth}
          >
            <ZipCodeWidget.ZipCode theme={{}} />
          </WidgetZipCodeWrapper>

          <WidgetLocationSelectWrapper
            showZipCode={this.props.showZipCode}
            showStationSelect={this.props.showStationSelect}
            widgetContainerWidth={this.state.widgetContainerWidth}
          >
            <StationWrapper widgetContainerWidth={this.state.widgetContainerWidth}>
              <PremiumLocationSelectWidget.PremiumLocationSelect theme={{}} />
            </StationWrapper>
          </WidgetLocationSelectWrapper>
        </HeaderWidgetsWrapper>

        {this.props.error && <ErrorContainer error={this.props.error} />}

        {this.props.loading && <LoadingIndicator />}

        {!this.props.error && !this.props.loading && (
          <WidgetContent>
            {!isMobile && this.props.showDailyForecast && <HeaderRowContainer />}

            {this.props.showDailyForecast && (
              <DaysContainer>{this.renderWeatherForecast()}</DaysContainer>
            )}

            {this.props.showDailyForecast && (
              <FooterContainer
                observedAt={this.props.observedAt}
                observedAtTime={this.props.observedAtTime}
              />
            )}
          </WidgetContent>
        )}
      </Wrapper>
    );
  }
}
