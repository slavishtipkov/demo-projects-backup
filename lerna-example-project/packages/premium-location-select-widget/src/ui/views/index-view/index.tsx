import { Units } from "@dtn/i18n-lib";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import { Station } from "../../../interfaces";
import styled, {
  ThemeProvider,
  ThemeProp,
  StyledComponentClass,
  css,
} from "../../../styled-components";
import { ERRORS } from "../../../constants";
import {
  SelectSelectedStationAction,
  SetErrorMessageAction,
  SetIsDropdownExpandedAction,
  RemoveSelectedStation,
} from "../../../store";
import ErrorContainer from "../../components/error-container";
/**
 * Styles
 */

export const DropdownWrapper = styled.div`
  font-family: Arial;
  font-size: 14px;
  position: relative;
  width: 100%;
  padding: 10px 0;
  background: #ffffff;
  text-align: left;
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
  border-bottom: 1px solid #cccccc;
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
  top: 17px;
  left: 0;
  padding: 0 0 0 0;
  margin: 0;
  box-shadow: 0 0 10px #f1f1f1;
  background-color: #ffffff;
  width: 100%;
  display: none;

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
  readonly isDropdownExpanded: boolean;
  readonly stations: ReadonlyArray<Station>;
  readonly selectedStation: Station;
  readonly loading: boolean;
  readonly error?: string;
  readonly user: string;
  readonly widgetName: string;
  // Functions
  readonly setSelectedStation: (selectedStation: Station) => SelectSelectedStationAction;
  readonly setIsDropdownExpanded: (isDropdownExpanded: boolean) => SetIsDropdownExpandedAction;
  readonly setErrorMessage: (error: string) => SetErrorMessageAction;
  readonly removeSelectedStation: () => RemoveSelectedStation;
}

export default class IndexView extends React.Component<Props> {
  static defaultProps: Partial<Props> = {};
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
    const selectedOptionStation = this.props.stations.find(
      s => s.stationId === this.props.selectedStation.stationId,
    );
    let selectedStation: Station =
      this.props.selectedStation && selectedOptionStation
        ? selectedOptionStation
        : { stationId: "", displayName: "" };

    if (this.props.error) {
      return <ErrorContainer error={this.props.error} />;
    } else {
      return (
        <I18nConsumer>
          {({ t }) => (
            <div data-testid="location-select-view">
              {/* tslint:disable-next-line:jsx-no-lambda */}
              <DropdownWrapper innerRef={comp => (this.dropdownRef = comp)}>
                <DropdownHeader onClick={this.toggleIsDropdownExpanded}>
                  {t("widget.header")}
                </DropdownHeader>
                <DropdownToggle onClick={this.toggleIsDropdownExpanded}>
                  {selectedStation.displayName === ""
                    ? t("widget.selectLocation")
                    : selectedStation.displayName}
                </DropdownToggle>
                <DropdownContainer expanded={this.props.isDropdownExpanded}>
                  {this.props.stations.map((station: Station, index: number) => (
                    <DropdownItem
                      key={`${station.stationId}-${index}`}
                      // tslint:disable-next-line:jsx-no-lambda
                      onClick={() => {
                        this.changeSelectedStation(station);
                      }}
                      active={selectedStation.stationId === station.stationId}
                    >
                      {station.displayName}
                    </DropdownItem>
                  ))}
                </DropdownContainer>
              </DropdownWrapper>
            </div>
          )}
        </I18nConsumer>
      );
    }
  }

  toggleIsDropdownExpanded = () => {
    this.props.setIsDropdownExpanded(!this.props.isDropdownExpanded);
  };

  changeSelectedStation = (station: Station) => {
    this.props.setSelectedStation(station);
    this.toggleIsDropdownExpanded();
  };

  private readonly setError = (err: string) => {
    this.props.setErrorMessage(err);
  };

  private readonly handleClickOutside = (event: any) => {
    const dropdownNode = ReactDOM.findDOMNode(this.dropdownRef);
    if (dropdownNode && !dropdownNode.contains(event.target) && this.props.isDropdownExpanded) {
      this.props.setIsDropdownExpanded(false);
    }
  };
}
