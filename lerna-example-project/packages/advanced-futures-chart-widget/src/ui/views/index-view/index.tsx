import * as React from "react";
import * as ReactDOM from "react-dom";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import {
  SetErrorMessage,
  GetQuoteForSymbol,
  GetPriceHistoryForSymbol,
  ChangeChartType,
  ChangeYAxisState,
} from "../../../store";
import styled, { ThemeProp, css } from "../../../styled-components";
import {
  ERRORS,
  DROPDOWN_OPTIONS_DICTIONARY,
  CHART_INTERVALS,
  CHART_INTERVALS_DICTIONARY,
  CHART_TYPES,
  INTERVALS_DICTIONARY,
} from "../../../constants";
import ChartComponent from "../../components/chart";
import { Quote, SymbolConfig, SymbolPriceHistory } from "../../../interfaces";
import LoadingIndicator from "../../components/loader";
import ErrorContainer from "../../components/error-container";
import NoDataErrorContainer from "../../components/error-container/no-data-error";
import * as moment from "moment-timezone";
import DropdownComponent, { DropdownOption } from "../../components/dropdown";
import CheckboxComponent from "../../components/checkbox";
import ChartLegend from "../../components/chart/utils/legend";

const WidgetWrapper = styled("div")`
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  padding: 15px 15px 0 15px;
  border: 1px solid #bfbfbf;
  overflow-x: hidden;
  background: #ffffff;
  text-align: left;
`;

const Wrapper = styled("div")`
  width: 99%;
`;

const HeaderContainer = styled("div")`
  display: flex;
  flex-direction: column;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;

  > div {
    display: flex;
    flex-direction: row;
  }
`;

const IconContainer = styled("div")`
  display: flex;
  flex-direction: row-reverse;
  flex-grow: 1;
  margin-right: 10px;
  align-items: center;

  .dtn {
    margin-left: 10px;
    height: 20px;
  }

  .ice {
    width: 24px;
    margin: 5px;
    padding-top: 3px;
  }

  .cme {
    width: 100px;
    margin: 5px;
    padding-top: 3px;
  }
`;

const Link = styled("a")`
  display: flex;
  align-items: center;
`;

export const SymbolHeading = styled.div`
  align-self: flex-start;
  font-size: 20px;
  color: #59595b;
  display: flex;
  align-content: flex-end;
  text-align: left;
  flex-grow: 1;
`;

const UpdatedAtHeading = styled("div")`
  display: flex;
  color: #818182;
  align-self: flex-start;
  margin: 0 0 20px 0;
  font-size: 12px;
`;

export interface DropdownWrapperProps {
  readonly width: number;
}

const DropdownWrapper = styled<DropdownWrapperProps, "div">("div")`
  display: flex;
  flex-direction: row;
  align-items: left;
  margin-bottom: 5px;

  > div {
    width: 200px;
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }

    ${({ width }) =>
      width <= 410 &&
      css`
        margin-right: 5px;

        .dropdown-btn {
          font-size: 13px;
        }
      `};
  }
`;

const StudiesWrapper = styled("div")`
  margin: 15px -15px 0 -15px;
  border-top: 1px solid #bfbfbf;
  padding: 0 15px 15px 15px;

  h3 {
    color: #4e4e4e;
    font-size: 12px;
    font-weight: normal;
    padding: 0;
    margin: 10px 0;
  }

  .rsi {
    margin-left: 10px;
    width: calc(25% - 10px);
  }

  .disabled {
    pointer-events: none;
    opacity: 0.7;
  }
`;

const LegendWrapper = styled("div")`
  margin: 15px -15px 0 -15px;
  border-top: 1px solid #bfbfbf;
  padding: 15px 15px 0 15px;
  overflow: hidden;

  h3 {
    color: #4e4e4e;
    font-size: 12px;
    font-weight: normal;
    padding: 0;
    margin: 10px 0;
  }
`;

export interface RowProps {
  readonly width: number;
}

