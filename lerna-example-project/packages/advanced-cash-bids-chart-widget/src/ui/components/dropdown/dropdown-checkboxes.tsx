import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import styled, { css } from "../../../styled-components";

export const DropdownWrapper = styled.div`
  font-family: Arial;
  font-size: 14px;
  position: relative;
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
  height: 35px;

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

export interface DropdownContainerPros {
  readonly expanded: boolean;
}

export const DropdownContainer = styled<DropdownContainerPros, "ul">("ul")`
  list-style-type: none;
  position: absolute;
  z-index: 10;
  top: 40px;
  left: 0;
  padding: 5px 0 5px 5px !important;
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

export interface DropdownItemPros {
  readonly active: boolean;
}

export const DropdownItem = styled<DropdownItemPros, "li">("li")`
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

export const CheckboxContainer = styled.div`
  margin: 10px 5px;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  width: 100%;

  input[type="checkbox"] {
    opacity: 0;
    z-index: -1;
    position: absolute;
  }

  label {
    position: relative;
    cursor: pointer;
    padding-left: 25px;
    color: #5e5e60;
    display: flex;
    word-break: break-word;
    word-wrap: break-word;

    &::before {
      content: "";
      background-color: transparent;
      border: 2px solid #5e5e60;
      border-radius: 3px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0 -15px 10px -12px rgba(0, 0, 0, 0.05);
      display: inline-block;
      position: absolute;
      width: 16px;
      height: 16px;
      cursor: pointer;
      top: 0;
      left: 0;
    }
  }

  input[type="checkbox"]:checked + label::after {
    content: "";
    display: block;
    position: absolute;
    top: 2px;
    left: 6px;
    width: 5px;
    height: 10px;
    border: solid #5e5e60;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

export interface DropdownCheckboxOption {
  readonly key: string;
  readonly value: boolean;
}

export interface Props {
  readonly dropdownName: string;
  readonly isDropdownExpanded: boolean;
  readonly options: ReadonlyArray<DropdownCheckboxOption>;
  readonly initialStates: any;
  //readonly selectedOption?: string;
  readonly label: string;
  readonly toggleDropdown: (dropdownName: string) => void;
  readonly changeSelectedOption: (
    dropdownName: string,
    options: ReadonlyArray<DropdownCheckboxOption>,
  ) => void;
}

export interface State {
  readonly isDropdownExpanded: boolean;
  readonly selectedOption: string;
}

export default class DropdownCheckboxesComponent extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      isDropdownExpanded: false,
      selectedOption:
        this.props.options.filter(o => o.value).length > 0
          ? `${this.props.options.filter(o => o.value).length} Selected`
          : "No Selections",
    };
  }

  render(): JSX.Element {
    return (
      <I18nConsumer>
        {({ t }) => (
          <div>
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
                {this.state.selectedOption}
              </DropdownToggle>

              <DropdownContainer expanded={this.props.isDropdownExpanded}>
                {this.props.options.map((option: DropdownCheckboxOption) => {
                  if (option.key && this.props.initialStates[option.key]) {
                    return (
                      // tslint:disable-next-line:jsx-no-lambda
                      <CheckboxContainer onClick={() => this.changeSelectedValue(option)}>
                        <input
                          type="checkbox"
                          name={option.key}
                          checked={option.value}
                          // tslint:disable-next-line:jsx-no-lambda
                          onChange={() => this.changeSelectedValue(option)}
                        />
                        <label htmlFor={option.key}>{t(`common.labels.${option.key}`)}</label>
                      </CheckboxContainer>
                    );
                  }
                })}
              </DropdownContainer>
            </DropdownWrapper>
          </div>
        )}
      </I18nConsumer>
    );
  }

  private changeSelectedValue(option: DropdownCheckboxOption): void {
    const options: any = [...this.props.options];

    options.map((o: DropdownCheckboxOption, index: number) => {
      if (o.key === option.key) {
        options[index].value = !option.value;
      }
    });
    this.props.changeSelectedOption(this.props.dropdownName, options);
    this.setState({
      selectedOption:
        options.filter((o: DropdownCheckboxOption) => o.value).length > 0
          ? `${options.filter((o: DropdownCheckboxOption) => o.value).length} Selected`
          : "No Selections",
    });
  }
}
