import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Consumer as I18nConsumer,
  Provider as I18nProvider,
  t as translationFunction,
} from "../../../i18n";
import {
  SetErrorMessage,
  FetchBasicCashBidsData,
  ChangeCashBidId,
  FetchLocationsForSite,
  FetchCommoditiesForSite,
  FetchDeliveryPeriods,
  ChangeLocation,
  ChangeCommodity,
  ChangeDeliveryEndDate,
  ChangeAdditionalOptions,
  ChangeRange,
  RedrawCashBidsData,
  SetRedrawChartTime,
} from "../../../store";
import styled, { css, ThemeProvider, ThemeProp } from "../../../styled-components";
import LoadingIndicator from "../../components/loader";
import ChartComponent from "../../components/chart";
import ErrorContainer from "../../components/error-container";
import { CashBidChartData } from "../../../interfaces";
import DropdownComponent, { DropdownOption } from "../../components/dropdown/dropdown";
import DatePicker from "../../components/dropdown/date-picker";
import DropdownCheckboxesComponent, {
  DropdownCheckboxOption,
} from "../../components/dropdown/dropdown-checkboxes";
import * as moment from "moment-timezone";

let Reset = styled.div`
  h1 {
    margin: 0;
  }

  ol,
  ul {
    margin: 0;
    padding: 0;
  }
`;

const WidgetContainer = styled("div")`
  font-size: 16px;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  border: 1px solid #bfbfbf;
  overflow-x: hidden;
  text-align: left;
  background-color: white;
  overflow-y: hidden;
`;

export interface DropdownWrapperProps {
  readonly width: number;
}

const DropdownWrapper = styled<DropdownWrapperProps, "div">("div")`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-top: 10px;
  padding: 0 7px;
  border-top: 1px solid #bfbfbf;
  overflow: hidden;

  .first-row {
    margin: 20px 0 10px 0;
  }

  .second-row {
    margin: 10px 0 20px 0;

    ${({ width }) =>
      width <= 600 &&
      css`
        > div {
          margin-top: -20px;
          height: 65px;
        }
      `};
  }
`;

const Row = styled<DropdownWrapperProps, "div">("div")`
  display: flex;
  width: 100%;

  > div {
    width: calc((100% - 40px) / 3);
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }
  }

  .delivery-dates ul {
    bottom: -20px;
    top: auto;
  }

  ${({ width }) =>
    width <= 600 &&
    css`
      flex-direction: column;
      margin: 0;

      > div {
        width: 100%;
        margin-bottom: 10px;
      }

      .dropdown-btn {
        font-size: 13px;
      }
    `};
`;

const Button = styled("div")`
  width: 125px;
  padding: 7px 0;
  background: #ffffff;
  outline: none;
  border: 1px solid #bfbfbf;
  font-size: 14px;
  font-weight: bold;
  color: rgb(48, 48, 48);
  margin-bottom: 15px;
  text-align: center;

  &:active,
  &:focus {
    outline: none;
  }

  &:hover {
    cursor: pointer;
    background-color: rgb(241, 241, 241);
  }
`;