const Row = styled<RowProps, "div">("div")`
  display: flex;

  &:first-of-type {
    margin-bottom: 6px;
  }

  ${({ width }) =>
    width <= 450 &&
    css`
      .checkbox-label {
        font-size: 13px;
      }
    `};
`;

export interface Props {
  readonly theme?: ThemeProp;
  readonly loading: boolean;
  readonly interval: string;
  readonly duration: string;
  readonly error?: string;
  readonly widgetName: string;
  readonly chartType: string;
  readonly quote?: Quote;
  readonly symbolPriceHistory?: SymbolPriceHistory;
  readonly symbolConfig: SymbolConfig;
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
  readonly setErrorMessage: (error: string) => SetErrorMessage;
  readonly changeChartType: (chartType: string) => ChangeChartType;
  readonly getQuoteForSymbol: (symbol: string) => GetQuoteForSymbol;
  readonly getPriceHistoryForSymbol: (
    symbol: string,
    interval: string,
    duration: string,
  ) => GetPriceHistoryForSymbol;
}

export interface State {
  readonly isDropdownChartTypeExpanded: boolean;
  readonly isDropdownChartIntervalExpanded: boolean;
  readonly isDropdownChartDurationExpanded: boolean;
  readonly isStudySmaChecked: boolean;
  readonly isStudyBollingerBandsChecked: boolean;
  readonly isStudyRsiChecked: boolean;
  readonly isStudySlowStochasticChecked: boolean;
  readonly isStudyFastStochasticChecked: boolean;
  readonly isStudyMacdChecked: boolean;
  readonly isStudyVolumeChecked: boolean;
  readonly dropdownChartTypeSelectedOption: DropdownOption;
  readonly dropdownChartIntervalSelectedOption: DropdownOption;
  readonly dropdownChartDurationSelectedOption: DropdownOption;
  readonly widgetContainerWidth: number;
}

