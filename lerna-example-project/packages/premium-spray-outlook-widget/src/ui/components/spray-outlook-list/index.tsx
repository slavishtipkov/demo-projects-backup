import { Units } from "@dtn/i18n-lib";
import * as React from "react";
import styled, { css } from "../../../styled-components";
import LoadingIndicator from "../../components/loader";
import ErrorContainer from "../../components/error-container";
import SprayOutlookItem from "../spray-outlook-item";
import { ERRORS } from "../../../constants";
import Icon from "../icons";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import * as moment from "moment-timezone";
import { SprayOutlookForecast, SprayOutlookDayOutlook } from "@dtn/api-lib";

const Wrapper = styled("div")`
  font-size: 16px;
  padding: 0.9375em 0 0 0;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  background: #ffffff;
  position: relative;
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

const NextSprayContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  height: auto;
  position: relative;
  top: -17px;
  left: 0;
  padding: 6px;
`;

const Gadgets = styled("div")`
  display: flex;
  justify-content: flex-end;
  margin-right: 13px;
  height: auto;
  width: 26%;
`;

const ImageContainer = styled("div")`
  text-align: center;
  height: auto;
  overflow: hidden;
  cursor: pointer;
`;

const MarginImageContainer = styled("div")`
  text-align: center;
  height: auto;
  overflow: hidden;
  cursor: pointer;
  margin-right: 10px;
`;

const SprayCaptionLabel = styled("div")`
  color: #59595b;
  margin-bottom: 3px;
  font-size: 12px;
`;

const SprayCaptionValue = styled("div")`
  color: #00b355;
  font-weight: bold;
  font-size: 18px;
  opacity: 0.8;
`;

const NoSprayCaptionValue = styled("div")`
  color: #59595b;
  font-weight: bold;
  font-size: 18px;
  opacity: 0.8;
`;

const Tooltip = styled("div")`
  position: absolute;
  top: 30px;
  right: 16px;
  border-radius: 3px;
  box-shadow: 0 0 16px -2px rgba(0, 0, 0, 0.2);
  max-width: 263px;
  width: 83%;
  height: auto;
  background: #ffffff;
  padding: 15px;
  z-index: 10;
`;

const TooltipSpan = styled("div")`
  color: rgb(89, 89, 91);
  font-size: 12px;
`;

const TooltipTitle = styled("div")`
  color: rgb(89, 89, 91);
  font-size: 18px;
  margin: 0;
`;

const TooltipRed = styled("div")`
  color: #ea4636;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 3px;
  font-size: 14px;
`;

const TooltipYellow = styled("div")`
  color: #d5c453;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 3px;
  font-size: 14px;
`;
const TooltipGreen = styled("div")`
  color: #00b355;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 3px;
  font-size: 14px;
`;

const TooltipGray = styled("div")`
  color: #9a9a9a;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 3px;
  font-size: 14px;
`;

export interface Props {
  readonly units?: string;
  readonly onDaySelect: (activeDay: number) => void;
  readonly activeDay: number;
  readonly error?: string;
  readonly observedAt?: Date;
  readonly observedAtTime?: Date;
  readonly showFooter?: boolean;
  readonly sprayOutlookForecast: SprayOutlookForecast;
  readonly isTooltipOpen: boolean;
  readonly changeTooltipState: () => void;
  readonly changeSettingsState: () => void;
}

export default class extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    const e = "ontouchstart" in window ? "touchstart" : "click";
    document.addEventListener(e, event => this.clickOutsideTooltip(event));
  }

  private tooltipContainerRef: any;
  private tooltipIconContainerRef: any;

  renderWeatherForecast = () => {
    let weatherData: ReadonlyArray<SprayOutlookDayOutlook> = this.props.sprayOutlookForecast
      ? this.props.sprayOutlookForecast.days
      : [];
    return weatherData.map((dailyForecast, index) => {
      return (
        <SprayOutlookItem
          key={`day-${index}`}
          units={this.props.units}
          index={index}
          onDaySelect={this.props.onDaySelect}
          activeDay={this.props.activeDay}
          sprayOutlookForecast={this.props.sprayOutlookForecast}
        />
      );
    });
  };

  render(): JSX.Element {
    let nextSprayRecDate: string | undefined;
    if (this.props.sprayOutlookForecast.nextSprayRecDate !== undefined) {
      nextSprayRecDate = moment(this.props.sprayOutlookForecast.nextSprayRecDate)
        .tz(this.props.sprayOutlookForecast.station.timezoneId)
        .format("h:mmA z MMMM D");
    }
    return (
      <I18nConsumer>
        {({ t }) => (
          <Wrapper>
            <NextSprayContainer>
              <div>
                <SprayCaptionLabel>{t(`common.nextSprayLabel`)}</SprayCaptionLabel>
                {nextSprayRecDate ? (
                  <SprayCaptionValue>{nextSprayRecDate}</SprayCaptionValue>
                ) : (
                  <NoSprayCaptionValue>{t("noRecommendedSprayTime")}</NoSprayCaptionValue>
                )}
              </div>
              <Gadgets>
                <MarginImageContainer
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => this.props.changeTooltipState()}
                  // tslint:disable-next-line:jsx-no-lambda
                  innerRef={ref => (this.tooltipIconContainerRef = ref)}
                >
                  <Icon
                    wrapper={"common"}
                    icon={"question"}
                    color={"#59595B"}
                    width={"18px"}
                    height={"18px"}
                  />
                </MarginImageContainer>
                {/* tslint:disable-next-line:jsx-no-lambda */}
                <ImageContainer onClick={() => this.props.changeSettingsState()}>
                  <Icon
                    wrapper={"common"}
                    icon={"gear"}
                    color={"#59595B"}
                    width={"18px"}
                    height={"18px"}
                  />
                </ImageContainer>
              </Gadgets>
            </NextSprayContainer>
            <DaysContainer>{this.renderWeatherForecast()}</DaysContainer>
            {this.props.isTooltipOpen && (
              <Tooltip
                // tslint:disable-next-line:jsx-no-lambda
                innerRef={ref => (this.tooltipContainerRef = ref)}
              >
                <TooltipTitle>{t(`tooltip.title`)}</TooltipTitle>
                <TooltipRed>{t(`tooltip.captions.red`)}</TooltipRed>
                <TooltipSpan>{t(`tooltip.content.red`)}</TooltipSpan>
                <TooltipYellow>{t(`tooltip.captions.yellow`)}</TooltipYellow>
                <TooltipSpan>{t(`tooltip.content.yellow`)}</TooltipSpan>
                <TooltipGreen>{t(`tooltip.captions.green`)}</TooltipGreen>
                <TooltipSpan>{t(`tooltip.content.green`)}</TooltipSpan>
                <TooltipGray>{t(`tooltip.captions.gray`)}</TooltipGray>
                <TooltipSpan>{t(`tooltip.content.gray`)}</TooltipSpan>
              </Tooltip>
            )}
          </Wrapper>
        )}
      </I18nConsumer>
    );
  }

  private readonly clickOutsideTooltip = (e: any) => {
    if (
      this.tooltipContainerRef &&
      !this.tooltipIconContainerRef.contains(e.target) &&
      !this.tooltipContainerRef.contains(e.target) &&
      this.props.isTooltipOpen
    ) {
      this.props.changeTooltipState();
    }
  };
}