export interface Props {
  readonly theme?: ThemeProp;
  readonly symbol?: string;
  readonly updatedAt?: string;
  readonly chartData: ReadonlyArray<CashBidChartData>;
  readonly duration: string;
  readonly location?: string;
  readonly commodity?: string;
  readonly deliveryEndDate?: string;
  readonly siteId: string;
  readonly cashBidId: number;
  readonly showCurrentBasis: boolean;
  readonly show3YearAverageBasis: boolean;
  readonly show3YearAverageCashPrice: boolean;
  readonly fetchBasicCashBids: (
    cashBidId: number,
    duration: string,
    siteId: string,
    range: {
      readonly start: string;
      readonly end: string;
    },
    locationId?: number,
    commodityId?: number,
  ) => FetchBasicCashBidsData;
  readonly loading: boolean;
  readonly error?: string;
  readonly locationId?: number;
  readonly commodityId?: number;
  readonly range: { readonly start: string; readonly end: string };
  readonly locations: ReadonlyArray<{
    readonly grainBidElevatorIds: ReadonlyArray<number>;
    readonly links: Object;
    readonly id: number;
    readonly name: string;
  }>;
  readonly commodities: ReadonlyArray<{
    readonly commodityName: string;
    readonly id: number;
  }>;
  readonly deliveryPeriods: ReadonlyArray<{
    readonly cashBidId: number;
    readonly deliveryPeriod: {
      readonly start: string;
      readonly end: string;
    };
  }>;
  readonly redrawCashBidsData: (
    cashBidId: number,
    duration: string,
    siteId: string,
    range: {
      readonly start: string;
      readonly end: string;
    },
  ) => RedrawCashBidsData;
  readonly fetchLocationsForSite: (siteId: string) => FetchLocationsForSite;
  readonly fetchCommoditiesForSite: (siteId: string, locationId: number) => FetchCommoditiesForSite;
  readonly fetchDeliveryPeriods: (
    siteId: string,
    locationId: number,
    commodityId: number,
  ) => FetchDeliveryPeriods;
  readonly setErrorMessage: (error: string) => SetErrorMessage;
  readonly changeCashBidId: (cashBidId: number) => ChangeCashBidId;
  readonly changeLocation: (locationId?: number, location?: string) => ChangeLocation;
  readonly changeCommodity: (commodityId?: number, commodity?: string) => ChangeCommodity;
  readonly changeDeliveryEndDate: (
    deliveryEndDate: string,
    cashBidId: number,
  ) => ChangeDeliveryEndDate;
  readonly changeAdditionalOptions: (additionalOptions: {
    readonly showCurrentBasis: boolean;
    readonly show3YearAverageBasis: boolean;
    readonly show3YearAverageCashPrice: boolean;
  }) => ChangeAdditionalOptions;
  readonly changeRange: (range: { readonly start: string; readonly end: string }) => ChangeRange;
  readonly setRedrawChartTime: (
    redrawChartTime: string,
    previousRedrawState: string,
  ) => SetRedrawChartTime;
}

export interface State {
  readonly widgetContainerWidth: number;
  readonly isDropdownLocationExpanded: boolean;
  readonly isDropdownCommoditiesExpanded: boolean;
  readonly isDropdownAdditionalOptionsExpanded: boolean;
  readonly isDropdownRangeExpanded: boolean;
  readonly isDropdownDeliveryEndDateExpanded: boolean;
  readonly additionalOptions: {
    readonly showCurrentBasis: boolean;
    readonly show3YearAverageBasis: boolean;
    readonly show3YearAverageCashPrice: boolean;
  };
  readonly location?: string;
  readonly commodity?: string;
}

export interface DeliveryPeriod {
  readonly cashBidId: number;
  readonly deliveryPeriod: {
    readonly start: string;
    readonly end: string;
  };
}

