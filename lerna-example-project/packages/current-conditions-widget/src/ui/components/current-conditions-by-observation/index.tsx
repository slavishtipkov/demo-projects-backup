import * as React from "react";
import { Moment } from "moment-timezone";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import { HourlySurfaceData, ForecastProps } from "../../../interfaces";
import { Consumer as I18nConsumer } from "../../../i18n";
import { FIRST_WEATHER_CODE, LAST_WEATHER_CODE } from "../../../constants";
import Icon from "../../components/icons";
import { getWindDirection, getClearOrMostlyClearDescription } from "../../../utils";

export const ForecastHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  color: #003764;
  font-weight: bold;
  border: 0.25px solid #d5d5d6;
`;

export const ForecastRow = styled.div`
  height: 24px;
  display: flex;
  font-size: 14px;
  border: 0.25px solid #d5d5d6;
  border-top: 0;
  padding: 3px 10px;
`;

export const ForecastLabel = styled.div`
  color: #95989a;
  flex: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
export const ForecastValue = styled.div`
  color: #003764;
  font-weight: bold;
  text-align: right;
  flex: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const IconWrapper = styled.div`
  display: flex;
  flex: 50%;
  align-items: flex-end;
  flex-direction: column;
  overflow: hidden;
`;

export interface Props {
  readonly forecast?: ReadonlyArray<HourlySurfaceData>;
  readonly iconWrapper: string;
  readonly visibleFields: ForecastProps;
  readonly units?: string;
  readonly sunrise: string | Moment;
  readonly sunset: string | Moment;
  readonly temperatureUnits: (units: string | undefined) => string;
  readonly speedUnits: (units: string | undefined) => string;
  readonly pressureUnits: (units: string | undefined) => string;
}

export default class CurrentConditionsByObservation extends React.Component<Props> {
  render(): JSX.Element {
    const isNightIconShouldBeShown = this.props.iconWrapper === "nightIcons";
    const weatherCode = this.props.forecast ? this.props.forecast[0].weatherCode : undefined;
    const clearOrMostlyClear = getClearOrMostlyClearDescription(
      isNightIconShouldBeShown,
      weatherCode,
    );

    return (
      <I18nConsumer>
        {({ t }) => (
          <div>
            <ForecastHeader>
              {t("common.header")}
              <IconWrapper>
                <Icon
                  wrapper={this.props.iconWrapper}
                  icon={`${this.props.forecast ? this.props.forecast[0].weatherCode : "-"}`}
                  color="currentColor"
                  width={"35px"}
                  height={"35px"}
                />
              </IconWrapper>
            </ForecastHeader>
            {this.props.visibleFields.temperature && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.temperature")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast ? this.props.forecast[0].temperature : "-"}
                  {this.props.temperatureUnits(this.props.units)}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.feelsLike && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.feelsLike")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast ? this.props.forecast[0].feelsLike : "-"}
                  {this.props.temperatureUnits(this.props.units)}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.windDirection && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.windDirection")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast
                    ? getWindDirection(this.props.forecast[0].windDirection)
                    : "-"}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.windSpeed && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.windSpeed")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast ? this.props.forecast[0].windSpeed : "-"}{" "}
                  {this.props.speedUnits(this.props.units)}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.humidity && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.humidity")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast ? this.props.forecast[0].relativeHumidity : ""}
                  {/* tslint:disable-next-line:jsx-use-translation-function */}%
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.barometer && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.barometer")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast ? this.props.forecast[0].pressureSeaLevel : "-"}
                  {` ${this.props.pressureUnits(this.props.units)}`}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.dewPoint && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.dewPoint")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast ? this.props.forecast[0].dewPoint : "-"}
                  {this.props.temperatureUnits(this.props.units)}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.sunrise && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.sunrise")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.sunrise !== "" ? this.props.sunrise : "-"}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.sunset && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.sunset")}:`}</ForecastLabel>
                <ForecastValue>{this.props.sunset !== "" ? this.props.sunset : "-"}</ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.observation_or_forecast && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.observation")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast &&
                  (this.props.forecast[0].weatherCode >= FIRST_WEATHER_CODE &&
                    this.props.forecast[0].weatherCode <= LAST_WEATHER_CODE)
                    ? clearOrMostlyClear !== ""
                      ? t(`common.${clearOrMostlyClear}`)
                      : t(`weatherDescriptions.${this.props.forecast[0].weatherCode}`)
                    : this.props.forecast &&
                      this.props.forecast[0].weatherDescription &&
                      this.checkWeatherDescription(this.props.forecast[0].weatherDescription)
                    ? this.props.forecast[0].weatherDescription
                    : "-"}
                </ForecastValue>
              </ForecastRow>
            )}
          </div>
        )}
      </I18nConsumer>
    );
  }

  private readonly checkWeatherDescription = (weatherDescription?: string) => {
    return typeof weatherDescription === "string";
  };
}
