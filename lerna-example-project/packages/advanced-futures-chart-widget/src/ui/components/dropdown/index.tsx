import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import styled, {
  ThemeProvider,
  ThemeProp,
  StyledComponentClass,
  css,
} from "../../../styled-components";
import { INTERVALS_DICTIONARY } from "../../../constants";
/**
 * Styles
 */

export const DropdownWrapper = styled.div`
  font-family: Arial;
  font-size: 14px;
  position: relative;
  width: 100%;
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
  font-weight: bold;
  width: 100%;
  outline: 0;
  text-align: left;

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
  z-index: 10;
  top: 0;
  left: 0;
  padding: 14px 0 0 0;
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
  font-weight: bold;
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

export interface DropdownOption {
  readonly key: string;
  readonly value: string;
}

export interface Props {
  // Properties
  readonly dropdownName: string;
  readonly isDropdownExpanded: boolean;
  readonly options: ReadonlyArray<DropdownOption>;
  readonly selectedOption?: DropdownOption;
  readonly label: string;
  readonly toggleDropdown: (dropdownName: string) => void;
  readonly changeSelectedOption: (dropdownName: string, selectedOption: DropdownOption) => void;
  // Functions
}

export interface State {
  readonly isDropdownExpanded: boolean;
  readonly selectedOption: undefined;
}

export default class DropdownComponent extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  render(): JSX.Element {
    let { props } = this;
    let selectedOption: DropdownOption = this.props.selectedOption
      ? this.props.selectedOption
      : this.props.options[0];

    return (
      <I18nConsumer>
        {({ t }) => (
          <div data-testid="location-select-view">
            <DropdownWrapper>
              {/* tslint:disable-next-line:jsx-no-lambda */}
              <DropdownHeader onClick={() => this.props.toggleDropdown(this.props.dropdownName)}>
                {t(this.props.label)}
              </DropdownHeader>
              <DropdownToggle
                className="dropdown-btn"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => this.props.toggleDropdown(this.props.dropdownName)}
              >
                {selectedOption.value}
              </DropdownToggle>
              <DropdownContainer expanded={this.props.isDropdownExpanded}>
                {this.props.options.map((option: DropdownOption) => (
                  <DropdownItem
                    key={option.key}
                    active={
                      selectedOption.key.toLowerCase() === option.key.toLowerCase() ||
                      (INTERVALS_DICTIONARY[selectedOption.key.toLowerCase()] &&
                        INTERVALS_DICTIONARY[selectedOption.key.toLowerCase()].key === option.key)
                    }
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => this.changeSelectedValue(option)}
                  >
                    {option.value}
                  </DropdownItem>
                ))}
              </DropdownContainer>
            </DropdownWrapper>
          </div>
        )}
      </I18nConsumer>
    );
  }

  private changeSelectedValue(selected: DropdownOption): void {
    this.props.changeSelectedOption(this.props.dropdownName, selected);
    this.props.toggleDropdown(this.props.dropdownName);
  }
}