export default class IndexView extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      widgetContainerWidth: 0,
      isDropdownLocationExpanded: false,
      isDropdownCommoditiesExpanded: false,
      isDropdownAdditionalOptionsExpanded: false,
      isDropdownRangeExpanded: false,
      isDropdownDeliveryEndDateExpanded: false,
      additionalOptions: {
        showCurrentBasis: this.props.showCurrentBasis,
        show3YearAverageBasis: this.props.show3YearAverageBasis,
        show3YearAverageCashPrice: this.props.show3YearAverageCashPrice,
      },
      location: "",
      commodity: "",
    };
  }

  private widgetContainerRef: any;
  private dropdownLocationRef: any;
  private dropdownCommoditiesRef: any;
  private dropdownAdditionalOptionsRef: any;
  private dropdownRangeNodeRef: any;
  private dropdownDeliveryEndDateRef: any;
  private isDefault = true;

  componentDidMount(): void {
    const event = "ontouchstart" in window ? "touchstart" : "click";
    document.addEventListener(event, this.handleClickOutside);

    this.props.fetchBasicCashBids(
      this.props.cashBidId,
      this.props.duration,
      this.props.siteId,
      this.props.range,
      this.props.locationId,
      this.props.commodityId,
    );
    this.props.fetchLocationsForSite(this.props.siteId);
    this.setState({ widgetContainerWidth: this.widgetContainerRef.clientWidth });
    window.addEventListener("resize", this.handleWidgetResize);

    if (this.props.locationId) {
      this.props.fetchCommoditiesForSite(this.props.siteId, this.props.locationId);
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    // Initial fetch for commodities
    if (nextProps.locationId !== this.props.locationId) {
      if (nextProps.locationId) {
        this.props.fetchCommoditiesForSite(this.props.siteId, nextProps.locationId);
      }
    }

    if (nextProps.locationId !== this.props.locationId && this.isDefault) {
      this.setState({ location: nextProps.location });
    }

    if (nextProps.location !== this.props.location && this.isDefault) {
      this.setState({ location: nextProps.location });
    }

    if (nextProps.commodity !== this.props.commodity && this.isDefault) {
      this.setState({ commodity: nextProps.commodity });
    }

    if (nextProps.commodities !== this.props.commodities && this.isDefault) {
      this.setState({ commodity: nextProps.commodity });
    }

    // Listen for commodities change and When new commodities are received select first one
    if (nextProps.commodities !== this.props.commodities && !this.isDefault) {
      const newCommodity =
        nextProps.commodities.length > 0
          ? nextProps.commodities[0]
          : { commodityName: "Select commodity", id: undefined };
      this.props.changeCommodity(newCommodity.id, newCommodity.commodityName);

      if (this.props.siteId && this.props.locationId && newCommodity.id) {
        this.props.fetchDeliveryPeriods(this.props.siteId, this.props.locationId, newCommodity.id);
      }
    }

    // Listen for commodityId change and When commodityId is changed fetch Delivery periods
    if (nextProps.commodityId !== this.props.commodityId && !this.isDefault) {
      if (this.props.siteId && this.props.locationId && nextProps.commodityId) {
        this.props.fetchDeliveryPeriods(
          this.props.siteId,
          this.props.locationId,
          nextProps.commodityId,
        );
      }
    }

    // Listen for deliveryPeriods change and When new deliveryPeriods are received select first one
    if (nextProps.deliveryPeriods !== this.props.deliveryPeriods && !this.isDefault) {
      if (
        nextProps.deliveryPeriods &&
        nextProps.deliveryPeriods.length > 0 &&
        nextProps.deliveryPeriods[0]
      ) {
        this.props.changeDeliveryEndDate(
          nextProps.deliveryPeriods[0].deliveryPeriod.end,
          nextProps.deliveryPeriods[0].cashBidId,
        );
      } else {
        this.props.changeDeliveryEndDate("", 0);
      }
    }
  }

  componentWillUnmount(): void {
    const event = "ontouchstart" in window ? "touchstart" : "click";
    document.removeEventListener(event, this.handleClickOutside);
    window.removeEventListener("resize", this.handleWidgetResize);
  }

  render(): JSX.Element {
    const content = (
      <div ref={ref => (this.widgetContainerRef = ref)}>{this.generateContent()}</div>
    );

    return (
      <React.StrictMode>
        <I18nConsumer>
          {({ t }) => (
            <Reset>
              <I18nProvider value={{ t }}>
                <ThemeProvider theme={this.props.theme}>{content}</ThemeProvider>
              </I18nProvider>
            </Reset>
          )}
        </I18nConsumer>
      </React.StrictMode>
    );
  }

  private readonly handleWidgetResize = (): void => {
    this.setState({ widgetContainerWidth: this.widgetContainerRef.clientWidth });
  };

  private readonly handleClickOutside = (event: any) => {
    const dropdownLocationNode = ReactDOM.findDOMNode(this.dropdownLocationRef);
    const dropdownCommoditiesNode = ReactDOM.findDOMNode(this.dropdownCommoditiesRef);
    const dropdownAdditionalOptionsNode = ReactDOM.findDOMNode(this.dropdownAdditionalOptionsRef);
    const dropdownRangeNode = ReactDOM.findDOMNode(this.dropdownRangeNodeRef);
    const dropdownDeliveryEndDateNode = ReactDOM.findDOMNode(this.dropdownDeliveryEndDateRef);
    if (
      dropdownLocationNode &&
      dropdownCommoditiesNode &&
      dropdownAdditionalOptionsNode &&
      dropdownRangeNode &&
      dropdownDeliveryEndDateNode
    ) {
      if (
        !dropdownLocationNode.contains(event.target) &&
        !dropdownCommoditiesNode.contains(event.target) &&
        !dropdownAdditionalOptionsNode.contains(event.target) &&
        !dropdownRangeNode.contains(event.target) &&
        !dropdownDeliveryEndDateNode.contains(event.target)
      ) {
        this.setState({
          isDropdownLocationExpanded: false,
          isDropdownCommoditiesExpanded: false,
          isDropdownAdditionalOptionsExpanded: false,
          isDropdownRangeExpanded: false,
          isDropdownDeliveryEndDateExpanded: false,
        });
      }
    }
  };

  private readonly isNull = (): {
    readonly basis3YrAvg: number | string;
    readonly cashPrice3YrAvg: number | string;
  } => {
    const result: { basis3YrAvg: number | string; cashPrice3YrAvg: number | string } = {
      basis3YrAvg: "",
      cashPrice3YrAvg: "",
    };

    this.props.chartData.forEach(d => {
      if (result.basis3YrAvg === "" || result.cashPrice3YrAvg === "") {
        if (result.basis3YrAvg === "" && d.basis3YrAvg !== null && d.basis3YrAvg !== undefined) {
          result.basis3YrAvg = d.basis3YrAvg;
        }

        if (
          result.cashPrice3YrAvg === "" &&
          d.cashPrice3YrAvg !== null &&
          d.cashPrice3YrAvg !== undefined
        ) {
          result.cashPrice3YrAvg = d.cashPrice3YrAvg;
        }
      } else {
        return result;
      }
    });

    return result;
  };

  private readonly trimLastNullTick = (chartData: ReadonlyArray<CashBidChartData>) => {
    if (chartData.length > 1) {
      // tslint:disable-next-line:readonly-array
      const clonedChartData: CashBidChartData[] = [...chartData];
      const lastItem = clonedChartData[clonedChartData.length - 1];
      if (
        lastItem.basis === null &&
        lastItem.cashPrice === null &&
        lastItem.cashPrice3YrAvg === null &&
        lastItem.basis3YrAvg === null
      ) {
        // tslint:disable-next-line:no-array-mutation
        clonedChartData.pop();
      }
      return clonedChartData;
    }
    return chartData;
  };

  private readonly generateContent = () => {
    if (this.props.loading) {
      return <LoadingIndicator />;
    } else if (this.props.error) {
      return <ErrorContainer error={this.props.error} />;
    } else {
      let fieldsResult = this.isNull();
      const sortedDeliveryPeriods: any = [...this.props.deliveryPeriods];
      sortedDeliveryPeriods.sort((a: DeliveryPeriod, b: DeliveryPeriod) => {
        return new Date(a.deliveryPeriod.end).getTime() - new Date(b.deliveryPeriod.end).getTime();
      });

      const parsedDeliveryPeriods = sortedDeliveryPeriods.map((d: DeliveryPeriod) => ({
        key: d.cashBidId.toString(),
        value: this.parseDate(d.deliveryPeriod.end),
      }));

      // IF commodity name from initial request is different from that received in commodity request
      // and the Id is equal, change commodity name to match
      const filterCommodity = this.props.commodities.filter(c => c.id === this.props.commodityId);
      if (filterCommodity.length > 0 && filterCommodity[0].commodityName !== this.props.commodity) {
        this.props.changeCommodity(filterCommodity[0].id, filterCommodity[0].commodityName);
      }

      return (
        <I18nConsumer>
          {({ t }) => (
            <WidgetContainer>
              <ChartComponent
                widgetWidth={this.state.widgetContainerWidth}
                chartData={this.trimLastNullTick(this.props.chartData)}
                location={this.state.location}
                commodity={this.state.commodity}
                updatedAt={this.props.updatedAt}
                deliveryEndDate={this.props.deliveryEndDate}
                symbol={this.props.symbol}
                isBasis3YrAvgNull={fieldsResult.basis3YrAvg === ""}
                isCashPrice3YrAvgNull={fieldsResult.cashPrice3YrAvg === ""}
                showCurrentBasis={this.props.showCurrentBasis}
                show3YearAverageBasis={this.props.show3YearAverageBasis}
                show3YearAverageCashPrice={this.props.show3YearAverageCashPrice}
              />

              <DropdownWrapper width={this.state.widgetContainerWidth}>
                <Row width={this.state.widgetContainerWidth} className="first-row">
                  <DropdownComponent
                    //tslint:disable-next-line:jsx-no-lambda
                    ref={(comp: any) => (this.dropdownLocationRef = comp)}
                    dropdownName="Location"
                    options={
                      this.props.locations.length > 0
                        ? this.props.locations.map(l => ({ key: l.id.toString(), value: l.name }))
                        : [
                            {
                              key: this.props.locationId ? this.props.locationId.toString() : "",
                              value: this.props.location || "Select location",
                            },
                          ]
                    }
                    label={"common.labels.location"}
                    toggleDropdown={this.handleToggleDropdown}
                    isDropdownExpanded={this.state.isDropdownLocationExpanded}
                    changeSelectedOption={this.handleDropdownOptionChange}
                    selectedOption={{
                      key: this.props.locationId ? this.props.locationId.toString() : "",
                      value: this.props.location || "Select location",
                    }}
                  />

                  <DropdownComponent
                    //tslint:disable-next-line:jsx-no-lambda
                    ref={(comp: any) => (this.dropdownCommoditiesRef = comp)}
                    dropdownName="Commodities"
                    options={
                      this.props.commodities.length > 0
                        ? this.props.commodities.map(c => ({
                            key: c.id.toString(),
                            value: c.commodityName,
                          }))
                        : [
                            {
                              key: this.props.commodityId ? this.props.commodityId.toString() : "",
                              value: this.props.commodity || "Select commodity",
                            },
                          ]
                    }
                    label={"common.labels.commodities"}
                    toggleDropdown={this.handleToggleDropdown}
                    isDropdownExpanded={this.state.isDropdownCommoditiesExpanded}
                    changeSelectedOption={this.handleDropdownOptionChange}
                    selectedOption={{
                      key: this.props.commodityId ? this.props.commodityId.toString() : "",
                      value: this.props.commodity || "Select commodity",
                    }}
                  />

                  <DropdownCheckboxesComponent
                    //tslint:disable-next-line:jsx-no-lambda
                    ref={(comp: any) => (this.dropdownAdditionalOptionsRef = comp)}
                    dropdownName="Additional Options"
                    options={[
                      {
                        key: "showCurrentBasis",
                        value: this.state.additionalOptions.showCurrentBasis,
                      },
                      {
                        key: "show3YearAverageCashPrice",
                        value: this.state.additionalOptions.show3YearAverageCashPrice,
                      },
                      {
                        key: "show3YearAverageBasis",
                        value: this.state.additionalOptions.show3YearAverageBasis,
                      },
                    ]}
                    initialStates={{
                      showCurrentBasis: this.props.showCurrentBasis,
                      show3YearAverageCashPrice: this.props.show3YearAverageCashPrice,
                      show3YearAverageBasis: this.props.show3YearAverageBasis,
                    }}
                    label={"common.labels.additionalOptions"}
                    toggleDropdown={this.handleToggleDropdown}
                    isDropdownExpanded={this.state.isDropdownAdditionalOptionsExpanded}
                    changeSelectedOption={this.handleCheckboxesChange}
                  />
                </Row>

                <Row width={this.state.widgetContainerWidth} className="second-row">
                  <DatePicker
                    //tslint:disable-next-line:jsx-no-lambda
                    ref={(comp: any) => (this.dropdownRangeNodeRef = comp)}
                    dropdownName="Range"
                    options={[]}
                    label={"common.labels.range"}
                    toggleDropdown={this.handleToggleDropdown}
                    isDropdownExpanded={this.state.isDropdownRangeExpanded}
                    changeSelectedOption={this.handleDropdownOptionChange}
                    selectedDays={this.props.range}
                    width={this.state.widgetContainerWidth}
                    changeRange={this.props.changeRange}
                    //selectedOption={this.state.dropdownRangeOption}
                  />

                  <DropdownComponent
                    //tslint:disable-next-line:jsx-no-lambda
                    ref={(comp: any) => (this.dropdownDeliveryEndDateRef = comp)}
                    dropdownName="Delivery End Date"
                    className="delivery-dates"
                    options={
                      parsedDeliveryPeriods.length > 0
                        ? parsedDeliveryPeriods
                        : [{ key: "", value: "Select date" }]
                    }
                    label={"common.labels.deliveryEndDate"}
                    toggleDropdown={this.handleToggleDropdown}
                    isDropdownExpanded={this.state.isDropdownDeliveryEndDateExpanded}
                    changeSelectedOption={this.handleDropdownOptionChange}
                    selectedOption={
                      this.props.cashBidId && this.props.deliveryEndDate
                        ? {
                            key: this.props.cashBidId.toString(),
                            value: this.parseDate(this.props.deliveryEndDate),
                          }
                        : parsedDeliveryPeriods.length > 0
                        ? parsedDeliveryPeriods[0]
                        : { key: "", value: "Select date" }
                    }
                  />
                </Row>

                {/* tslint:disable-next-line:jsx-no-lambda */}
                <Button onClick={() => this.redrawChart()}>{t("common.redrawChart")}</Button>
              </DropdownWrapper>
            </WidgetContainer>
          )}
        </I18nConsumer>
      );
    }
  };

  private readonly parseDate = (date: string | undefined) => {
    if (date) {
      const month = moment(date).format("D");
      const day = moment(date).format("MMM");
      const year = moment(date).format("YYYY");
      const parsedDate = `${month} ${day}, ${year}`;
      return parsedDate;
    } else {
      return "";
    }
  };

  private readonly handleToggleDropdown = (dropdownName: string) => {
    switch (dropdownName) {
      case "Location":
        this.setState({
          isDropdownLocationExpanded: !this.state.isDropdownLocationExpanded,
          isDropdownCommoditiesExpanded: false,
          isDropdownAdditionalOptionsExpanded: false,
          isDropdownRangeExpanded: false,
          isDropdownDeliveryEndDateExpanded: false,
        });
        break;
      case "Commodities":
        this.setState({
          isDropdownCommoditiesExpanded: !this.state.isDropdownCommoditiesExpanded,
          isDropdownLocationExpanded: false,
          isDropdownAdditionalOptionsExpanded: false,
          isDropdownRangeExpanded: false,
          isDropdownDeliveryEndDateExpanded: false,
        });
        break;
      case "Additional Options":
        this.setState({
          isDropdownAdditionalOptionsExpanded: !this.state.isDropdownAdditionalOptionsExpanded,
          isDropdownLocationExpanded: false,
          isDropdownCommoditiesExpanded: false,
          isDropdownRangeExpanded: false,
          isDropdownDeliveryEndDateExpanded: false,
        });
        break;
      case "Range":
        this.setState({
          isDropdownRangeExpanded: !this.state.isDropdownRangeExpanded,
          isDropdownAdditionalOptionsExpanded: false,
          isDropdownLocationExpanded: false,
          isDropdownCommoditiesExpanded: false,
          isDropdownDeliveryEndDateExpanded: false,
        });
        break;
      case "Delivery End Date":
        this.setState({
          isDropdownDeliveryEndDateExpanded: !this.state.isDropdownDeliveryEndDateExpanded,
          isDropdownRangeExpanded: false,
          isDropdownAdditionalOptionsExpanded: false,
          isDropdownLocationExpanded: false,
          isDropdownCommoditiesExpanded: false,
        });
        break;
      default:
        break;
    }
  };

  private readonly handleCheckboxesChange = (
    dropdownName: string,
    selectedOption: ReadonlyArray<DropdownCheckboxOption>,
  ) => {
    if (dropdownName === "Additional Options") {
      let showCurrentBasis = false;
      let show3YearAverageBasis = false;
      let show3YearAverageCashPrice = false;

      selectedOption.forEach((o: DropdownCheckboxOption) => {
        if (o.key === "showCurrentBasis") {
          showCurrentBasis = o.value;
        } else if (o.key === "show3YearAverageBasis") {
          show3YearAverageBasis = o.value;
        } else {
          show3YearAverageCashPrice = o.value;
        }
      });

      this.setState({
        additionalOptions: {
          showCurrentBasis,
          show3YearAverageBasis,
          show3YearAverageCashPrice,
        },
      });
    }
  };

  private readonly handleDropdownOptionChange = async (
    dropdownName: string,
    selectedOption: DropdownOption,
  ) => {
    switch (dropdownName) {
      case "Location":
        this.isDefault = false;
        this.props.changeLocation(parseFloat(selectedOption.key), selectedOption.value);
        break;
      case "Commodities":
        this.isDefault = false;
        this.props.changeCommodity(parseFloat(selectedOption.key), selectedOption.value);
        break;
      case "Delivery End Date":
        this.isDefault = false;
        const foundItem = this.props.deliveryPeriods.filter(
          d => d.cashBidId === parseFloat(selectedOption.key),
        )[0];
        if (foundItem) {
          this.props.changeDeliveryEndDate(foundItem.deliveryPeriod.end, foundItem.cashBidId);
        } else {
          this.props.changeDeliveryEndDate("", 0);
        }
        break;
      default:
        break;
    }
  };

  private readonly redrawChart = () => {
    this.isDefault = true;
    this.setState({ location: this.props.location, commodity: this.props.commodity });
    this.props.changeAdditionalOptions(this.state.additionalOptions);
    const timestamp = moment(new Date())
      .valueOf()
      .toString();

    const props = {
      cashBidId: this.props.cashBidId,
      siteId: this.props.siteId,
      range: this.props.range,
      locationId: this.props.locationId,
      commodityId: this.props.commodityId,
    };
    this.props.setRedrawChartTime(timestamp, JSON.stringify(props));

    this.props.redrawCashBidsData(
      this.props.cashBidId,
      this.props.duration,
      this.props.siteId,
      this.props.range,
    );
  };
}
