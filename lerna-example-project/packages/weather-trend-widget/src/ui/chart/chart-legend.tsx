import * as React from "react";
import styled, { css } from "../../styled-components";
import { Consumer as I18nConsumer } from "../../i18n";
import { Units } from "@dtn/i18n-lib";
import { getColorForWeatherFieldKey, getUnitKeyForWeatherField } from "./utils";

const ChartLegendContainer = styled("div")`
  margin-top: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const LabelItemContainer = styled("div")`
  display: flex;
  align-items: center;
  min-height: 25px;
  max-height: 100%;

  @media (max-width: 630px) {
    width: 50%;
  }
`;

const Row = styled("div")`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 630px) {
    width: 100%;
  }
`;

export interface ColorLabelContainerProps {
  readonly color?: string;
}

const ColorLabelContainer = styled<ColorLabelContainerProps, "p">("p")`
  width: 15px;
  height: 4px;
  margin: 0 10px;
  ${({ color }) =>
    color &&
    css`
      background: ${color};
    `};
`;

const LabelContainer = styled("div")`
  color: #59595b;
  margin-right: 10px;
`;

export interface Props {
  readonly weatherFieldKeys: ReadonlyArray<string>;
  readonly units: Units;
}

export const ChartLegend: React.SFC<Props> = props => {
  return (
    <I18nConsumer>
      {({ t }) => (
        <ChartLegendContainer>
          <Row>
            {props.weatherFieldKeys.map((s, i) => {
              let color = getColorForWeatherFieldKey(s, i);
              let unitKey = getUnitKeyForWeatherField(s);
              let label = "";
              if (s.indexOf("Depth") > -1) {
                label = `${parseInt(s)} `;
              }
              return (
                <LabelItemContainer key={s}>
                  <ColorLabelContainer color={color} />
                  <LabelContainer>
                    {label}
                    {t(`units.${unitKey}`, { context: props.units })}
                    {/* tslint:disable-next-line */}
                    {" depth"}
                  </LabelContainer>
                </LabelItemContainer>
              );
            })}
          </Row>
        </ChartLegendContainer>
      )}
    </I18nConsumer>
  );
};

export default ChartLegend;
