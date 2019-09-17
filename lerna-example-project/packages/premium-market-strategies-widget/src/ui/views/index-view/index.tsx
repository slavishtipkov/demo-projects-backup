import { Units } from "@dtn/i18n-lib";
import * as React from "react";
import { Consumer as I18nConsumer, t as translate } from "../../../i18n";
import { SixFactorsMarketStrategies, SixFactorsMarketsText } from "../../../interfaces";
import {
  FetchMarketStrategies,
  FetchPremiumMarketStrategiesRequest,
  SetErrorMessage,
  FetchCharts,
} from "../../../store";
import styled, { ThemeProvider, ThemeProp } from "../../../styled-components";
import { Commodities } from "@dtn/api-lib";
import LoadingIndicator from "../../components/loader";
import ErrorContainer from "../../components/error-container";
import StrategiesSnapshot from "../../components/list/strategies-snapshot";
import SixFactorsView from "../../components/list/six-factors-view";
import MoreInformation from "../../components/list/more-information";
import HistoricalRecap from "../../components/list/historical-recap";
import * as ReactDOM from "react-dom";
import { ContentTexts } from "@dtn/api-lib";

let Reset = styled.div`
  h1 {
    margin: 0;
  }
`;

const WidgetWrapper = styled("div")`
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  border: 1px solid #bfbfbf;
  background: #ffffff;
  text-align: left;
  color: #5a5a5c;
`;

export interface Props {
  readonly theme?: ThemeProp;
  readonly units?: string;
  readonly loading: boolean;
  readonly error?: string;
  readonly user: string;
  readonly widgetName: string;
  readonly defaultCommodity: Commodities;
  readonly showCommodities?: boolean | ReadonlyArray<Commodities>;
  readonly marketStrategiesData: SixFactorsMarketStrategies;
  readonly hasSuccessPremiumRequest: boolean;
  readonly commodities: ReadonlyArray<Commodities>;
  readonly charts: ReadonlyArray<{ readonly url: string; readonly id: string }>;
  readonly moreInformationTexts: ReadonlyArray<SixFactorsMarketsText>;
  readonly fetchMarketStrategies: (commodity: Commodities) => FetchMarketStrategies;
  readonly fetchPremiumMarketStrategiesRequest: (
    user: string,
    widgetName: string,
    commodity: Commodities,
    units?: string,
  ) => FetchPremiumMarketStrategiesRequest;
  readonly setErrorMessage: (error: string) => SetErrorMessage;
  readonly fetchCharts: (marketStrategyId: string, chartIds: ReadonlyArray<string>) => FetchCharts;
}

export interface StateProps {
  readonly widgetContainerWidth: number;
  readonly isSixFactorsViewExpanded: boolean;
  readonly isHistoricalRecapExpanded: boolean;
  readonly isMoreInformationExpanded: boolean;
}

export default class IndexView extends React.Component<Props, StateProps> {
  static defaultProps: Partial<Props> = {};

  constructor(props: Props) {
    super(props);
    this.state = {
      widgetContainerWidth: 0,
      isSixFactorsViewExpanded: false,
      isHistoricalRecapExpanded: false,
      isMoreInformationExpanded: false,
    };
  }

  private widgetContainerRef: any;

  componentDidMount(): void {
    if (!this.props.hasSuccessPremiumRequest) {
      this.props.fetchPremiumMarketStrategiesRequest(
        this.props.user,
        this.props.widgetName,
        this.props.defaultCommodity,
        this.props.units ? this.props.units : Units.IMPERIAL,
      );
    } else {
      this.props.fetchMarketStrategies(this.props.defaultCommodity);
    }

    this.handleWidgetResize();
    window.addEventListener("resize", this.handleWidgetResize);
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.handleWidgetResize);
  }

  render(): JSX.Element {
    if (this.props.loading) {
      return <LoadingIndicator />;
    } else if (this.props.error) {
      return <ErrorContainer error={this.props.error} />;
    } else {
      const dropdawnOptions = this.props.commodities.map(commodity => ({
        key: commodity,
        value: commodity,
      }));

      return (
        <I18nConsumer>
          {({ t }) => (
            <Reset>
              <ThemeProvider theme={this.props.theme}>
                {/* tslint:disable-next-line:jsx-no-lambda */}
                <WidgetWrapper innerRef={(ref: any) => (this.widgetContainerRef = ref)}>
                  {this.props.marketStrategiesData && (
                    <div>
                      <StrategiesSnapshot
                        dropdownOptions={dropdawnOptions}
                        marketStrategiesData={this.props.marketStrategiesData}
                        defaultCommodity={this.props.defaultCommodity}
                        fetchMarketStrategies={this.props.fetchMarketStrategies}
                        width={this.state.widgetContainerWidth}
                        showCommodities={this.props.showCommodities as boolean}
                      />
                      <SixFactorsView
                        marketStrategiesData={this.props.marketStrategiesData}
                        charts={this.props.charts}
                        isExpanded={this.state.isSixFactorsViewExpanded}
                        toggleExpand={this.toddleExpand}
                      />
                      <HistoricalRecap
                        marketStrategiesData={this.props.marketStrategiesData}
                        isExpanded={this.state.isHistoricalRecapExpanded}
                        toggleExpand={this.toddleExpand}
                      />
                      <MoreInformation
                        moreInformationTexts={this.props.moreInformationTexts}
                        width={this.state.widgetContainerWidth}
                        isExpanded={this.state.isMoreInformationExpanded}
                        toggleExpand={this.toddleExpand}
                      />
                    </div>
                  )}
                </WidgetWrapper>
              </ThemeProvider>
            </Reset>
          )}
        </I18nConsumer>
      );
    }
  }

  private readonly setError = (err: string) => {
    this.props.setErrorMessage(err);
  };

  private readonly handleWidgetResize = () => {
    this.setState({ widgetContainerWidth: this.widgetContainerRef.clientWidth });
  };

  private readonly toddleExpand = (containerName: string) => {
    switch (containerName) {
      case "sixFactorsView":
        this.setState({
          isSixFactorsViewExpanded: !this.state.isSixFactorsViewExpanded,
          isHistoricalRecapExpanded: false,
          isMoreInformationExpanded: false,
        });
        break;
      case "historicalRecap":
        this.setState({
          isHistoricalRecapExpanded: !this.state.isHistoricalRecapExpanded,
          isSixFactorsViewExpanded: false,
          isMoreInformationExpanded: false,
        });
        break;
      case "moreInformation":
        this.setState({
          isMoreInformationExpanded: !this.state.isMoreInformationExpanded,
          isSixFactorsViewExpanded: false,
          isHistoricalRecapExpanded: false,
        });
        break;
      default:
        break;
    }
  };
}
