import * as React from "react";
import * as moment from "moment-timezone";
import { Moment } from "moment-timezone";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled from "../../../styled-components";
import { DailyForecast, UnitsMetrics, HourlyObservationData } from "../../../interfaces";
import {
  noValue,
  percentageSign,
  degreeSymbol,
  FIRST_WEATHER_CODE,
  LAST_WEATHER_CODE,
} from "../../../constants";
import TemperatureContainer from "./temperature-container";
import ImageContainer from "./image-container";
import { getWindDirection, getClearOrMostlyClearDescription } from "../../../utils";

const ExpandedContainer = styled("div")`
  display: flex;
  align-content: center;
  padding: 0.5625em 1.5em;
  border-top: 1px solid #d5d5d6;
`;

const Col = styled("div")`
  flex: 1;
  max-width: 30%;
`;

const Row = styled("div")`
  display: flex;
`;

const DateContainer = styled("div")`
  flex: 1;
  max-width: 33%;
  margin-bottom: 0.625em;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ForecastContainer = styled("div")`
  flex: 1;
  max-width: 70%;
`;

const Day = styled("div")`
  position: absolute;
  top: 0;
  color: #95989a;
`;

const Forecast = styled("div")`
  display: flex;
  margin-top: 0.625em;
`;

const Header = styled("p")`
  color: #95989a;
  margin: 0;
  word-break: break-word;
  word-wrap: break-word;
`;

const Value = styled("p")`
  font-weight: bold;
  margin: 0.8em 0;
  word-break: break-word;
  word-wrap: break-word;
