import * as React from "react";
import {
  Consumer as I18nConsumer,
  Provider as I18nProvider,
  t as translationFunction,
} from "../../../i18n";
import { SetErrorMessage, FetchBasicCashBidsData, ChangeCashBidId } from "../../../store";
import styled, { ThemeProvider, ThemeProp } from "../../../styled-components";
import LoadingIndicator from "../../components/loader";
import ChartComponent from "../../components/chart";
import ErrorContainer from "../../components/error-container";
import { CashBidChartData } from "../../../interfaces";

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
  ) => FetchBasicCashBidsData;
  readonly loading: boolean;
  readonly error?: string;
  readonly setErrorMessage: (error: string) => SetErrorMessage;
  readonly changeCashBidId: (cashBidId: number) => ChangeCashBidId;
}

export interface State {
  readonly widgetContainerWidth: number;
}

export default class IndexView extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  constructor(props: Props, state: State) {
    super(props, state);
    this.state = { widgetContainerWidth: 0 };
  }

  private widgetContainerRef: any;

  componentDidMount(): void {
    this.props.fetchBasicCashBids(this.props.cashBidId, this.props.duration, this.props.siteId);
    this.setState({ widgetContainerWidth: this.widgetContainerRef.clientWidth });
    window.addEventListener("resize", this.handleWidgetResize);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.cashBidId !== this.props.cashBidId) {
      this.props.fetchBasicCashBids(nextProps.cashBidId, this.props.duration, this.props.siteId);
      this.setState({ widgetContainerWidth: this.widgetContainerRef.clientWidth });
    }
  }

  componentWillUnmount(): void {
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
      return (
        <ChartComponent
          widgetWidth={this.state.widgetContainerWidth}
          chartData={this.trimLastNullTick(this.props.chartData)}
          location={this.props.location}
          commodity={this.props.commodity}
          updatedAt={this.props.updatedAt}
          deliveryEndDate={this.props.deliveryEndDate}
          symbol={this.props.symbol}
          isBasis3YrAvgNull={fieldsResult.basis3YrAvg === ""}
          isCashPrice3YrAvgNull={fieldsResult.cashPrice3YrAvg === ""}
          showCurrentBasis={this.props.showCurrentBasis}
          show3YearAverageBasis={this.props.show3YearAverageBasis}
          show3YearAverageCashPrice={this.props.show3YearAverageCashPrice}
        />
      );
    }
  };
}
