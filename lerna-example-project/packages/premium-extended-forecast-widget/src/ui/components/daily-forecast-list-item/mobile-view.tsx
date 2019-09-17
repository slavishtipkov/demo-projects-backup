import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import { UnitsMetrics, PrecipitationUI, Precipitation } from "../../../interfaces";
import styled from "../../../styled-components";
import TemperatureContainer from "./temperature-container";
import { noValue } from "../../../constants";

const TemperatureWrapper = styled("div")`
  flex: 1;
`;

const Col = styled("div")`
  flex: 1;
  margin-right: 5px;
`;

const Row = styled("div")`
  display: flex;
`;

const Header = styled("div")`
  color: #95989a;
  word-break: break-word;
  word-wrap: break-word;
`;

const Value = styled("div")`
  word-break: break-word;
  word-wrap: break-word;
`;

export interface Props {
  readonly maxTemperature: number;
  readonly minTemperature: number;
  readonly precipitation: ReadonlyArray<Precipitation>;
  readonly units?: string;
  readonly isMobileView?: boolean;
  readonly convertUnits: (units?: string) => UnitsMetrics;
  readonly checkFieldValue: (fieldValue: any) => boolean;
  readonly getPrecipitation: (precipitation: ReadonlyArray<Precipitation>) => PrecipitationUI;
}

const MobileView = (props: Props) => {
  return (
    <I18nConsumer>
      {({ t }) => (
        <TemperatureWrapper>
          <Row>
            <Col>
              <Header>{`${t("headers.highLow")}:`}</Header>
            </Col>
            <Col>
              <TemperatureContainer
                maxTemperature={props.maxTemperature}
                minTemperature={props.minTemperature}
                isCurrentConditions={false}
                temperature={0}
                units={props.units}
                convertUnits={props.convertUnits}
                isMobileView={props.isMobileView}
                checkFieldValue={props.checkFieldValue}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Header>{`${t("headers.precipChance")}:`}</Header>
            </Col>
            <Col>
              <Value>
                {props.getPrecipitation(props.precipitation).precipChance !== "-"
                  ? `${props.getPrecipitation(props.precipitation).precipChance}%`
                  : noValue}
              </Value>
            </Col>
          </Row>

          <Row>
            <Col>
              <Header>{`${t("headers.precipAmount")}:`}</Header>
            </Col>
            <Col>
              <Value>
                {props.getPrecipitation(props.precipitation).precipType !== "-"
                  ? `${t(`common.${props.getPrecipitation(props.precipitation).precipType}`)} -
                     ${props.getPrecipitation(props.precipitation).precipAmount}`
                  : noValue}
              </Value>
            </Col>
          </Row>
        </TemperatureWrapper>
      )}
    </I18nConsumer>
  );
};

export default MobileView;
