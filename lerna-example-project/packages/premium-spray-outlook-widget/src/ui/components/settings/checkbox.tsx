import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import styled, {
  ThemeProvider,
  ThemeProp,
  StyledComponentClass,
  css,
} from "../../../styled-components";

/**
 * Styles
 */

export interface CheckboxContainerProps {
  readonly isFullWidth?: boolean;
}

export const CheckboxContainer = styled<CheckboxContainerProps, "div">("div")`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  display: inline-block;
  width: ${({ isFullWidth }) => (isFullWidth ? "100%" : "60%")};

  input[type="checkbox"] {
    opacity: 0;
    z-index: -1;
    position: absolute;
  }

  label {
    position: relative;
    cursor: pointer;
    padding-left: 25px;
    color: #59595b;
    font-size: 16px;
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

export interface Props {
  // Properties
  readonly name: string;
  readonly isChecked: boolean;
  readonly label: string;
  readonly isFullWidth?: boolean;
  // Functions
  readonly toggleIsChecked: (isChecked: string) => void;
}

export interface State {
  readonly isChecked: boolean;
}

export default class CheckboxComponent extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  render(): JSX.Element {
    let { props } = this;
    return (
      <I18nConsumer>
        {({ t }) => (
          <CheckboxContainer
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => this.props.toggleIsChecked(this.props.name)}
            isFullWidth={this.props.isFullWidth}
          >
            <input
              type="checkbox"
              checked={this.props.isChecked}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={() => this.onChange()}
            />
            <label className="checkbox-label">{t(this.props.label)}</label>
          </CheckboxContainer>
        )}
      </I18nConsumer>
    );
  }

  onChange(): void {
    this.props.toggleIsChecked(this.props.name);
  }
}
