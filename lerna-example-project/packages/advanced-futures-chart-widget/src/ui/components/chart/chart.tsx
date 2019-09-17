import * as React from "react";
import * as ReactDOM from "react-dom";
import { format } from "d3-format";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import styled, { css } from "../../../styled-components";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
  LineSeries,
  CandlestickSeries,
  OHLCSeries,
  RSISeries,
  StochasticSeries,
  MACDSeries,
  BarSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateY,
  CurrentCoordinate,
} from "react-stockcharts/lib/coordinates";
import {
  HoverTooltip,
  BollingerBandTooltip,
  MovingAverageTooltip,
} from "react-stockcharts/lib/tooltip";
import {
  bollingerBand,
  rsi,
  sma,
  stochasticOscillator,
  macd,
} from "react-stockcharts/lib/indicator";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { fitWidth } from "react-stockcharts/lib/helper";
import * as moment from "moment-timezone";
import { HistoricPrice } from "../../../interfaces";
import {
  colorPalette,
  INIT_CHART_HEIGHT,
  CHART_INIT_HEIGHT,
  Y_AXIS_START_POINT,
  CHART_STUDIES_HEIGHT,
  CHART,
  STUDY_HEIGHT,
} from "../../../constants";
import StudyBollingerBands from "./studies/bollinger-bands";
import { ChangeYAxisState } from "../../../store";
import {
  backgroundChartShapeSVG,
  tooltipChartSVG,
  tooltipChartContent,
  tooltipVolumeContent,
  backgroundVolumeShapeSVG,
  tooltipMACDContent,
  tooltipMACDSVG,
  backgroundMACDShapeSVG,
  tooltipFastStoContent,
  tooltipSlowStoContent,
  tooltipRSIContent,
  backgroundStudyShapeSVG,
  tooltipStudySVG,
} from "./utils/tooltips";
import { generateId, getRandomLength } from "../../../store/utils";
import { studiesDataSubject } from "./utils/service";

export interface Props {
  readonly type: string;
  readonly data: ReadonlyArray<HistoricPrice>;
  readonly width: number;
  readonly widgetWidth: number;
  readonly ratio: number;
  readonly symbol?: string;
  readonly chartType: string;
  readonly interval: string;
  readonly studies: {
    readonly sma: boolean;
    readonly rsi: boolean;
    readonly bollingerBands: boolean;
    readonly slowStochastic: boolean;
    readonly fastStochastic: boolean;
    readonly macd: boolean;
    readonly volume: boolean;
  };
  readonly yAxisState: ReadonlyArray<{
    readonly isDrawn: boolean;
    readonly study: string;
  }>;
  readonly changeYAxisState: (
    yAxisState: ReadonlyArray<{
      readonly isDrawn: boolean;
      readonly study: string;
    }>,
  ) => ChangeYAxisState;
}

const ChartContainer = styled("div")`
  position: relative;
  width: 100%;
  height: auto;
`;

export interface SubChartContainerProps {
  readonly height: number;
  readonly width: string | null;
  readonly rightMargin: number;
  readonly container: string;
  readonly initialLoad: boolean;
  readonly offset: number;
  readonly hasError: boolean;
}

const BorderChartContainer = styled<SubChartContainerProps, "div">("div")`
  position: absolute;
  left: 10px;
  top: ${({ height, container, offset }) =>
    container === "base"
      ? "20px"
      : `calc((${height}px + ${offset}px - ${CHART.SUB_CHART_HEIGHT}px))`};
  height: ${({ height, container }) =>
    container === "base" ? `calc((${height}px - 20px))` : `${CHART.SUB_CHART_HEIGHT}px`};
  width: ${({ rightMargin, width, initialLoad }) =>
    initialLoad ? `calc(${width}px - ${rightMargin}px + 10px)` : `${width}px`};

  ${({ hasError }) =>
    hasError &&
    css`
      background-color: rgba(230, 230, 230, 0.6);
    `};
`;

const Label = styled("div")`
  color: #59595b;
  opacity: 0.6;
  font-size: 12px;
  margin: 3px 0 0 5px;
`;

const StudyError = styled("div")`
  color: #59595b;
  opacity: 0.6;
  font-size: 12px;
  margin: 3px 0 0 5px;
  font-size: 19px;
  text-align: center;
  padding: 5px;
`;

export interface State {
  readonly xAxisWidth: string | null;
  readonly initialLoad: boolean;
  readonly rightMargin: number;
  readonly height: number;
  readonly studies: {
    readonly sma: boolean;
    readonly rsi: boolean;
    readonly bollingerBands: boolean;
    readonly slowStochastic: boolean;
    readonly fastStochastic: boolean;
    readonly macd: boolean;
    readonly volume: boolean;
  };
}

