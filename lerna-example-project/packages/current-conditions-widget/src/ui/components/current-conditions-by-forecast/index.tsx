import * as React from "react";
import { Moment } from "moment-timezone";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import { DailySurfaceData, FullDate, ForecastProps } from "../../../interfaces";
import { Consumer as I18nConsumer } from "../../../i18n";
import { FIRST_WEATHER_CODE, LAST_WEATHER_CODE } from "../../../constants";
import Icon from "../../components/icons";
import { getWindDirection } from "../../../utils";

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
  readonly forecast?: ReadonlyArray<DailySurfaceData>;
  readonly fullDate: FullDate;
  readonly day: string;
  readonly iconWrapper: string;
  readonly visibleFields: ForecastProps;
  readonly units?: string;
  readonly temperatureUnits: (units: string | undefined) => string;
  readonly speedUnits: (units: string | undefined) => string;
  readonly pressureUnits: (units: string | undefined) => string;
  readonly showTime: (date: Moment) => string;
}

export interface PrecipType {
  readonly type: string;
  readonly amount: number;
  readonly probability: number;
}

export default class CurrentConditionsByForecast extends React.Component<Props> {
  render(): JSX.Element {
    const precipitation = this.props.forecast
      ? this.getPrecipData(this.props.forecast[0].precipitation)
      : { precipType: undefined, precipAmount: undefined, precipChance: undefined };
    return (
      <I18nConsumer>
        {({ t }) => (
          <div>
            <ForecastHeader>
              {`${t(`days.${this.props.fullDate.dayOfWeekFull}`)}, ${t(
                `months.monthsShort.${this.props.fullDate.month}`,
              )}  ${this.props.day}`}
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
                  {this.props.forecast ? this.props.forecast[0].maxTemperature : "-"}
                  {this.props.temperatureUnits(this.props.units)}
                  {/* tslint:disable-next-line:jsx-use-translation-function */}
                  {" / "}
                  {this.props.forecast ? this.props.forecast[0].minTemperature : "-"}
                  {this.props.temperatureUnits(this.props.units)}
                </ForecastValue>
              </ForecastRow>
            )}

            {this.props.visibleFields.feelsLike && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.feelsLike")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast ? this.props.forecast[0].maxFeelsLike : "-"}
                  {this.props.temperatureUnits(this.props.units)}
                  {/* tslint:disable-next-line:jsx-use-translation-function */}
                  {" / "}
                  {this.props.forecast ? this.props.forecast[0].minFeelsLike : "-"}
                  {this.props.temperatureUnits(this.props.units)}
                </ForecastValue>
              </ForecastRow>
            )}

            {this.props.visibleFields.precipType && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.precipType")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.checkFieldValue(precipitation.precipType)
                    ? t(`common.${precipitation.precipType}`)
                    : "-"}
                </ForecastValue>
              </ForecastRow>
            )}

            {this.props.visibleFields.precipChance && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.precipChance")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.checkFieldValue(precipitation.precipChance)
                    ? precipitation.precipChance
                    : "-"}
                </ForecastValue>
              </ForecastRow>
            )}

            {this.props.visibleFields.precipAmount && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.precipAmount")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.checkFieldValue(precipitation.precipAmount)
                    ? precipitation.precipAmount
                    : "-"}
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
                  {this.props.forecast ? this.props.forecast[0].avgWindSpeed : "-"}{" "}
                  {this.props.speedUnits(this.props.units)}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.humidity && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.humidity")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast ? this.props.forecast[0].avgRelativeHumidity : "-"}
                  {/* tslint:disable-next-line:jsx-use-translation-function */}%
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.barometer && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.barometer")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast ? this.props.forecast[0].avgPressure : "-"}
                  {` ${this.props.pressureUnits(this.props.units)}`}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.dewPoint && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.dewPoint")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast ? this.props.forecast[0].avgDewPoint : "-"}
                  {this.props.temperatureUnits(this.props.units)}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.evapotranspiration && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.evapotranspiration")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast
                    ? `${
                        this.props.forecast[0].evapotranspiration
                      } ${this.precipitationAmountUnits()}`
                    : "-"}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.sunrise && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.sunrise")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast ? this.props.showTime(this.props.forecast[0].sunrise) : "-"}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.sunset && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.sunset")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast ? this.props.showTime(this.props.forecast[0].sunset) : "-"}
                </ForecastValue>
              </ForecastRow>
            )}
            {this.props.visibleFields.observation_or_forecast && (
              <ForecastRow>
                <ForecastLabel>{`${t("labels.forecast")}:`}</ForecastLabel>
                <ForecastValue>
                  {this.props.forecast &&
                    (this.props.forecast[0].weatherCode >= FIRST_WEATHER_CODE &&
                    this.props.forecast[0].weatherCode <= LAST_WEATHER_CODE
                      ? t(`weatherDescriptions.${this.props.forecast[0].weatherCode}`)
                      : this.props.forecast[0].weatherCode === 0
                      ? "-"
                      : this.props.forecast[0].weatherDescription)}
                </ForecastValue>
              </ForecastRow>
            )}
          </div>
        )}
      </I18nConsumer>
    );
  }

  private readonly checkFieldValue = (fieldValue: any) => {
    if (fieldValue !== null && fieldValue !== undefined) {
      return true;
    }
    return false;
  };

  private readonly getPrecipData = (precipData?: ReadonlyArray<PrecipType>) => {
    if (precipData !== undefined && precipData.length !== 0) {
      const rainObject = precipData.find(p => p.type.toLocaleLowerCase() === "rain");
      const snowObject = precipData.find(p => p.type.toLocaleLowerCase() === "snow");
      const iceObject = precipData.find(p => p.type.toLocaleLowerCase() === "freezing rain");

      const quantityOfLiquid = rainObject ? rainObject.amount : 0;
      const quantityOfIce = iceObject ? iceObject.amount : 0;
      const quantityOfSnow = snowObject ? snowObject.amount : 0;

      let precipType: string | undefined = "";
      let precipAmount: string | undefined = "";
      let precipChance: string | undefined = rainObject ? `${rainObject.probability}%` : "0";

      if (quantityOfLiquid === 0) {
        if (quantityOfLiquid === 0 && parseFloat(`${precipChance}`) !== 0) {
          precipType = "rain";
          precipAmount = `L: ${quantityOfLiquid} ${this.precipitationAmountUnits()}`;
        } else {
          precipType = undefined;
          precipAmount = undefined;
          precipChance = undefined;
        }
      } else if (parseFloat(`${quantityOfSnow}`) !== 0) {
        precipType = "snow";
        precipAmount = `S: ${this.getFormatedSnowQuantity(
          quantityOfSnow,
        )} ${this.precipitationAmountUnits()} L: ${quantityOfLiquid} ${this.precipitationAmountUnits()}`;
      } else if (parseFloat(`${quantityOfIce}`) !== 0) {
        precipType = "freezing_rain";
        precipAmount = `I: ${quantityOfIce} ${this.precipitationAmountUnits()} L: ${quantityOfLiquid} ${this.precipitationAmountUnits()}`;
      } else {
        precipType = "rain";
        precipAmount = `L: ${quantityOfLiquid} ${this.precipitationAmountUnits()}`;
      }

      return { precipType, precipAmount, precipChance };
    }
    return { precipType: undefined, precipAmount: undefined, precipChance: undefined };
  };

  private readonly precipitationAmountUnits = () => {
    return this.props.units && this.props.units.toLowerCase() === "metric" ? "mm" : "in";
  };

  private readonly getFormatedSnowQuantity = (quantityOfSnow: number) => {
    return this.props.units && this.props.units.toLowerCase() === "metric"
      ? this.formatMetricSnowRange(quantityOfSnow)
      : this.formatImperialSnowRange(quantityOfSnow);
  };

  private readonly formatImperialSnowRange = (quantityOfSnow: number) => {
    if (quantityOfSnow <= 0) {
      return "0";
    }
    if (quantityOfSnow < 0.25) {
      return "<1/4";
    }
    if (quantityOfSnow < 1) {
      return "1/4-1";
    }
    if (quantityOfSnow < 3) {
      return "1-3";
    }
    if (quantityOfSnow < 5) {
      return "3-5";
    }
    if (quantityOfSnow < 7) {
      return "5-7";
    }
    if (quantityOfSnow < 10) {
      return "7-10";
    }
    if (quantityOfSnow < 13) {
      return "10-13";
    }
    if (quantityOfSnow < 15) {
      return "13-15";
    }
    return "15+";
  };

  private readonly formatMetricSnowRange = (quantityOfSnow: number) => {
    if (quantityOfSnow <= 0) {
      return "0";
    }
    if (quantityOfSnow < 1) {
      return "<1";
    }
    if (quantityOfSnow < 3) {
      return "1-3";
    }
    if (quantityOfSnow < 6) {
      return "3-6";
    }
    if (quantityOfSnow < 10) {
      return "6-10";
    }
    if (quantityOfSnow < 20) {
      return "10-20";
    }
    if (quantityOfSnow < 30) {
      return "20-30";
    }
    return ">30";
  };
}
