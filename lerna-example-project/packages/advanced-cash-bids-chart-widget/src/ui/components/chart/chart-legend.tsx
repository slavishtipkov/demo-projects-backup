import * as React from "react";
import styled, { css } from "../../../styled-components";
import { Consumer as I18nConsumer } from "../../../i18n";
import { CHART } from "../../../constants";

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
  text-transform: capitalize;
  margin-right: 10px;
`;

export interface Props {
  readonly isBasis3YrAvgNull?: boolean;
  readonly isCashPrice3YrAvgNull?: boolean;
  readonly showCurrentBasis: boolean;
  readonly show3YearAverageBasis: boolean;
  readonly show3YearAverageCashPrice: boolean;
}

export default class ChartLegend extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <ChartLegendContainer>
            <Row>
              <LabelItemContainer>
                <ColorLabelContainer color={CHART.CURRENT_CASH_PRICE_COLOR} />
                <LabelContainer>{`${t("chartLegend.currentCashPrice")}`}</LabelContainer>
              </LabelItemContainer>
              {!this.props.isCashPrice3YrAvgNull && this.props.show3YearAverageCashPrice && (
                <LabelItemContainer>
                  <ColorLabelContainer color={CHART.YR_CURRENT_CASH_PRICE_COLOR} />
                  <LabelContainer>{`${t("chartLegend.yrCurrentCashPrice")}`} </LabelContainer>
                </LabelItemContainer>
              )}
            </Row>

            <Row>
              {this.props.showCurrentBasis && (
                <LabelItemContainer>
                  <ColorLabelContainer color={CHART.CURRENT_BASIS_COLOR} />
                  <LabelContainer>{`${t("chartLegend.currentBasis")}`}</LabelContainer>
                </LabelItemContainer>
              )}
              {!this.props.isBasis3YrAvgNull && this.props.show3YearAverageBasis && (
                <LabelItemContainer>
                  <ColorLabelContainer color={CHART.YR_CURRENT_BASIS_COLOR} />
                  <LabelContainer>{`${t("chartLegend.yrCurrentBasis")}`}</LabelContainer>
                </LabelItemContainer>
              )}
            </Row>
          </ChartLegendContainer>
        )}
      </I18nConsumer>
    );
  }
}