class ChartBase extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      xAxisWidth: null,
      rightMargin: 10,
      initialLoad: false,
      height: INIT_CHART_HEIGHT,
      studies: {
        sma: false,
        rsi: false,
        bollingerBands: false,
        slowStochastic: false,
        fastStochastic: false,
        macd: false,
        volume: false,
      },
    };
  }

  private yAxisRef: any;
  private xAxisRef: any;
  private hasStudiesData: {
    readonly sma: boolean;
    readonly rsi: boolean;
    readonly bollingerBands: boolean;
    readonly slowStochastic: boolean;
    readonly fastStochastic: boolean;
    readonly macd: boolean;
    readonly volume: boolean;
    readonly [key: string]: boolean;
  } = {
    sma: false,
    rsi: false,
    bollingerBands: false,
    slowStochastic: false,
    fastStochastic: false,
    macd: false,
    volume: false,
  };

  componentDidMount(): void {
    const yAxisNode: any = ReactDOM.findDOMNode(this.yAxisRef);
    if (yAxisNode) {
      this.setState({
        rightMargin: this.calculateRightMargin(
          yAxisNode.childNodes[0].getBoundingClientRect().width,
        ),
      });
    }

    window.addEventListener("resize", this.updateWindowDimensions);
    this.updateWindowDimensions();
    this.setState({ initialLoad: true });
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (JSON.stringify(nextProps.studies) !== JSON.stringify(this.props.studies)) {
      const newYAxisState: ReadonlyArray<{
        readonly isDrawn: boolean;
        readonly study: string;
      }> = [
        { study: "volume", isDrawn: nextProps.studies.volume },
        { study: "rsi", isDrawn: nextProps.studies.rsi },
        { study: "slowStochastic", isDrawn: nextProps.studies.slowStochastic },
        { study: "fastStochastic", isDrawn: nextProps.studies.fastStochastic },
        { study: "macd", isDrawn: nextProps.studies.macd },
      ];
      this.props.changeYAxisState(newYAxisState);

      const yAxisNode: any = ReactDOM.findDOMNode(this.yAxisRef);
      if (yAxisNode) {
        this.setState({
          rightMargin: this.calculateRightMargin(
            yAxisNode.childNodes[0].getBoundingClientRect().width,
          ),
        });
      }
      this.updateWindowDimensions();
      this.setState({ initialLoad: false });
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    const xAxisNode: any = ReactDOM.findDOMNode(this.xAxisRef);
    if (xAxisNode) {
      this.setState({
        xAxisWidth: xAxisNode.childNodes[0].getBoundingClientRect().width,
      });
    }
  };

  render(): JSX.Element {
    const { type, data: initialData, width, ratio } = this.props;

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d: HistoricPrice) =>
      moment(d.date).toDate(),
    );

    const calculatedData = this.calculateChartData(initialData);

    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData);

    const selectedStudies = this.props.yAxisState.filter(y => y.isDrawn);
    const lastAxis =
      selectedStudies.length !== 0 ? selectedStudies[selectedStudies.length - 1].study : "initial";

    const showGrid = true;
    const offset = this.calculateOffset();
    const margin = { left: 10, right: this.state.rightMargin, top: 20, bottom: 30 };
    const gridWidth = width - margin.left - margin.right;
    const yGrid = showGrid
      ? {
          innerTickSize: -1 * gridWidth,
          tickStrokeDasharray: "Solid",
          tickStrokeOpacity: 0.2,
          tickStrokeWidth: 1,
        }
      : {};

    const sma4 = sma()
      .options({ windowSize: 4 })
      .merge((d: HistoricPrice, c: number) => {
        const s = { ...d };
        s.sma4 = c;
        return s;
      })
      .accessor((d: HistoricPrice) => d.sma4)
      .stroke("#F6A01A");

    const sma9 = sma()
      .options({ windowSize: 9 })
      .merge((d: HistoricPrice, c: number) => {
        const s = { ...d };
        s.sma9 = c;
        return s;
      })
      .accessor((d: HistoricPrice) => d.sma9)
      .stroke("#003764");

    const sma18 = sma()
      .options({ windowSize: 18 })
      .merge((d: HistoricPrice, c: number) => {
        const s = { ...d };
        s.sma18 = c;
        return s;
      })
      .accessor((d: HistoricPrice) => d.sma18)
      .stroke("#00B259");

    const stoAppearance = {
      stroke: {
        top: colorPalette.grid,
        middle: colorPalette.grid,
        bottom: colorPalette.grid,
        dLine: colorPalette.studies.stochastic.slow.d,
        kLine: colorPalette.studies.stochastic.slow.k,
      },
    };

    const macdAppearance = {
      stroke: {
        macd: colorPalette.studies.macd.macd,
        signal: colorPalette.studies.macd.signal,
      },
      fill: {
        divergence: colorPalette.grid,
      },
    };

    const macdCalculator = macd()
      .options({
        fast: 12,
        slow: 26,
        signal: 9,
      })
      .merge(
        (
          d: HistoricPrice,
          c: {
            readonly macd?: number | string;
            readonly signal?: number | string;
            readonly divergence?: number | string;
          },
        ) => {
          const s = { ...d };
          s.macd = c;
          return s;
        },
      )
      .accessor((d: HistoricPrice) => d.macd);

    const bb = bollingerBand()
      .merge(
        (
          d: HistoricPrice,
          c: {
            readonly top: number;
            readonly middle: number;
            readonly bottom: number;
          },
        ) => {
          const s = { ...d };
          s.bb = c;
          return s;
        },
      )
      .accessor((d: HistoricPrice) => d.bb);
    const baseChartId = generateId(getRandomLength());

    return (
      <I18nConsumer>
        {({ t }) => (
          <ChartContainer>
            <BorderChartContainer
              height={Y_AXIS_START_POINT[1]}
              width={this.state.xAxisWidth}
              rightMargin={this.state.rightMargin}
              container={"base"}
              initialLoad={this.state.initialLoad}
              offset={offset}
              hasError={false}
            />
            {selectedStudies.length >= 1 && (
              <BorderChartContainer
                height={this.calculateBorderContainerHeight(selectedStudies, 1)}
                width={this.state.xAxisWidth}
                rightMargin={this.state.rightMargin}
                container={"sub"}
                initialLoad={this.state.initialLoad}
                offset={offset}
                hasError={!this.hasStudiesData[selectedStudies[0].study]}
              >
                {selectedStudies[0] && this.hasStudiesData[selectedStudies[0].study] && (
                  <Label>{this.getStudyLabelName(selectedStudies, 1)}</Label>
                )}
                {selectedStudies[0] && !this.hasStudiesData[selectedStudies[0].study] && (
                  <div>
                    <Label>{this.getStudyLabelName(selectedStudies, 1)}</Label>
                    <StudyError>
                      {`${this.getStudyLabelName(selectedStudies, 1)} `}
                      {t("errors.noDataAvailable")}
                    </StudyError>
                  </div>
                )}
              </BorderChartContainer>
            )}
            {selectedStudies.length >= 2 && (
              <BorderChartContainer
                height={this.calculateBorderContainerHeight(selectedStudies, 2)}
                width={this.state.xAxisWidth}
                rightMargin={this.state.rightMargin}
                container={"sub"}
                initialLoad={this.state.initialLoad}
                offset={offset}
                hasError={!this.hasStudiesData[selectedStudies[1].study]}
              >
                {selectedStudies[1] && this.hasStudiesData[selectedStudies[1].study] && (
                  <Label>{this.getStudyLabelName(selectedStudies, 2)}</Label>
                )}
                {selectedStudies[1] && !this.hasStudiesData[selectedStudies[1].study] && (
                  <div>
                    <Label>{this.getStudyLabelName(selectedStudies, 2)}</Label>
                    <StudyError>
                      {`${this.getStudyLabelName(selectedStudies, 2)} `}
                      {t("errors.noDataAvailable")}
                    </StudyError>
                  </div>
                )}
              </BorderChartContainer>
            )}
            {selectedStudies.length >= 3 && (
              <BorderChartContainer
                height={this.calculateBorderContainerHeight(selectedStudies, 3)}
                width={this.state.xAxisWidth}
                rightMargin={this.state.rightMargin}
                container={"sub"}
                initialLoad={this.state.initialLoad}
                offset={offset}
                hasError={!this.hasStudiesData[selectedStudies[2].study]}
              >
                {selectedStudies[2] && this.hasStudiesData[selectedStudies[2].study] && (
                  <Label>{this.getStudyLabelName(selectedStudies, 3)}</Label>
                )}
                {selectedStudies[2] && !this.hasStudiesData[selectedStudies[2].study] && (
                  <div>
                    <Label>{this.getStudyLabelName(selectedStudies, 3)}</Label>
                    <StudyError>
                      {`${this.getStudyLabelName(selectedStudies, 3)} `}
                      {t("errors.noDataAvailable")}
                    </StudyError>
                  </div>
                )}
              </BorderChartContainer>
            )}
            {selectedStudies.length >= 4 && (
              <BorderChartContainer
                height={this.calculateBorderContainerHeight(selectedStudies, 4)}
                width={this.state.xAxisWidth}
                rightMargin={this.state.rightMargin}
                container={"sub"}
                initialLoad={this.state.initialLoad}
                offset={offset}
                hasError={!this.hasStudiesData[selectedStudies[3].study]}
              >
                {selectedStudies[3] && this.hasStudiesData[selectedStudies[3].study] && (
                  <Label>{this.getStudyLabelName(selectedStudies, 4)}</Label>
                )}
                {selectedStudies[3] && !this.hasStudiesData[selectedStudies[3].study] && (
                  <div>
                    <Label>{this.getStudyLabelName(selectedStudies, 4)}</Label>
                    <StudyError>
                      {`${this.getStudyLabelName(selectedStudies, 4)} `}
                      {t("errors.noDataAvailable")}
                    </StudyError>
                  </div>
                )}
              </BorderChartContainer>
            )}
            {selectedStudies.length >= 5 && (
              <BorderChartContainer
                height={this.calculateBorderContainerHeight(selectedStudies, 5)}
                width={this.state.xAxisWidth}
                rightMargin={this.state.rightMargin}
                container={"sub"}
                initialLoad={this.state.initialLoad}
                offset={offset}
                hasError={!this.hasStudiesData[selectedStudies[4].study]}
              >
                {selectedStudies[4] && this.hasStudiesData[selectedStudies[4].study] && (
                  <Label>{this.getStudyLabelName(selectedStudies, 5)}</Label>
                )}
                {selectedStudies[4] && !this.hasStudiesData[selectedStudies[4].study] && (
                  <div>
                    <Label>{this.getStudyLabelName(selectedStudies, 5)}</Label>
                    <StudyError>
                      {`${this.getStudyLabelName(selectedStudies, 5)} `}
                      {t("errors.noDataAvailable")}
                    </StudyError>
                  </div>
                )}
              </BorderChartContainer>
            )}

            <ChartCanvas
              height={INIT_CHART_HEIGHT + offset}
              width={width}
              ratio={ratio}
              margin={{ left: 10, right: this.state.rightMargin, top: 20 + offset, bottom: 30 }}
              type={type}
              seriesName={baseChartId}
              data={data}
              xScale={xScale}
              xAccessor={xAccessor}
              displayXAccessor={displayXAccessor}
              panEvent={false}
              zoomEvent={false}
              maintainPointsPerPixelOnResize={false}
            >
              <Chart
                id={`${baseChartId}-${generateId(getRandomLength())}`}
                height={CHART_INIT_HEIGHT}
                yExtents={[(d: HistoricPrice) => [d.high, d.low]]}
              >
                {lastAxis === "initial" && (
                  <XAxis
                    axisAt="bottom"
                    orient="bottom"
                    stroke={CHART.BORDER_COLOR}
                    tickStroke={CHART.AXIS_VALUES_COLOR}
                    ticks={this.calculateXAxisTicks()}
                    tickStrokeOpacity={0}
                    ref={(ref: any) => (this.xAxisRef = ref)}
                  />
                )}
                <YAxis
                  axisAt="right"
                  orient="right"
                  stroke={CHART.BORDER_COLOR}
                  tickStroke={CHART.AXIS_VALUES_COLOR}
                  // tslint:disable-next-line:jsx-no-lambda
                  tickFormat={(d: number) => this.formatAxisNumbers(d)}
                  ticks={10}
                  // tslint:disable-next-line:jsx-no-lambda
                  ref={(ref: any) => (this.yAxisRef = ref)}
                  {...yGrid}
                />
                {this.props.studies.bollingerBands && <StudyBollingerBands />}
                {this.props.studies.bollingerBands && (
                  <CurrentCoordinate
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={(d: HistoricPrice) => (d.bb ? d.bb.top : "")}
                    fill={colorPalette.studies.bollingerBands.upper}
                    r={3}
                  />
                )}
                {this.props.studies.bollingerBands && (
                  <CurrentCoordinate
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={(d: HistoricPrice) => (d.bb ? d.bb.middle : "")}
                    fill={colorPalette.studies.bollingerBands.middle}
                    r={3}
                  />
                )}
                {this.props.studies.bollingerBands && (
                  <CurrentCoordinate
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={(d: HistoricPrice) => (d.bb ? d.bb.bottom : "")}
                    fill={colorPalette.studies.bollingerBands.lower}
                    r={3}
                  />
                )}
                {this.props.studies.bollingerBands && (
                  <BollingerBandTooltip
                    origin={[5, -5]}
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={(d: HistoricPrice) => d.bb}
                    // tslint:disable-next-line:jsx-no-lambda
                    options={bb.options()}
                    textFill={CHART.AXIS_VALUES_COLOR}
                  />
                )}

                {this.props.studies.sma && (
                  <LineSeries
                    yAccessor={sma4.accessor()}
                    stroke={colorPalette.studies.sma4}
                    strokeWidth={2}
                  />
                )}
                {this.props.studies.sma && (
                  <LineSeries
                    yAccessor={sma9.accessor()}
                    stroke={colorPalette.studies.sma9}
                    strokeWidth={2}
                  />
                )}
                {this.props.studies.sma && (
                  <LineSeries
                    yAccessor={sma18.accessor()}
                    stroke={colorPalette.studies.sma18}
                    strokeWidth={2}
                  />
                )}
                {this.props.studies.sma && (
                  <CurrentCoordinate
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={sma18.accessor()}
                    fill={colorPalette.studies.sma18}
                    r={3}
                  />
                )}
                {this.props.studies.sma && (
                  <CurrentCoordinate
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={sma4.accessor()}
                    fill={colorPalette.studies.sma4}
                    r={3}
                  />
                )}
                {this.props.studies.sma && (
                  <CurrentCoordinate
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={sma9.accessor()}
                    fill={colorPalette.studies.sma9}
                    r={3}
                  />
                )}

                {this.props.studies.sma && (
                  <MovingAverageTooltip
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => null}
                    origin={this.props.studies.bollingerBands ? [5, -50] : [5, -35]}
                    textFill={CHART.AXIS_VALUES_COLOR}
                    options={[
                      {
                        yAccessor: sma4.accessor(),
                        type: sma4.type(),
                        stroke: sma4.stroke(),
                        windowSize: sma4.options().windowSize,
                      },
                      {
                        yAccessor: sma9.accessor(),
                        type: sma9.type(),
                        stroke: sma9.stroke(),
                        windowSize: sma9.options().windowSize,
                      },
                      {
                        yAccessor: sma18.accessor(),
                        type: sma18.type(),
                        stroke: sma18.stroke(),
                        windowSize: sma18.options().windowSize,
                      },
                    ]}
                  />
                )}

                {this.renderChartSeries()}
                <EdgeIndicator
                  itemType="last"
                  orient="right"
                  edgeAt="right"
                  // tslint:disable-next-line:jsx-no-lambda
                  yAccessor={(d: HistoricPrice) => d.close}
                  // tslint:disable-next-line:jsx-no-lambda
                  fill={(d: HistoricPrice) => this.getIndicatorColor(d, "close")}
                  // tslint:disable-next-line:jsx-no-lambda
                  displayFormat={(d: number) => this.formatAxisNumbers(d)}
                  fontSize={CHART.INDICATORS_FONT_SIZE}
                  yAxisPad={-1}
                />
                <MouseCoordinateY
                  at="right"
                  orient="right"
                  // tslint:disable-next-line:jsx-no-lambda
                  displayFormat={(d: number) => this.formatAxisNumbers(d)}
                  fontSize={CHART.INDICATORS_FONT_SIZE}
                />
                <CrossHairCursor />
                {this.props.chartType === "line" && (
                  <CurrentCoordinate
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={(d: HistoricPrice) => d.close}
                    fill={colorPalette.series[0]}
                    r={4}
                  />
                )}

                <HoverTooltip
                  // tslint:disable-next-line:jsx-no-lambda
                  yAccessor={(d: HistoricPrice) => d.close}
                  fill="#f8f8f8"
                  bgFill="#f8f8f8"
                  opacity={0.9}
                  stroke="rgba(90,90,90,0.3)"
                  fontFill="#474747"
                  fontFamily="Arial, Helvetica Neue, Helvetica, sans-serif"
                  backgroundShapeSVG={backgroundChartShapeSVG}
                  tooltipSVG={tooltipChartSVG}
                  tooltipContent={tooltipChartContent(
                    [],
                    this.props.interval,
                    this.props.data,
                    this.props.symbol,
                  )}
                  fontSize={11}
                />
              </Chart>
            </ChartCanvas>

            {this.props.studies.volume && (
              <ChartCanvas
                height={STUDY_HEIGHT}
                width={width}
                ratio={ratio}
                margin={margin}
                type={type}
                seriesName={`Volume-${baseChartId}`}
                data={data}
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                panEvent={false}
                zoomEvent={false}
                padding={10}
                maintainPointsPerPixelOnResize={false}
              >
                <Chart
                  id={`${baseChartId}-${generateId(getRandomLength())}`}
                  // tslint:disable-next-line:jsx-no-lambda
                  yExtents={(d: HistoricPrice) => d.volume}
                  height={CHART_STUDIES_HEIGHT}
                  origin={[0, 0]}
                >
                  {lastAxis === "volume" && (
                    <XAxis
                      axisAt="bottom"
                      orient="bottom"
                      stroke={CHART.BORDER_COLOR}
                      tickStroke={CHART.AXIS_VALUES_COLOR}
                      ticks={this.calculateXAxisTicks()}
                      tickStrokeOpacity={0}
                      ref={(ref: any) => (this.xAxisRef = ref)}
                    />
                  )}
                  <YAxis
                    axisAt="right"
                    orient="right"
                    stroke={CHART.BORDER_COLOR}
                    tickStroke={CHART.AXIS_VALUES_COLOR}
                    // tslint:disable-next-line:jsx-no-lambda
                    tickFormat={(d: number) => this.formatAxisNumbers(d)}
                    ticks={5}
                    // tslint:disable-next-line:jsx-no-lambda
                    ref={(ref: any) => (this.yAxisRef = ref)}
                    {...yGrid}
                  />
                  {this.hasStudiesData.volume && (
                    <MouseCoordinateY
                      at="right"
                      orient="right"
                      // tslint:disable-next-line:jsx-no-lambda
                      displayFormat={(d: number) => this.formatAxisNumbers(d)}
                      // tslint:disable-next-line:jsx-no-lambda
                      fontSize={CHART.INDICATORS_FONT_SIZE}
                    />
                  )}
                  {this.hasStudiesData.volume && (
                    <BarSeries
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.volume}
                      fill={colorPalette.studies.volume}
                    />
                  )}
                  {!this.props.interval.includes("Mi") && this.hasStudiesData.volume && (
                    <LineSeries
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.oi}
                      stroke={colorPalette.studies.openInterest}
                      strokeWidth={3}
                    />
                  )}

                  {!this.props.interval.includes("Mi") && this.hasStudiesData.volume && (
                    <CurrentCoordinate
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.oi}
                      fill={colorPalette.studies.openInterest}
                      r={3}
                    />
                  )}

                  {this.hasStudiesData.volume && <CrossHairCursor />}
                </Chart>
                {this.hasStudiesData.volume && (
                  <HoverTooltip
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={(d: HistoricPrice) => d.close}
                    fill="#f8f8f8"
                    bgFill="#f8f8f8"
                    opacity={0.9}
                    stroke="rgba(90,90,90,0.3)"
                    fontFill="#474747"
                    fontFamily="Arial, Helvetica Neue, Helvetica, sans-serif"
                    backgroundShapeSVG={backgroundVolumeShapeSVG}
                    tooltipSVG={tooltipStudySVG}
                    tooltipContent={tooltipVolumeContent(
                      [],
                      this.props.interval,
                      this.props.data,
                      this.props.symbol,
                    )}
                    fontSize={11}
                  />
                )}
              </ChartCanvas>
            )}

            {this.props.studies.rsi && (
              <ChartCanvas
                height={STUDY_HEIGHT}
                width={width}
                ratio={ratio}
                margin={margin}
                type={type}
                seriesName={`Rsi-${baseChartId}`}
                data={data}
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                panEvent={false}
                zoomEvent={false}
                padding={10}
                maintainPointsPerPixelOnResize={false}
              >
                <Chart
                  id={`${baseChartId}-${generateId(getRandomLength())}`}
                  yExtents={[0, 100]}
                  height={CHART_STUDIES_HEIGHT}
                  origin={[0, 0]}
                >
                  {lastAxis === "rsi" && (
                    <XAxis
                      axisAt="bottom"
                      orient="bottom"
                      stroke={CHART.BORDER_COLOR}
                      tickStroke={CHART.AXIS_VALUES_COLOR}
                      ticks={this.calculateXAxisTicks()}
                      tickStrokeOpacity={0}
                      ref={(ref: any) => (this.xAxisRef = ref)}
                    />
                  )}
                  <YAxis
                    axisAt="right"
                    orient="right"
                    stroke={CHART.BORDER_COLOR}
                    tickStroke={CHART.AXIS_VALUES_COLOR}
                    // tslint:disable-next-line:jsx-no-lambda
                    tickFormat={(d: number) => this.formatAxisNumbers(d)}
                    ticks={5}
                    // tslint:disable-next-line:jsx-no-lambda
                    ref={(ref: any) => (this.yAxisRef = ref)}
                    {...yGrid}
                  />
                  {this.hasStudiesData.rsi && (
                    <MouseCoordinateY
                      at="right"
                      orient="right"
                      // tslint:disable-next-line:jsx-no-lambda
                      displayFormat={(d: number) => this.formatAxisNumbers(d)}
                      fontSize={CHART.INDICATORS_FONT_SIZE}
                    />
                  )}
                  {this.hasStudiesData.rsi && (
                    <RSISeries
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.rsi}
                      stroke={{
                        top: colorPalette.axis,
                        middle: colorPalette.axis,
                        bottom: colorPalette.axis,
                        outsideThreshold: colorPalette.studies.rsi,
                        insideThreshold: colorPalette.studies.rsi,
                        line: colorPalette.studies.rsi,
                      }}
                      strokeWidth={{
                        top: 0,
                        middle: 0,
                        bottom: 0,
                        outsideThreshold: 3,
                        insideThreshold: 3,
                        line: 3,
                      }}
                    />
                  )}
                  {this.hasStudiesData.rsi && (
                    <CurrentCoordinate
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.rsi}
                      fill={colorPalette.studies.rsi}
                      r={5}
                    />
                  )}
                  {this.hasStudiesData.rsi && <CrossHairCursor />}
                </Chart>
                {this.hasStudiesData.rsi && (
                  <HoverTooltip
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={(d: HistoricPrice) => d.close}
                    fill="#f8f8f8"
                    bgFill="#f8f8f8"
                    opacity={0.9}
                    stroke="rgba(90,90,90,0.3)"
                    fontFill="#474747"
                    fontFamily="Arial, Helvetica Neue, Helvetica, sans-serif"
                    backgroundShapeSVG={backgroundStudyShapeSVG}
                    tooltipSVG={tooltipChartSVG}
                    tooltipContent={tooltipRSIContent(
                      [],
                      this.props.interval,
                      this.props.data,
                      this.props.symbol,
                    )}
                    fontSize={11}
                  />
                )}
              </ChartCanvas>
            )}

            {this.props.studies.slowStochastic && (
              <ChartCanvas
                height={STUDY_HEIGHT + 20}
                margin={{ left: 10, right: this.state.rightMargin, top: 20, bottom: 50 }}
                width={width}
                ratio={ratio}
                type={type}
                seriesName={`SlowStochastic-${baseChartId}`}
                data={data}
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                panEvent={false}
                zoomEvent={false}
                padding={10}
                maintainPointsPerPixelOnResize={false}
              >
                <Chart
                  id={`${baseChartId}-${generateId(getRandomLength())}`}
                  yExtents={[0, 100]}
                  padding={{ top: 10, bottom: 10 }}
                  height={CHART_STUDIES_HEIGHT}
                  origin={[0, 0]}
                >
                  {lastAxis === "slowStochastic" && (
                    <XAxis
                      axisAt="bottom"
                      orient="bottom"
                      stroke={CHART.BORDER_COLOR}
                      tickStroke={CHART.AXIS_VALUES_COLOR}
                      ticks={this.calculateXAxisTicks()}
                      tickStrokeOpacity={0}
                      ref={(ref: any) => (this.xAxisRef = ref)}
                    />
                  )}
                  <YAxis
                    tickValues={[20, 50, 80]}
                    axisAt="right"
                    orient="right"
                    stroke={CHART.BORDER_COLOR}
                    tickStroke={CHART.AXIS_VALUES_COLOR}
                    // tslint:disable-next-line:jsx-no-lambda
                    tickFormat={(d: number) => this.formatAxisNumbers(d)}
                    ticks={10}
                    // tslint:disable-next-line:jsx-no-lambda
                    ref={(ref: any) => (this.yAxisRef = ref)}
                    {...yGrid}
                  />
                  {this.hasStudiesData.slowStochastic && (
                    <MouseCoordinateY
                      at="right"
                      orient="right"
                      // tslint:disable-next-line:jsx-no-lambda
                      displayFormat={(d: number) => this.formatAxisNumbers(d)}
                      fontSize={CHART.INDICATORS_FONT_SIZE}
                    />
                  )}

                  {this.hasStudiesData.slowStochastic && (
                    <StochasticSeries
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.fastSTO}
                      {...stoAppearance}
                    />
                  )}
                  {this.hasStudiesData.slowStochastic && <CrossHairCursor />}
                  {this.hasStudiesData.slowStochastic && (
                    <CurrentCoordinate
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.fastSTO.D}
                      fill={colorPalette.studies.stochastic.slow.d}
                      r={3}
                    />
                  )}
                  {this.hasStudiesData.slowStochastic && (
                    <CurrentCoordinate
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.fastSTO.K}
                      fill={colorPalette.studies.stochastic.slow.k}
                      r={3}
                    />
                  )}
                </Chart>
                {this.hasStudiesData.slowStochastic && (
                  <HoverTooltip
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={(d: HistoricPrice) => d.close}
                    fill="#f8f8f8"
                    bgFill="#f8f8f8"
                    opacity={0.9}
                    stroke="rgba(90,90,90,0.3)"
                    fontFill="#474747"
                    fontFamily="Arial, Helvetica Neue, Helvetica, sans-serif"
                    backgroundShapeSVG={backgroundStudyShapeSVG}
                    tooltipSVG={tooltipStudySVG}
                    tooltipContent={tooltipSlowStoContent(
                      [],
                      this.props.interval,
                      this.props.data,
                      this.props.symbol,
                    )}
                    fontSize={11}
                  />
                )}
              </ChartCanvas>
            )}

            {this.props.studies.fastStochastic && (
              <ChartCanvas
                height={STUDY_HEIGHT + 10}
                margin={{ left: 10, right: this.state.rightMargin, top: 20, bottom: 40 }}
                width={width}
                ratio={ratio}
                type={type}
                seriesName={`FastStochastic-${baseChartId}`}
                data={data}
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                panEvent={false}
                zoomEvent={false}
                padding={10}
                maintainPointsPerPixelOnResize={false}
              >
                <Chart
                  id={`${baseChartId}-${generateId(getRandomLength())}`}
                  yExtents={[0, 100]}
                  height={CHART_STUDIES_HEIGHT}
                  padding={{ top: 10, bottom: 10 }}
                  origin={[0, 0]}
                >
                  {lastAxis === "fastStochastic" && (
                    <XAxis
                      axisAt="bottom"
                      orient="bottom"
                      stroke={CHART.BORDER_COLOR}
                      tickStroke={CHART.AXIS_VALUES_COLOR}
                      ticks={this.calculateXAxisTicks()}
                      tickStrokeOpacity={0}
                      ref={(ref: any) => (this.xAxisRef = ref)}
                    />
                  )}
                  <YAxis
                    tickValues={[20, 50, 80]}
                    axisAt="right"
                    orient="right"
                    stroke={CHART.BORDER_COLOR}
                    tickStroke={CHART.AXIS_VALUES_COLOR}
                    // tslint:disable-next-line:jsx-no-lambda
                    tickFormat={(d: number) => this.formatAxisNumbers(d)}
                    ticks={10}
                    // tslint:disable-next-line:jsx-no-lambda
                    ref={(ref: any) => (this.yAxisRef = ref)}
                    {...yGrid}
                  />
                  {this.hasStudiesData.fastStochastic && (
                    <MouseCoordinateY
                      at="right"
                      orient="right"
                      // tslint:disable-next-line:jsx-no-lambda
                      displayFormat={(d: number) => this.formatAxisNumbers(d)}
                      fontSize={CHART.INDICATORS_FONT_SIZE}
                    />
                  )}

                  {this.hasStudiesData.fastStochastic && (
                    <StochasticSeries
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.slowSTO}
                      {...stoAppearance}
                    />
                  )}
                  {this.hasStudiesData.fastStochastic && <CrossHairCursor />}
                  {this.hasStudiesData.fastStochastic && (
                    <CurrentCoordinate
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.slowSTO.D}
                      fill={colorPalette.studies.stochastic.slow.d}
                      r={3}
                    />
                  )}
                  {this.hasStudiesData.fastStochastic && (
                    <CurrentCoordinate
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.slowSTO.K}
                      fill={colorPalette.studies.stochastic.slow.k}
                      r={3}
                    />
                  )}
                </Chart>
                {this.hasStudiesData.fastStochastic && (
                  <HoverTooltip
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={(d: HistoricPrice) => d.close}
                    fill="#f8f8f8"
                    bgFill="#f8f8f8"
                    opacity={0.9}
                    stroke="rgba(90,90,90,0.3)"
                    fontFill="#474747"
                    fontFamily="Arial, Helvetica Neue, Helvetica, sans-serif"
                    backgroundShapeSVG={backgroundStudyShapeSVG}
                    tooltipSVG={tooltipStudySVG}
                    tooltipContent={tooltipFastStoContent(
                      [],
                      this.props.interval,
                      this.props.data,
                      this.props.symbol,
                    )}
                    fontSize={11}
                  />
                )}
              </ChartCanvas>
            )}

            {this.props.studies.macd && (
              <ChartCanvas
                height={STUDY_HEIGHT + 40}
                width={width}
                ratio={ratio}
                margin={{ left: 10, right: this.state.rightMargin, top: 20, bottom: 70 }}
                type={type}
                seriesName={`Macd-${baseChartId}`}
                data={data}
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                panEvent={false}
                zoomEvent={false}
                maintainPointsPerPixelOnResize={false}
              >
                <Chart
                  id={`${baseChartId}-${generateId(getRandomLength())}`}
                  yExtents={macdCalculator.accessor()}
                  height={CHART_STUDIES_HEIGHT}
                  origin={[0, 0]}
                >
                  {lastAxis === "macd" && (
                    <XAxis
                      axisAt="bottom"
                      orient="bottom"
                      stroke={CHART.BORDER_COLOR}
                      tickStroke={CHART.AXIS_VALUES_COLOR}
                      ticks={this.calculateXAxisTicks()}
                      tickStrokeOpacity={0}
                      ref={(ref: any) => (this.xAxisRef = ref)}
                    />
                  )}
                  <YAxis
                    axisAt="right"
                    orient="right"
                    stroke={CHART.BORDER_COLOR}
                    tickStroke={CHART.AXIS_VALUES_COLOR}
                    // tslint:disable-next-line:jsx-no-lambda
                    tickFormat={(d: number) => this.formatAxisNumbers(d)}
                    ticks={2}
                    // tslint:disable-next-line:jsx-no-lambda
                    ref={(ref: any) => (this.yAxisRef = ref)}
                    {...yGrid}
                  />
                  {this.hasStudiesData.macd && (
                    <MouseCoordinateY
                      at="right"
                      orient="right"
                      // tslint:disable-next-line:jsx-no-lambda
                      displayFormat={(d: number) => this.formatAxisNumbers(d)}
                      fontSize={CHART.INDICATORS_FONT_SIZE}
                    />
                  )}

                  {this.hasStudiesData.macd && (
                    <MACDSeries
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.macd}
                      {...macdAppearance}
                    />
                  )}
                  {this.hasStudiesData.macd && <CrossHairCursor />}
                  {this.hasStudiesData.macd && (
                    <CurrentCoordinate
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.macd.macd}
                      fill={colorPalette.studies.macd.macd}
                      r={3}
                    />
                  )}
                  {this.hasStudiesData.macd && (
                    <CurrentCoordinate
                      // tslint:disable-next-line:jsx-no-lambda
                      yAccessor={(d: HistoricPrice) => d.macd.signal}
                      fill={colorPalette.studies.macd.signal}
                      r={3}
                    />
                  )}
                </Chart>
                {this.hasStudiesData.macd && (
                  <HoverTooltip
                    // tslint:disable-next-line:jsx-no-lambda
                    yAccessor={(d: HistoricPrice) => d.close}
                    fill="#f8f8f8"
                    bgFill="#f8f8f8"
                    opacity={0.9}
                    stroke="rgba(90,90,90,0.3)"
                    fontFill="#474747"
                    fontFamily="Arial, Helvetica Neue, Helvetica, sans-serif"
                    backgroundShapeSVG={backgroundMACDShapeSVG}
                    tooltipSVG={tooltipMACDSVG}
                    tooltipContent={tooltipMACDContent(
                      [],
                      this.props.interval,
                      this.props.data,
                      this.props.symbol,
                    )}
                    fontSize={11}
                  />
                )}
              </ChartCanvas>
            )}
          </ChartContainer>
        )}
      </I18nConsumer>
    );
  }

  private renderChartSeries(): JSX.Element {
    if (this.props.chartType === "line") {
      return (
        <LineSeries
          // tslint:disable-next-line:jsx-no-lambda
          yAccessor={(d: HistoricPrice) => d.close}
          stroke={colorPalette.series[0]}
          strokeWidth={3}
        />
      );
    } else if (this.props.chartType === "bar") {
      return (
        <OHLCSeries
          // tslint:disable-next-line:jsx-no-lambda
          fill={(d: HistoricPrice) =>
            (d.close as number) > (d.open as number)
              ? colorPalette.indicator.up
              : colorPalette.indicator.down
          }
          // tslint:disable-next-line:jsx-no-lambda
          stroke={(d: HistoricPrice) =>
            (d.close as number) > (d.open as number)
              ? colorPalette.indicator.up
              : colorPalette.indicator.down
          }
          strokeWidth={2}
        />
      );
    } else {
      return (
        <CandlestickSeries
          // tslint:disable-next-line:jsx-no-lambda
          fill={(d: HistoricPrice) =>
            (d.close as number) > (d.open as number)
              ? colorPalette.indicator.up
              : colorPalette.indicator.down
          }
          // tslint:disable-next-line:jsx-no-lambda
          stroke={(d: HistoricPrice) =>
            (d.close as number) > (d.open as number)
              ? colorPalette.indicator.up
              : colorPalette.indicator.down
          }
          // tslint:disable-next-line:jsx-no-lambda
          wickStroke={(d: HistoricPrice) =>
            (d.close as number) > (d.open as number)
              ? colorPalette.indicator.up
              : colorPalette.indicator.down
          }
          opacity={1}
        />
      );
    }
  }

  private readonly getIndicatorColor = (indicatorData: HistoricPrice, compareField: string) => {
    const previousIndex =
      this.props.data.findIndex((d: HistoricPrice) => d.date === indicatorData.date) - 1;
    if (this.props.data[previousIndex]) {
      if (
        (indicatorData[compareField] as number) >
        (this.props.data[previousIndex][compareField] as number)
      ) {
        return colorPalette.indicator.up;
      } else if (
        (indicatorData[compareField] as number) <
        (this.props.data[previousIndex][compareField] as number)
      ) {
        return colorPalette.indicator.down;
      }
      return colorPalette.indicator.same;
    } else {
      return colorPalette.indicator.same;
    }
  };

  private readonly calculateXAxisTicks = () => {
    if (this.props.widgetWidth < 500) {
      return 2;
    } else if (this.props.widgetWidth < 800) {
      return 4;
    } else if (this.props.widgetWidth < 1100) {
      return 8;
    } else {
      return 12;
    }
  };

  private readonly calculateRightMargin = (yPrice: number) => {
    return yPrice + 10;
  };

  private calculateChartData(data: ReadonlyArray<HistoricPrice>): ReadonlyArray<HistoricPrice> {
    let calculatedData = data;

    const sma4 = sma()
      .options({ windowSize: 4 })
      .merge((d: HistoricPrice, c: number) => {
        const s = { ...d };
        s.sma4 = c;
        return s;
      })
      .accessor((d: HistoricPrice) => d.sma4)
      .stroke("#F6A01A");

    const sma9 = sma()
      .options({ windowSize: 9 })
      .merge((d: HistoricPrice, c: number) => {
        const s = { ...d };
        s.sma9 = c;
        return s;
      })
      .accessor((d: HistoricPrice) => d.sma9)
      .stroke("#003764");

    const sma18 = sma()
      .options({ windowSize: 18 })
      .merge((d: HistoricPrice, c: number) => {
        const s = { ...d };
        s.sma18 = c;
        return s;
      })
      .accessor((d: HistoricPrice) => d.sma18)
      .stroke("#00B259");

    calculatedData = sma18(sma9(sma4(calculatedData)));

    const bb = bollingerBand()
      .merge(
        (
          d: HistoricPrice,
          c: {
            readonly top: number;
            readonly middle: number;
            readonly bottom: number;
          },
        ) => {
          const s = { ...d };
          s.bb = c;
          return s;
        },
      )
      .accessor((d: HistoricPrice) => d.bb);

    calculatedData = bb(calculatedData);

    const rsiCalculator = rsi()
      .options({ windowSize: 14 })
      .merge((d: HistoricPrice, c: number) => {
        const s = { ...d };
        s.rsi = c;
        return s;
      })
      .accessor((d: HistoricPrice) => d.rsi);

    calculatedData = rsiCalculator(calculatedData);

    const slowSTO = stochasticOscillator()
      .options({ windowSize: 14, kWindowSize: 3 })
      .merge((d: HistoricPrice, c: { readonly K?: number; readonly D?: number }) => {
        const s = { ...d };
        s.slowSTO = c;
        return s;
      })
      .accessor((d: HistoricPrice) => d.slowSTO);

    const fastSTO = stochasticOscillator()
      .options({ windowSize: 14, kWindowSize: 1 })
      .merge((d: HistoricPrice, c: { readonly K?: number; readonly D?: number }) => {
        const s = { ...d };
        s.fastSTO = c;
        return s;
      })
      .accessor((d: HistoricPrice) => d.fastSTO);

    calculatedData = slowSTO(calculatedData);

    calculatedData = fastSTO(calculatedData);

    const macdCalculator = macd()
      .options({
        fast: 12,
        slow: 26,
        signal: 9,
      })
      .merge(
        (
          d: HistoricPrice,
          c: {
            readonly macd?: number | string;
            readonly signal?: number | string;
            readonly divergence?: number | string;
          },
        ) => {
          const s = { ...d };
          s.macd = c;
          return s;
        },
      )
      .accessor((d: HistoricPrice) => d.macd);

    calculatedData = macdCalculator(calculatedData);
    // HANDLE ERROR STATE FROM LIBRARY
    calculatedData = calculatedData.map((d: HistoricPrice) => {
      const s = { ...d };
      s.macd = {
        macd: d.macd.macd !== undefined ? d.macd.macd : "",
        signal: d.macd.signal !== undefined ? d.macd.signal : "",
        divergence: d.macd.divergence !== undefined ? d.macd.divergence : "",
      };
      return s;
    });
    this.checkStudiesData(calculatedData);

    return calculatedData;
  }

  private readonly checkStudiesData = (calculatedData: ReadonlyArray<HistoricPrice>) => {
    let hasMacdData = false;
    let hasSlowStoData = false;
    let hasFastStoData = false;
    let hasVolumeData = false;
    let hasRSIData = false;
    let hasBBData = false;
    let hasSMAData = false;

    calculatedData.forEach((d: HistoricPrice) => {
      if (d.macd && d.macd.macd !== "" && d.macd.signal !== "" && d.macd.divergence !== "") {
        hasMacdData = true;
      }
      if (d.slowSTO && d.slowSTO.K !== undefined && d.slowSTO.D !== undefined) {
        hasSlowStoData = true;
      }
      if (d.fastSTO && d.fastSTO.K !== undefined && d.fastSTO.D !== undefined) {
        hasFastStoData = true;
      }
      if (d.volume) {
        hasVolumeData = true;
      }
      if (d.rsi) {
        hasRSIData = true;
      }
      if (d.bb) {
        hasBBData = true;
      }
      if (d.sma9 || d.sma4 || d.sma18) {
        hasSMAData = true;
      }
    });

    this.hasStudiesData = {
      sma: hasSMAData,
      bollingerBands: hasBBData,
      macd: hasMacdData,
      slowStochastic: hasSlowStoData,
      fastStochastic: hasFastStoData,
      volume: hasVolumeData,
      rsi: hasRSIData,
    };

    studiesDataSubject.next(this.hasStudiesData);
  };

  private readonly formatAxisNumbers = (d: number) => {
    const hasNoDigitsAfterDecimalPoint = d - Math.floor(d) === 0;
    const hasOneDigitAfterDecimalPoint = d * 10 - Math.floor(d * 10) === 0;

    if (d >= 10000) {
      return format(".2s")(d);
    } else if (hasNoDigitsAfterDecimalPoint) {
      return format(".0f")(d);
    } else if (hasOneDigitAfterDecimalPoint) {
      return format(".1f")(d);
    } else {
      return format(".2f")(d);
    }
  };

  private readonly getStudyLabelName = (
    studies: ReadonlyArray<{ readonly isDrawn: boolean; readonly study: string }>,
    chartId: number,
  ): string => {
    const study = studies[chartId - 1] ? studies[chartId - 1].study : "";

    switch (study) {
      case "macd":
        return "MACD";
      case "volume":
        const label = !this.props.interval.includes("Mi") ? "Volume/Open Interest" : "Volume";
        return label;
      case "rsi":
        return "RSI";
      case "slowStochastic":
        return "Slow Stochastic";
      case "fastStochastic":
        return "Fast Stochastic";
      default:
        return "";
    }
  };

  private readonly calculateOffset = (): number => {
    let offset = 0;
    if (this.props.studies.bollingerBands && this.props.studies.sma) {
      offset = 35;
    } else if (this.props.studies.sma) {
      offset = 25;
    } else if (this.props.studies.bollingerBands) {
      offset = 5;
    }

    return offset;
  };

  private readonly calculateBorderContainerHeight = (
    studies: ReadonlyArray<{ readonly isDrawn: boolean; readonly study: string }>,
    chartId: number,
  ) => {
    const study = studies[chartId - 1] ? studies[chartId - 1].study : "";
    const isSlowStochasticOn =
      studies.filter(
        (s: { readonly isDrawn: boolean; readonly study: string }) => s.study === "slowStochastic",
      ).length > 0;
    const isFastStochasticOn =
      studies.filter(
        (s: { readonly isDrawn: boolean; readonly study: string }) => s.study === "fastStochastic",
      ).length > 0;

    switch (study) {
      case "macd":
        return isSlowStochasticOn && isFastStochasticOn
          ? Y_AXIS_START_POINT[chartId + 1] + 30
          : isSlowStochasticOn && !isFastStochasticOn
          ? Y_AXIS_START_POINT[chartId + 1] + 20
          : !isSlowStochasticOn && isFastStochasticOn
          ? Y_AXIS_START_POINT[chartId + 1] + 10
          : Y_AXIS_START_POINT[chartId + 1];
      case "fastStochastic":
        return isSlowStochasticOn
          ? Y_AXIS_START_POINT[chartId + 1] + 20
          : Y_AXIS_START_POINT[chartId + 1];
      default:
        return Y_AXIS_START_POINT[chartId + 1];
    }
  };
}

const LineChart = fitWidth(ChartBase);
export default LineChart;
