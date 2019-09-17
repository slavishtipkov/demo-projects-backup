import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled, { css } from "../../../styled-components";
import { UnitsMetrics } from "../../../interfaces";
import { degreeSymbol, separator } from "../../../constants";

export interface TemperatureProps {
  readonly isExpandedView?: boolean;
  readonly isMobileView?: boolean;
}

const Temperature = styled<TemperatureProps, "div">("div")`
  flex: 1;
  max-width: 30%;
  ${({ isExpandedView }) =>
    isExpandedView &&
    css`
      flex: 2;
      max-width: 60%;
      align-self: center;
      text-align: center;
      font-size: 1.25em;
    `};
  ${({ isMobileView }) =>
    isMobileView &&
    css`
      max-width: 100%;
    `};
`;

export interface TemperatureHighProps {
  readonly isExpandedView?: boolean;
}

const TemperatureHigh = styled<TemperatureHighProps, "span">("span")`
  ${({ isExpandedView }) =>
    isExpandedView &&
    css`
      font-weight: bold;
    `};
`;

const TemperatureLow = styled("span")`
  font-weight: normal;
`;

export interface Props {
  readonly maxTemperature: number;
  readonly minTemperature: number;
  readonly temperature: number;
  readonly isCurrentConditions: boolean;
  readonly units?: string;
  readonly isExpandedView?: boolean;
  readonly isMobileView?: boolean;
  readonly convertUnits: (units?: string) => UnitsMetrics;
  readonly checkFieldValue: (fieldValue: any) => boolean;
}

const TemperatureContainer = (props: Props) => {
  const units = props.convertUnits(props.units);

  return (
    <I18nConsumer>
      {({ t }) => (
        <Temperature
          isExpandedView={props.isExpandedView && !props.isMobileView}
          isMobileView={props.isMobileView}
        >
          {!props.isCurrentConditions && (
            <TemperatureHigh isExpandedView={props.isExpandedView && !props.isMobileView}>
              {props.maxTemperature}
              {degreeSymbol}
              {units.temperature}
            </TemperatureHigh>
          )}
          {!props.isCurrentConditions && separator}
          {!props.isCurrentConditions && (
            <TemperatureLow>
              {props.minTemperature}
              {degreeSymbol}
              {units.temperature}
            </TemperatureLow>
          )}
          {props.isCurrentConditions && (
            <TemperatureHigh isExpandedView={props.isExpandedView && !props.isMobileView}>
              {props.temperature}
              {degreeSymbol}
              {units.temperature}
            </TemperatureHigh>
          )}
        </Temperature>
      )}
    </I18nConsumer>
  );
};

export default TemperatureContainer;