export default class IndexView extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      isDropdownChartTypeExpanded: false,
      isDropdownChartIntervalExpanded: false,
      isDropdownChartDurationExpanded: false,
      isStudySmaChecked: false,
      isStudyBollingerBandsChecked: false,
      isStudyRsiChecked: false,
      isStudySlowStochasticChecked: false,
      isStudyFastStochasticChecked: false,
      isStudyMacdChecked: false,
      isStudyVolumeChecked: false,
      dropdownChartTypeSelectedOption:
        CHART_TYPES.find((option: DropdownOption) => option.key === this.props.chartType) ||
        CHART_TYPES[0],
      dropdownChartIntervalSelectedOption:
        CHART_INTERVALS_DICTIONARY.find(
          (option: DropdownOption) => option.key === this.props.interval.toLowerCase(),
        ) || CHART_INTERVALS_DICTIONARY[0],
      dropdownChartDurationSelectedOption: DROPDOWN_OPTIONS_DICTIONARY[
        this.props.interval.toLowerCase()
      ]
        ? DROPDOWN_OPTIONS_DICTIONARY[this.props.interval.toLowerCase()][0]
        : DROPDOWN_OPTIONS_DICTIONARY[`m`][0],
      widgetContainerWidth: 0,
    };
  }

  private widgetContainerRef: any;
  private dropdownChartTypeRef: any;
  private dropdownChartIntervalRef: any;
  private dropdownChartDurationRef: any;

  componentDidMount(): void {
    const event = "ontouchstart" in window ? "touchstart" : "click";
    document.addEventListener(event, this.handleClickOutside);
    const interval = INTERVALS_DICTIONARY[this.props.interval.toLowerCase()];

    if (interval) {
      this.props.getQuoteForSymbol(this.props.symbolConfig.symbol);
      this.props.getPriceHistoryForSymbol(
        this.props.symbolConfig.symbol,
        interval.key,
        interval.duration,
      );
    } else {
      this.setError(
        "Error: Parameter interval has to be one of D, M, W, Mi, 1-Mi, 5-Mi, 15-Mi, 30-Mi, 60-Mi.",
      );
    }

    this.setState({ widgetContainerWidth: this.widgetContainerRef.clientWidth });
    window.addEventListener("resize", this.handleWidgetResize);
  }

  componentWillUnmount(): void {
    const event = "ontouchstart" in window ? "touchstart" : "click";
    document.removeEventListener(event, this.handleClickOutside);
    window.removeEventListener("resize", this.handleWidgetResize);
  }

  render(): JSX.Element {
    return <div ref={(ref: any) => (this.widgetContainerRef = ref)}>{this.generateContent()}</div>;
  }

  private readonly generateContent = () => {
    if (this.props.loading) {
      return <LoadingIndicator />;
    } else if (this.props.error) {
      return <ErrorContainer error={this.props.error} />;
    } else if (
      this.props.quote &&
      this.props.symbolPriceHistory &&
      this.props.symbolPriceHistory.historicPrices.length >= 0
    ) {
      const primaryMarketName = this.props.quote ? this.props.quote.symbol.marketName : "";
      return (
        <React.StrictMode>
          <I18nConsumer>
            {({ t }) => (
              <WidgetWrapper>
                <Wrapper>
                  <HeaderContainer>
                    <div>
                      <SymbolHeading>{this.displayHeader()}</SymbolHeading>
                      <IconContainer>
                        <img
                          className="dtn"
                          src="https://www.dtn.com/wp-content/uploads/2018/11/logo-dtn.png"
                        />
                        {this.getMarketName(primaryMarketName) === "ICE" && (
                          <Link href="https://www.theice.com/index" target="_blank">
                            <img
                              className="ice"
                              src="https://www.dtn.com/wp-content/uploads/2018/11/logo-ice.png"
                            />
                          </Link>
                        )}
                        {this.getMarketName(primaryMarketName) === "CME" && (
                          <Link href="https://www.cmegroup.com/education" target="_blank">
                            <img
                              className="cme"
                              src="https://www.dtn.com/wp-content/uploads/2018/11/logo-cme.png"
                            />
                          </Link>
                        )}
                      </IconContainer>
                    </div>
                    <UpdatedAtHeading>
                      {t("common.labels.updatedAt", {
                        updatedAt: `${t(
                          `common.months.monthsFull.${moment(
                            this.getUpdatedAtFromLastItem() !== ""
                              ? this.getUpdatedAtFromLastItem()
                              : new Date(),
                          ).format("MMMM")}`,
                        )} ${moment(
                          this.getUpdatedAtFromLastItem() !== ""
                            ? this.getUpdatedAtFromLastItem()
                            : new Date(),
                        ).format(" D, YYYY h:mmA")}`,
                      })}
                    </UpdatedAtHeading>
                  </HeaderContainer>
                  <DropdownWrapper width={this.state.widgetContainerWidth}>
                    <DropdownComponent
                      // tslint:disable-next-line:jsx-no-lambda
                      ref={(comp: any) => (this.dropdownChartTypeRef = comp)}
                      dropdownName="CHART_TYPE"
                      options={CHART_TYPES}
                      label={"common.labels.type"}
                      toggleDropdown={this.handleToggleDropdown}
                      isDropdownExpanded={this.state.isDropdownChartTypeExpanded}
                      changeSelectedOption={this.handleDropdownOptionChange}
                      selectedOption={this.state.dropdownChartTypeSelectedOption}
                    />
                    <DropdownComponent
                      // tslint:disable-next-line:jsx-no-lambda
                      ref={(comp: any) => (this.dropdownChartIntervalRef = comp)}
                      dropdownName="CHART_INTERVAL"
                      options={CHART_INTERVALS}
                      label={"common.labels.interval"}
                      toggleDropdown={this.handleToggleDropdown}
                      isDropdownExpanded={this.state.isDropdownChartIntervalExpanded}
                      changeSelectedOption={this.handleDropdownOptionChange}
                      selectedOption={this.state.dropdownChartIntervalSelectedOption}
                    />
                    <DropdownComponent
                      // tslint:disable-next-line:jsx-no-lambda
                      ref={(comp: any) => (this.dropdownChartDurationRef = comp)}
                      dropdownName="CHART_DURATION"
                      options={
                        DROPDOWN_OPTIONS_DICTIONARY[
                          this.state.dropdownChartIntervalSelectedOption.key
                        ]
                      }
                      label={"common.labels.duration"}
                      toggleDropdown={this.handleToggleDropdown}
                      isDropdownExpanded={this.state.isDropdownChartDurationExpanded}
                      changeSelectedOption={this.handleDropdownOptionChange}
                      selectedOption={this.state.dropdownChartDurationSelectedOption}
                    />
                  </DropdownWrapper>
                  {(this.props.symbolPriceHistory &&
                    this.props.symbolPriceHistory.historicPrices.length === 0) ||
                  (this.props.symbolPriceHistory &&
                    this.props.symbolPriceHistory.historicPrices.length === 1) ? (
                    <NoDataErrorContainer error="noChartDataForSymbol" />
                  ) : (
                    <ChartComponent
                      width={this.state.widgetContainerWidth}
                      yAxisState={this.props.yAxisState}
                      changeYAxisState={this.props.changeYAxisState}
                      chartData={this.props.symbolPriceHistory!.historicPrices}
                      symbol={this.props.symbolPriceHistory!.symbol}
                      chartType={
                        CHART_TYPES.find(t => t.key === this.props.chartType)
                          ? this.props.chartType
                          : "line"
                      }
                      interval={this.props.interval}
                      studies={{
                        sma: this.state.isStudySmaChecked,
                        rsi: this.state.isStudyRsiChecked,
                        bollingerBands: this.state.isStudyBollingerBandsChecked,
                        slowStochastic: this.state.isStudySlowStochasticChecked,
                        fastStochastic: this.state.isStudyFastStochasticChecked,
                        macd: this.state.isStudyMacdChecked,
                        volume: this.state.isStudyVolumeChecked,
                      }}
                    />
                  )}
                </Wrapper>
                <StudiesWrapper>
                  <h3>{t("common.labels.studiesAndIndicators")}</h3>
                  <Row width={this.state.widgetContainerWidth}>
                    <CheckboxComponent
                      name={"STUDY_SMA"}
                      isChecked={this.state.isStudySmaChecked}
                      label={"common.studies.sma"}
                      toggleIsChecked={this.handleCheckboxToggle}
                      className="sma"
                      study="sma"
                    />
                    <CheckboxComponent
                      name={"STUDY_BOLLINGER_BANDS"}
                      isChecked={this.state.isStudyBollingerBandsChecked}
                      label={"common.studies.bollingerBands"}
                      toggleIsChecked={this.handleCheckboxToggle}
                      study="bollingerBands"
                      className="bollingerBands"
                    />
                    <CheckboxComponent
                      name={"STUDY_VOLUME_OPEN_INTEREST"}
                      isChecked={this.state.isStudyVolumeChecked}
                      label={"common.studies.volumeOpenInterest"}
                      toggleIsChecked={this.handleCheckboxToggle}
                      study="volume"
                      className="volume"
                    />
                    <CheckboxComponent
                      className="rsi"
                      name={"STUDY_RSI"}
                      isChecked={this.state.isStudyRsiChecked}
                      label={"common.studies.rsi"}
                      toggleIsChecked={this.handleCheckboxToggle}
                      study="rsi"
                    />
                  </Row>
                  <Row width={this.state.widgetContainerWidth}>
                    <CheckboxComponent
                      name={"STUDY_SLOW_STOCHASTIC"}
                      isChecked={this.state.isStudySlowStochasticChecked}
                      label={"common.studies.slowStochastic"}
                      toggleIsChecked={this.handleCheckboxToggle}
                      study="slowStochastic"
                      className="slowStochastic"
                    />
                    <CheckboxComponent
                      name={"STUDY_FAST_STOCHASTIC"}
                      isChecked={this.state.isStudyFastStochasticChecked}
                      label={"common.studies.fastStochastic"}
                      toggleIsChecked={this.handleCheckboxToggle}
                      study="fastStochastic"
                      className="fastStochastic"
                    />
                    <CheckboxComponent
                      name={"STUDY_MACD"}
                      isChecked={this.state.isStudyMacdChecked}
                      label={"common.studies.macd"}
                      toggleIsChecked={this.handleCheckboxToggle}
                      study="macd"
                      className="macd"
                    />
                  </Row>
                </StudiesWrapper>
                <LegendWrapper>
                  <ChartLegend
                    studies={{
                      sma: this.state.isStudySmaChecked,
                      rsi: this.state.isStudyRsiChecked,
                      bollingerBands: this.state.isStudyBollingerBandsChecked,
                      slowStochastic: this.state.isStudySlowStochasticChecked,
                      fastStochastic: this.state.isStudyFastStochasticChecked,
                      macd: this.state.isStudyMacdChecked,
                      volume: this.state.isStudyVolumeChecked,
                    }}
                    interval={this.props.interval}
                    symbol={this.props.symbolConfig.symbol}
                  />
                </LegendWrapper>
              </WidgetWrapper>
            )}
          </I18nConsumer>
        </React.StrictMode>
      );
    } else {
      return <LoadingIndicator />;
    }
  };

  private readonly getMarketName = (marketName: string): string => {
    switch (marketName.toLocaleLowerCase()) {
      case "ice canada":
      case "ice endex":
      case "ice europe":
      case "ice liffe":
      case "ice us":
        return "ICE";
      case "cme":
      case "cbot":
      case "nymex":
      case "comex":
        return "CME";
      default:
        return "";
    }
  };

  private readonly handleWidgetResize = (): void => {
    this.setState({ widgetContainerWidth: this.widgetContainerRef.clientWidth });
  };

  private readonly getUpdatedAtFromLastItem = (): string => {
    if (this.props.quote!.tradeDateTime) {
      return this.props.quote!.tradeDateTime;
    } else {
      return this.props.symbolPriceHistory!.historicPrices[
        this.props.symbolPriceHistory!.historicPrices.length - 1
      ] &&
        this.props.symbolPriceHistory!.historicPrices[
          this.props.symbolPriceHistory!.historicPrices.length - 1
        ]
        ? this.props.symbolPriceHistory!.historicPrices[
            this.props.symbolPriceHistory!.historicPrices.length - 1
          ].date
        : "";
    }
  };

  private readonly setError = (err: string) => {
    this.props.setErrorMessage(err);
  };

  private readonly displayHeader = () => {
    let heading = "";
    if (this.props.symbolConfig.isDescriptionVisible) {
      heading += this.props.symbolPriceHistory!.description
        ? this.props.symbolPriceHistory!.description
        : translationFunction("common.labels.noDescription");
    }

    if (this.props.symbolConfig.isSymbolVisible && this.props.symbolConfig.isDescriptionVisible) {
      heading += ` - ${this.props.symbolPriceHistory!.tickerSymbol} ${
        this.props.quote!.quoteDelay ? `[${this.props.quote!.quoteDelay}]` : ""
      }`;
    } else if (this.props.symbolConfig.isSymbolVisible) {
      heading += ` ${this.props.symbolPriceHistory!.tickerSymbol} ${
        this.props.quote!.quoteDelay ? `[${this.props.quote!.quoteDelay}]` : ""
      }`;
    } else if (this.props.symbolConfig.isDescriptionVisible) {
      heading += ` [${this.props.quote!.quoteDelay}]`;
    } else {
      heading += this.props.quote!.quoteDelay ? `[${this.props.quote!.quoteDelay}]` : "";
    }
    return heading;
  };

  private readonly handleToggleDropdown = (dropdownName: string) => {
    switch (dropdownName) {
      case "CHART_TYPE":
        this.setState({
          isDropdownChartTypeExpanded: !this.state.isDropdownChartTypeExpanded,
          isDropdownChartIntervalExpanded: false,
          isDropdownChartDurationExpanded: false,
        });
        break;
      case "CHART_INTERVAL":
        this.setState({
          isDropdownChartIntervalExpanded: !this.state.isDropdownChartIntervalExpanded,
          isDropdownChartTypeExpanded: false,
          isDropdownChartDurationExpanded: false,
        });
        break;
      case "CHART_DURATION":
        this.setState({
          isDropdownChartDurationExpanded: !this.state.isDropdownChartDurationExpanded,
          isDropdownChartTypeExpanded: false,
          isDropdownChartIntervalExpanded: false,
        });
        break;
      default:
        break;
    }
  };

  private readonly handleDropdownOptionChange = (
    dropdownName: string,
    selectedOption: DropdownOption,
  ) => {
    switch (dropdownName) {
      case "CHART_TYPE":
        this.setState({ dropdownChartTypeSelectedOption: selectedOption });
        this.props.changeChartType(selectedOption.key);
        break;
      case "CHART_INTERVAL":
        const defaultDuration = this.setDefaultDurationForInterval(selectedOption);
        this.setState({
          dropdownChartIntervalSelectedOption: {
            key: selectedOption.key.toLowerCase(),
            value: selectedOption.value,
          },
          dropdownChartDurationSelectedOption: defaultDuration,
        });
        this.props.getPriceHistoryForSymbol(
          this.props.symbolConfig.symbol,
          selectedOption.key,
          defaultDuration.key,
        );
        break;
      case "CHART_DURATION":
        this.setState({ dropdownChartDurationSelectedOption: selectedOption });
        this.props.getPriceHistoryForSymbol(
          this.props.symbolConfig.symbol,
          INTERVALS_DICTIONARY[this.props.interval.toLowerCase()].key,
          selectedOption.key,
        );
        break;
      default:
        break;
    }
  };

  private readonly setDefaultDurationForInterval = (selectedOption: DropdownOption) => {
    return DROPDOWN_OPTIONS_DICTIONARY[selectedOption.key.toLowerCase()][0];
  };

  private readonly handleClickOutside = (event: any) => {
    const dropdownChartTypeNode = ReactDOM.findDOMNode(this.dropdownChartTypeRef);
    const dropdownChartIntervalNode = ReactDOM.findDOMNode(this.dropdownChartIntervalRef);
    const dropdownChartDurationNode = ReactDOM.findDOMNode(this.dropdownChartDurationRef);

    if (dropdownChartTypeNode && dropdownChartIntervalNode && dropdownChartDurationNode) {
      if (
        !dropdownChartTypeNode.contains(event.target) &&
        !dropdownChartIntervalNode.contains(event.target) &&
        !dropdownChartDurationNode.contains(event.target)
      ) {
        this.setState({
          isDropdownChartTypeExpanded: false,
          isDropdownChartIntervalExpanded: false,
          isDropdownChartDurationExpanded: false,
        });
      }
    }
  };

  private readonly handleCheckboxToggle = (checkboxName: string): void => {
    switch (checkboxName) {
      case "STUDY_SMA":
        this.setState({
          isStudySmaChecked: !this.state.isStudySmaChecked,
        });
        break;
      case "STUDY_BOLLINGER_BANDS":
        this.setState({
          isStudyBollingerBandsChecked: !this.state.isStudyBollingerBandsChecked,
        });
        break;
      case "STUDY_RSI":
        this.setState({
          isStudyRsiChecked: !this.state.isStudyRsiChecked,
        });
        break;
      case "STUDY_SLOW_STOCHASTIC":
        this.setState({
          isStudySlowStochasticChecked: !this.state.isStudySlowStochasticChecked,
        });
        break;
      case "STUDY_FAST_STOCHASTIC":
        this.setState({
          isStudyFastStochasticChecked: !this.state.isStudyFastStochasticChecked,
        });
        break;
      case "STUDY_MACD":
        this.setState({
          isStudyMacdChecked: !this.state.isStudyMacdChecked,
        });
        break;
      case "STUDY_VOLUME_OPEN_INTEREST":
        this.setState({
          isStudyVolumeChecked: !this.state.isStudyVolumeChecked,
        });
        break;
      default:
        break;
    }
  };
}