`;

export interface Props {
  readonly index: number;
  readonly date: string;
  readonly dailyForecastData: DailyForecast;
  readonly hourlyObservation: HourlyObservationData;
  readonly iconWrapper: string;
  readonly units?: string;
  readonly convertUnits: (units?: string) => UnitsMetrics;
  readonly checkFieldValue: (fieldValue: any) => any;
  readonly showTime: (date: Moment) => string;
  readonly timezone?: string;
}

const checkWeatherDescription = (weatherDescription?: string) => {
  return typeof weatherDescription === "string";
};

const renderCurrentConditions = (props: Props) => {
  const units = props.convertUnits(props.units);

  const isNightIconShouldBeShown = props.iconWrapper === "nightIcons";
  const weatherCode = props.dailyForecastData ? props.dailyForecastData.weatherCode : undefined;
  const clearOrMostlyClear = getClearOrMostlyClearDescription(
    isNightIconShouldBeShown,
    weatherCode,
  );

  return (
    <I18nConsumer>
      {({ t }) => (
        <ExpandedContainer>
          <DateContainer>
            <Day>{t(`common.currentConditions`)}</Day>
            <Forecast>
              <ImageContainer
                iconWrapper={props.iconWrapper}
                weatherCode={props.hourlyObservation.weatherCode}
                width={"95%"}
                height={"56px"}
              />

              <TemperatureContainer
                maxTemperature={0}
                minTemperature={0}
                isCurrentConditions
                temperature={props.hourlyObservation.temperature}
                units={props.units}
                isExpandedView
                convertUnits={props.convertUnits}
                checkFieldValue={props.checkFieldValue}
              />
            </Forecast>
          </DateContainer>

          <ForecastContainer>
            <div>
              <Row>
                <Col>
                  <Header>{`${t("headers.observation")}:`}</Header>
                </Col>
                <Col>
                  <Header>{`${t("headers.dewPoint")}:`}</Header>
                </Col>
                <Col>
                  <Header>{`${t("headers.sunrise")}:`}</Header>
                </Col>
                <Col>
                  <Header>{`${t("headers.sunset")}:`}</Header>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Value>
                    {props.hourlyObservation.weatherCode >= FIRST_WEATHER_CODE &&
                    props.hourlyObservation.weatherCode <= LAST_WEATHER_CODE
                      ? clearOrMostlyClear !== ""
                        ? t(`common.${clearOrMostlyClear}`)
                        : t(`weatherDescriptions.${props.hourlyObservation.weatherCode}`)
                      : props.checkFieldValue(props.hourlyObservation.weatherDescription) &&
                        checkWeatherDescription(props.hourlyObservation.weatherDescription)
                      ? props.hourlyObservation.weatherDescription
                      : noValue}
                  </Value>
                </Col>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.hourlyObservation.dewPoint)
                      ? `${props.hourlyObservation.dewPoint}${degreeSymbol}${units.temperature}`
                      : noValue}
                  </Value>
                </Col>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.dailyForecastData.sunrise)
                      ? props.showTime(props.dailyForecastData.sunrise)
                      : noValue}
                  </Value>
                </Col>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.dailyForecastData.sunset)
                      ? props.showTime(props.dailyForecastData.sunset)
                      : noValue}
                  </Value>
                </Col>
              </Row>
            </div>

            <div>
              <Row>
                <Col>
                  <Header>{`${t("headers.humidity")}:`}</Header>
                </Col>
                <Col>
                  <Header>{`${t("headers.barometer")}:`}</Header>
                </Col>
                <Col>
                  <Header>{`${t("headers.windSpeed")}:`}</Header>
                </Col>
                <Col>
                  <Header>{`${t("headers.windDir")}:`}</Header>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.hourlyObservation.relativeHumidity)
                      ? `${props.hourlyObservation.relativeHumidity}${percentageSign}`
                      : noValue}
                  </Value>
                </Col>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.hourlyObservation.pressureSeaLevel)
                      ? `${props.hourlyObservation.pressureSeaLevel} ${units.pressure}`
                      : noValue}
                  </Value>
                </Col>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.hourlyObservation.windSpeed)
                      ? `${props.hourlyObservation.windSpeed}${units.speed}`
                      : noValue}
                  </Value>
                </Col>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.hourlyObservation.windDirection)
                      ? getWindDirection(props.hourlyObservation.windDirection)
                      : "-"}
                  </Value>
                </Col>
              </Row>
            </div>
          </ForecastContainer>
        </ExpandedContainer>
      )}
    </I18nConsumer>
  );
};

const renderForecastDay = (props: Props) => {
  const units = props.convertUnits(props.units);

  return (
    <I18nConsumer>
      {({ t }) => (
        <ExpandedContainer>
          <DateContainer>
            <Day>{props.date}</Day>
            <Forecast>
              <ImageContainer
                iconWrapper={props.iconWrapper}
                weatherCode={props.dailyForecastData.weatherCode}
                width={"95%"}
                height={"56px"}
              />

              <TemperatureContainer
                maxTemperature={props.dailyForecastData.maxTemperature}
                minTemperature={props.dailyForecastData.minTemperature}
                isCurrentConditions={false}
                temperature={0}
                units={props.units}
                isExpandedView
                convertUnits={props.convertUnits}
                checkFieldValue={props.checkFieldValue}
              />
            </Forecast>
          </DateContainer>

          <ForecastContainer>
            <div>
              <Row>
                <Col>
                  <Header>{`${t("headers.forecast")}:`}</Header>
                </Col>
                <Col>
                  <Header>{`${t("headers.dewPoint")}:`}</Header>
                </Col>
                <Col>
                  <Header>{`${t("headers.sunrise")}:`}</Header>
                </Col>
                <Col>
                  <Header>{`${t("headers.sunset")}:`}</Header>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Value>
                    {props.dailyForecastData.weatherCode >= FIRST_WEATHER_CODE &&
                    props.dailyForecastData.weatherCode <= LAST_WEATHER_CODE
                      ? t(`weatherDescriptions.${props.dailyForecastData.weatherCode}`)
                      : props.checkFieldValue(props.dailyForecastData.weatherDescription) &&
                        checkWeatherDescription(props.dailyForecastData.weatherDescription)
                      ? props.dailyForecastData.weatherDescription
                      : noValue}
                  </Value>
                </Col>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.dailyForecastData.avgDewPoint)
                      ? `${props.dailyForecastData.avgDewPoint}${degreeSymbol}${units.temperature}`
                      : noValue}
                  </Value>
                </Col>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.dailyForecastData.sunrise)
                      ? props.showTime(props.dailyForecastData.sunrise)
                      : noValue}
                  </Value>
                </Col>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.dailyForecastData.sunset)
                      ? props.showTime(props.dailyForecastData.sunset)
                      : noValue}
                  </Value>
                </Col>
              </Row>
            </div>

            <div>
              <Row>
                <Col>
                  <Header>{`${t("headers.humidity")}:`}</Header>
                </Col>
                <Col>
                  <Header>{`${t("headers.barometer")}:`}</Header>
                </Col>
                <Col>
                  <Header>{`${t("headers.windSpeed")}:`}</Header>
                </Col>
                <Col>
                  <Header>{`${t("headers.windDir")}:`}</Header>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.dailyForecastData.avgRelativeHumidity)
                      ? `${props.dailyForecastData.avgRelativeHumidity}${percentageSign}`
                      : noValue}
                  </Value>
                </Col>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.dailyForecastData.avgPressure)
                      ? `${props.dailyForecastData.avgPressure} ${units.pressure}`
                      : noValue}
                  </Value>
                </Col>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.dailyForecastData.avgWindSpeed)
                      ? `${props.dailyForecastData.avgWindSpeed}${units.speed}`
                      : noValue}
                  </Value>
                </Col>
                <Col>
                  <Value>
                    {props.checkFieldValue(props.dailyForecastData.windDirection)
                      ? getWindDirection(props.dailyForecastData.windDirection)
                      : noValue}
                  </Value>
                </Col>
              </Row>
            </div>
          </ForecastContainer>
        </ExpandedContainer>
      )}
    </I18nConsumer>
  );
};

const ExpandedViewContainer = (props: Props) => {
  return props.index === 0 ? renderCurrentConditions(props) : renderForecastDay(props);
};

export default ExpandedViewContainer;
