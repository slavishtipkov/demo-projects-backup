import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import styled, { ThemeProvider, ThemeProp } from "../../../../styled-components";
import {
  ICON_RISC_COLORS,
  WEATHER_CONDITIONS,
  WIND_DIR_ICON_ROTATION,
} from "../../../../constants";
import Icon from "../../icons";
import { SprayOutlookHourOutlook, SprayOutlookWindRiskValue } from "@dtn/api-lib";
import { Units } from "@dtn/i18n-lib";

const DetailsWrapper = styled<{ readonly riskColor: string }, "div">("div")`
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 20px 15px 10px 15px;
  border: 1px solid rgb(213, 213, 214);
  border-left: 5px solid ${(p: { readonly riskColor: string }) => p.riskColor};
  border-right: none;
  border-top: none;
  position: relative;
  background-color: #ffffff;
  width: 100%;
  box-sizing: border-box;
  overflow-y: hidden;
`;

const Heading = styled<{ readonly riskColor: string }, "div">("div")`
  color: ${(p: { readonly riskColor: string }) => p.riskColor};
  fong-size: 18px;
  display: flex;
  flex-direction: row;
  align-content: center;
  margin-bottom: 10px;
`;

const HeadingText = styled("div")`
  font-size: 25px;
  font-weight: bold;
  margin-left: 10px;
`;

const ContentWrapper = styled("div")`
  display: flex;
  flex-direction: row;
`;

const LeftColumn = styled("div")`
  flex-direction: column;
  flex-grow: 1;
`;

const RightColumn = styled("div")`
  flex-direction: column;
  flex-grow: 1;
`;

const Label = styled("div")`
  color: rgb(149, 152, 154);
  font-size: 13px;
  margin: 5px 0 10px 0;
`;

const DisplayValue = styled<{ readonly riskColor: string }, "div">("div")`
  color: ${(p: { readonly riskColor: string }) => p.riskColor};
  font-weight: bold;
`;

const WindDirectionText = styled("div")`
  font-size: 30px;
  font-weight: bold;
  color: #000000;
  display: flex;
`;

const WeatherWrapper = styled("div")`
  overflow: hidden;
  display: flex;
  flex-direction: row;
`;

const WeatherIconWrapper = styled("div")`
  padding-right: 20px;
`;

const Temperatures = styled("div")`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Temperature = styled("div")`
  font-size: 18px;
  margin-bottom: 5px;
`;

export interface Props {
  readonly units: Units;
  readonly sprayOutlookHour: SprayOutlookHourOutlook;
  readonly index: number;
  readonly generateWeatherIconWrapper: (dateTime: string, index: number) => string;
}

export interface State {
  readonly isExpanded: boolean;
}

export default class HourlySprayOutlookListItemDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isExpanded: false };
  }

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <DetailsWrapper riskColor={ICON_RISC_COLORS[this.props.sprayOutlookHour.risk.value]}>
            <Heading riskColor={ICON_RISC_COLORS[this.props.sprayOutlookHour.risk.value]}>
              <Icon
                wrapper={"common"}
                icon={this.props.sprayOutlookHour.risk.value}
                color={ICON_RISC_COLORS[this.props.sprayOutlookHour.risk.value]}
                width={"30px"}
                height={"30px"}
              />
              <HeadingText>
                {WEATHER_CONDITIONS[this.props.sprayOutlookHour.risk.value]}
              </HeadingText>
            </Heading>
            <ContentWrapper>
              <LeftColumn>
                <Label>{t(`labels.inversionRisk`)}</Label>
                <DisplayValue
                  riskColor={ICON_RISC_COLORS[this.props.sprayOutlookHour.inversionRisk.risk.value]}
                >
                  {this.props.sprayOutlookHour.inversionRisk.risk.display}
                </DisplayValue>
                <Label>{t(`labels.windDirectionSpeed`)}</Label>
                <WindDirectionText>
                  {`${this.props.sprayOutlookHour.windRisk.direction.display} `}
                  {this.props.sprayOutlookHour.windRisk.direction.display !== "N/A" && (
                    <Icon
                      wrapper={"common"}
                      icon={"windDirArrow"}
                      color="currentColor"
                      width={"30px"}
                      height={"30px"}
                      rotation={`${WIND_DIR_ICON_ROTATION[
                        this.props.sprayOutlookHour.windRisk.direction.display
                      ] + 180}deg`}
                    />
                  )}
                </WindDirectionText>
                <DisplayValue
                  riskColor={ICON_RISC_COLORS[this.props.sprayOutlookHour.windRisk.risk.value]}
                >
                  {formatWindSpeed(this.props.sprayOutlookHour.windRisk)}
                </DisplayValue>
              </LeftColumn>
              <RightColumn>
                <Label>{t(`labels.precipitationRisk`)}</Label>
                <DisplayValue
                  riskColor={ICON_RISC_COLORS[this.props.sprayOutlookHour.precipRisk.risk.value]}
                >
                  {this.props.sprayOutlookHour.precipRisk.display}
                </DisplayValue>
                <Label>{t(`labels.weatherTempDewPt`)}</Label>
                <WeatherWrapper>
                  {this.props.sprayOutlookHour.weatherCondition.code !== null && (
                    <WeatherIconWrapper>
                      <Icon
                        wrapper={this.props.generateWeatherIconWrapper(
                          this.props.sprayOutlookHour.dateTime.toString(),
                          this.props.index,
                        )}
                        icon={this.props.sprayOutlookHour.weatherCondition.code.toString()}
                        color="currentColor"
                        width={"60px"}
                        height={"60px"}
                      />
                    </WeatherIconWrapper>
                  )}
                  <Temperatures>
                    <Temperature>
                      <DisplayValue
                        riskColor={
                          ICON_RISC_COLORS[this.props.sprayOutlookHour.temperatureRisk.risk.value]
                        }
                      >
                        {this.props.sprayOutlookHour.temperatureRisk.value}
                        {this.temperatureUnits(this.props.units)}
                      </DisplayValue>
                    </Temperature>
                    <Temperature>
                      <DisplayValue riskColor={"#59595b"}>
                        {this.props.sprayOutlookHour.dewpointRisk.value}
                        {this.temperatureUnits(this.props.units)}
                      </DisplayValue>
                    </Temperature>
                  </Temperatures>
                </WeatherWrapper>
              </RightColumn>
            </ContentWrapper>
          </DetailsWrapper>
        )}
      </I18nConsumer>
    );
  }

  private readonly temperatureUnits = (units: string | undefined) => {
    const degreeSymbol = String.fromCharCode(176);
    return units && units.toLowerCase() === "metric" ? degreeSymbol + "C" : degreeSymbol + "F";
  };
}

function formatWindSpeed(wind: SprayOutlookWindRiskValue): string {
  if (wind.display !== "") {
    return wind.display;
  }
  if (wind.gust !== null) {
    return `${wind.value} G ${wind.gust} ${wind.units}`;
  }
  return `${wind.value} ${wind.units}`;
}
