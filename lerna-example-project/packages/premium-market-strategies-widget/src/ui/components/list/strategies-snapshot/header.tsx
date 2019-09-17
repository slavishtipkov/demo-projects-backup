import * as React from "react";
import * as ReactDOM from "react-dom";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import styled from "../../../../styled-components";
import DropdownComponent from "../../common/dropdown";
import { DropdownOption } from "../../../components/common/dropdown";
import { SixFactorsMarketStrategies } from "../../../../interfaces";
import { MOBILE_WIDTH } from "../../../../constants";
import { FetchMarketStrategies } from "../../../../store";
import * as moment from "moment-timezone";
import { Commodities } from "@dtn/api-lib";

export interface WrapperProps {
  readonly width: number;
}

const Wrapper = styled<WrapperProps, "div">("div")`
  border-bottom: 1px solid #bfbfbf;
  background: #ffffff;
  text-align: left;
  display: flex;
  height: ${({ width }) => (width <= MOBILE_WIDTH ? "auto" : "50px")};
  flex-direction: ${({ width }) => (width <= MOBILE_WIDTH ? "column" : "row")};

  .dropdown-container {
    height: auto;
    border-bottom: none;
    min-width: 150px;
    display: flex;
    align-items: center;
  }

  .dropdown-btn {
    height: 100%;
    border-bottom: none;
  }

  .dropdown-item,
  .dropdown-btn,
  .dropdown-btn::after {
    color: #5a5a5c;
  }
`;

const HeaderText = styled<WrapperProps, "div">("div")`
  flex-grow: 1;
  border-right: ${({ width }) => (width <= MOBILE_WIDTH ? "none" : "1px solid #bfbfbf")};
  border-bottom: ${({ width }) => width <= MOBILE_WIDTH && "1px solid #bfbfbf"};
  display: flex;
  flex-direction: ${({ width }) => (width <= MOBILE_WIDTH ? "row" : "column")};
  justify-content: ${({ width }) => width <= MOBILE_WIDTH && "space-between"};
  align-items: ${({ width }) => width <= MOBILE_WIDTH && "cebter"};
  padding: 8px 10px;

  > div > .heading {
    font-size: 16px;
    color: #5a5a5c;
    padding-bottom: 2px;
  }

  > div > .subheading {
    font-size: 12px;
    color: #afafb0;
  }
`;

const LogoContainer = styled<WrapperProps, "div">("div")`
  padding: ${({ width }) => (width <= MOBILE_WIDTH ? "0" : "13px 15px")};
  border-left: ${({ width }) => (width <= MOBILE_WIDTH ? "none" : "1px solid #bfbfbf")};

  .dtn {
    height: 20px;
  }
`;

export interface Props {
  readonly dropdownOptions: ReadonlyArray<DropdownOption>;
  readonly marketStrategiesData: SixFactorsMarketStrategies;
  readonly defaultCommodity: Commodities;
  readonly width: number;
  readonly showCommodities: boolean;
  readonly fetchMarketStrategies: (commodity: Commodities) => FetchMarketStrategies;
}

export interface State {
  readonly isExpanded: boolean;
  readonly isCommodityDropdownExpanded: boolean;
  readonly selectedCommodityOption: DropdownOption;
}

export default class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isExpanded: true,
      isCommodityDropdownExpanded: false,
      selectedCommodityOption: {
        key: this.props.defaultCommodity,
        value: this.props.defaultCommodity,
      },
    };
  }

  private commoditiesRef: any;

  componentDidMount(): void {
    const event = "ontouchstart" in window ? "touchstart" : "click";
    document.addEventListener(event, this.handleClickOutside);
  }

  componentWillUnmount(): void {
    const event = "ontouchstart" in window ? "touchstart" : "click";
    document.removeEventListener(event, this.handleClickOutside);
  }

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <Wrapper width={this.props.width}>
            <HeaderText width={this.props.width}>
              <div>
                <div className="heading">{t("labels.dtnMarketStrategies")}</div>
                <div className="subheading">
                  {t("common.updated")}{" "}
                  {moment(this.props.marketStrategiesData.latestPublishDate).format("MMMM D, YYYY")}
                </div>
              </div>
              {this.props.width <= MOBILE_WIDTH && (
                <LogoContainer width={this.props.width}>
                  <img
                    className="dtn"
                    src="https://www.dtn.com/wp-content/uploads/2018/11/logo-dtn.png"
                  />
                </LogoContainer>
              )}
            </HeaderText>
            <DropdownComponent
              // tslint:disable-next-line:jsx-no-lambda
              ref={(comp: any) => (this.commoditiesRef = comp)}
              dropdownName={"selectedCommodity"}
              isDropdownExpanded={this.state.isCommodityDropdownExpanded}
              options={this.props.dropdownOptions}
              toggleDropdown={this.handleToggleDropdown}
              selectedOption={this.state.selectedCommodityOption}
              changeSelectedOption={this.handleDropdownOptionChange}
              width={this.props.width}
              showCommodities={this.props.showCommodities}
            />
            {this.props.width > MOBILE_WIDTH && (
              <LogoContainer width={this.props.width}>
                <img
                  className="dtn"
                  src="https://www.dtn.com/wp-content/uploads/2018/11/logo-dtn.png"
                />
              </LogoContainer>
            )}
          </Wrapper>
        )}
      </I18nConsumer>
    );
  }

  private readonly handleToggleDropdown = () => {
    this.setState({
      isCommodityDropdownExpanded: !this.state.isCommodityDropdownExpanded,
    });
  };

  private readonly handleDropdownOptionChange = (selectedOption: DropdownOption) => {
    this.setState({
      selectedCommodityOption: selectedOption,
    });
    this.props.fetchMarketStrategies(selectedOption.value as Commodities);
  };

  private readonly handleClickOutside = (event: any) => {
    const commoditiesDropdownNode = ReactDOM.findDOMNode(this.commoditiesRef);
    if (commoditiesDropdownNode) {
      if (!commoditiesDropdownNode.contains(event.target)) {
        this.setState({
          isCommodityDropdownExpanded: false,
        });
      }
    }
  };
}
