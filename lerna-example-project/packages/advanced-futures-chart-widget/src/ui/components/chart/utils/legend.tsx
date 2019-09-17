import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import { colorPalette } from "../../../../constants";
import styled, {
  ThemeProvider,
  ThemeProp,
  StyledComponentClass,
  css,
} from "../../../../styled-components";

const LegendContainer = styled("div")`
  position: relative;
  width: 100%;
  height: auto;

  > span + span {
    margin-left: 10px;
  }
`;

const Row = styled("div")`
  margin-bottom: 15px;
`;

export const Legend = styled<{}, "span">("span")`
  position: relative;
  width: 100%;
  height: 25px;
  padding-left: 20px;
  color: #7f7f81;
  font-size: 12px;
  margin-right: 10px;

  > span {
    font-size: 50px;
    position: absolute;
    left: 0;
    top: 3px;
    display: block;
    line-height: 0;
  }
`;

export interface Props {
  readonly studies: {
    readonly sma: boolean;
    readonly rsi: boolean;
    readonly bollingerBands: boolean;
    readonly slowStochastic: boolean;
    readonly fastStochastic: boolean;
    readonly macd: boolean;
    readonly volume: boolean;
  };
  readonly interval: string;
  readonly symbol: string;
}

export interface State {}

class ChartLegend extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {};
  }

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <LegendContainer>
            <Row>
              <Legend>
                <span style={{ color: colorPalette.series[0] }}>{t("-")}</span>
                {this.props.symbol}
              </Legend>
              {this.props.studies.sma && (
                <Legend>
                  <span style={{ color: colorPalette.studies.sma4 }}>{t("-")}</span>
                  {t("common.studies.sma4")}
                </Legend>
              )}
              {this.props.studies.sma && (
                <Legend>
                  <span style={{ color: colorPalette.studies.sma9 }}>{t("-")}</span>
                  {t("common.studies.sma9")}
                </Legend>
              )}
              {this.props.studies.sma && (
                <Legend>
                  <span style={{ color: colorPalette.studies.sma18 }}>{t("-")}</span>
                  {t("common.studies.sma18")}
                </Legend>
              )}
              {this.props.studies.bollingerBands && (
                <Legend>
                  <span style={{ color: colorPalette.studies.bollingerBands.lower }}>{t("-")}</span>
                  {t("common.studies.bollingerBandsLower")}
                </Legend>
              )}
              {this.props.studies.bollingerBands && (
                <Legend>
                  <span style={{ color: colorPalette.studies.bollingerBands.middle }}>
                    {t("-")}
                  </span>
                  {t("common.studies.bollingerBandsMiddle")}
                </Legend>
              )}
              {this.props.studies.bollingerBands && (
                <Legend>
                  <span style={{ color: colorPalette.studies.bollingerBands.upper }}>{t("-")}</span>
                  {t("common.studies.bollingerBandsUpper")}
                </Legend>
              )}
            </Row>

            <Row>
              {this.props.studies.volume && (
                <Legend
                  style={{
                    paddingLeft: "12px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: colorPalette.studies.volume,
                      overflow: "hidden",
                      width: "3px",
                      height: "14px",
                      top: "-1px",
                      left: "3px",
                    }}
                  >
                    {t("|")}
                  </span>
                  {t("common.studies.volume")}
                </Legend>
              )}
              {this.props.studies.volume && !this.props.interval.includes("Mi") && (
                <Legend>
                  <span style={{ color: colorPalette.studies.openInterest }}>{t("-")}</span>
                  {t("common.studies.openInterest")}
                </Legend>
              )}
            </Row>

            <Row>
              {this.props.studies.rsi && (
                <Legend>
                  <span style={{ color: colorPalette.studies.rsi }}>{t("-")}</span>
                  {t("common.studies.rsi")}
                </Legend>
              )}
            </Row>

            <Row>
              {this.props.studies.slowStochastic && (
                <Legend>
                  <span style={{ color: colorPalette.studies.stochastic.slow.k }}>{t("-")}</span>
                  {t("common.studies.slowStochasticK")}
                </Legend>
              )}
              {this.props.studies.slowStochastic && (
                <Legend>
                  <span style={{ color: colorPalette.studies.stochastic.slow.d }}>{t("-")}</span>
                  {t("common.studies.slowStochasticD")}
                </Legend>
              )}
            </Row>

            <Row>
              {this.props.studies.fastStochastic && (
                <Legend>
                  <span style={{ color: colorPalette.studies.stochastic.fast.k }}>{t("-")}</span>
                  {t("common.studies.fastStochasticK")}
                </Legend>
              )}
              {this.props.studies.fastStochastic && (
                <Legend>
                  <span style={{ color: colorPalette.studies.stochastic.fast.d }}>{t("-")}</span>
                  {t("common.studies.fastStochasticD")}
                </Legend>
              )}
            </Row>

            <Row>
              {this.props.studies.macd && (
                <Legend
                  style={{
                    paddingLeft: "12px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: colorPalette.studies.macd.divergence,
                      overflow: "hidden",
                      width: "3px",
                      height: "14px",
                      top: "-1px",
                      left: "3px",
                    }}
                  >
                    {t("|")}
                  </span>
                  {t("common.studies.macdDivergence")}
                </Legend>
              )}
              {this.props.studies.macd && (
                <Legend>
                  <span style={{ color: colorPalette.studies.macd.macd }}>{t("-")}</span>
                  {t("common.studies.macdMacd")}
                </Legend>
              )}
              {this.props.studies.macd && (
                <Legend>
                  <span style={{ color: colorPalette.studies.macd.signal }}>{t("-")}</span>
                  {t("common.studies.macdSignal")}
                </Legend>
              )}
            </Row>
          </LegendContainer>
        )}
      </I18nConsumer>
    );
  }
}

export default ChartLegend;
