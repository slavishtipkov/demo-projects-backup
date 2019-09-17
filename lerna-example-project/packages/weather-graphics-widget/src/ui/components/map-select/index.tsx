import * as React from "react";
import * as ReactDOM from "react-dom";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import styled, {
  ThemeProvider,
  ThemeProp,
  StyledComponentClass,
  css,
} from "../../../styled-components";
import { MapsConfigInterface } from "../../../interfaces";
/**
 * Styles
 */

export const DropdownWrapper = styled.div`
  font-family: Arial;
  font-size: 14px;
  position: relative;
  width: 100%;
  margin: 4px 0 0 0;
`;

export const DropdownHeader = styled.div`
  padding-left: 10px;
  display: block;
  color: #797979;
  cursor: pointer;
  font-family: Arial;
  font-size: 12px;
`;

export const DropdownToggle = styled.div`
  cursor: pointer;
  color: #303030;
  background-color: #ffffff;
  border: none;
  border-bottom: 1px solid #d5d5d6;
  border-right: 1px solid #d5d5d6;
  padding: 5px 5px 5px 10px;
  line-height: 1.5;
  font-size: 14px;
  width: 100%;
  outline: 0;
  text-align: left;
  text-transform: capitalize;

  &:focus {
    outline: 0;
  }

  &::after {
    display: inline-block;
    width: 0;
    height: 0;
    color: #747474;
    float: right;
    margin-right: 5px;
    margin-top: 9px;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }
`;

export const DropdownContainer = styled<{ readonly expanded: boolean }, "ul">("ul")`
  list-style-type: none;
  position: absolute;
  z-index: 2;
  top: 14px;
  left: 0;
  padding: 0 0 0 0;
  margin: 0;
  box-shadow: 0 0 10px #f1f1f1;
  background-color: #ffffff;
  width: 100%;
  display: none;
  max-height: 180px;
  overflow-y: auto;

  ${({ expanded }) =>
    expanded &&
    css`
      display: block;
    `};
`;

export const DropdownItem = styled<{ readonly active: boolean }, "li">("li")`
  display: block;
  width: 100%;
  padding: 7px 10px;
  font-weight: 400;
  color: #303030;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  box-sizing: border-box;
  cursor: pointer;

  ${({ active }) =>
    active &&
    css`
      background-color: #f1f1f1;
    `};

  &:hover {
    background-color: rgba(0, 147, 208, 0.1);
  }
`;

export interface Props {
  // Properties
  readonly theme?: ThemeProp;
  readonly maps: MapsConfigInterface;
  readonly defaultMap?: string;
  // Functions
  readonly handleActiveMapChange: (selectedMap: string) => void;
}

export interface State {
  // Properties
  readonly isDropdownExpanded: boolean;
}

export default class MapSelect extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};
  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      isDropdownExpanded: false,
    };
  }

  private dropdownRef: any;

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
          <div>
            {/* tslint:disable-next-line:jsx-no-lambda */}
            <DropdownWrapper innerRef={comp => (this.dropdownRef = comp)}>
              <DropdownHeader onClick={this.toggleIsDropdownExpanded}>
                {t("widget.header")}
              </DropdownHeader>
              <DropdownToggle onClick={this.toggleIsDropdownExpanded}>
                {this.props.defaultMap}
              </DropdownToggle>
              <DropdownContainer expanded={this.state.isDropdownExpanded}>
                {this.generateMapOptions()}
              </DropdownContainer>
            </DropdownWrapper>
          </div>
        )}
      </I18nConsumer>
    );
  }

  toggleIsDropdownExpanded = () => {
    this.setState({ isDropdownExpanded: !this.state.isDropdownExpanded });
  };

  changeActiveMap = (map: string) => {
    this.props.handleActiveMapChange(map);
    this.toggleIsDropdownExpanded();
  };

  private readonly handleClickOutside = (event: any) => {
    const dropdownNode = ReactDOM.findDOMNode(this.dropdownRef);
    if (dropdownNode && !dropdownNode.contains(event.target) && this.state.isDropdownExpanded) {
      this.setState({ isDropdownExpanded: false });
    }
  };

  private readonly generateMapOptions = () => {
    return Object.keys(this.props.maps)
      .filter(key => this.props.maps[key])
      .map((key: string, index: number) => {
        return (
          // tslint:disable-next-line:jsx-key
          <DropdownItem
            key={index}
            active={key === this.props.defaultMap}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => this.changeActiveMap(key)}
          >
            {`${key}`}
          </DropdownItem>
        );
      });
  };
}
