import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import {
  FetchZipCodeDataAction,
  ZipCodeInputErrorAction,
  GetZipCode,
  RemoveZipCodeValue,
} from "../../../store";
import styled, { ThemeProvider, ThemeProp } from "../../../styled-components";
import Icon from "../../components/icons/";
import { ERRORS } from "../../../constants";
import { CoordinatesForZipCode } from "../../../interfaces";
import * as ReactDOM from "react-dom";

let ZipInput = styled.input.attrs({
  type: "text",
})`
  border: none;
  height: 30px;
  font-size: 15px;
  padding: 0 0 0 2px;
  width: 100%;
  color: #003764;
  font-weight: 600;
  position: relative;
  top: -2px;

  :focus {
    outline: 0;
  }

  ::placeholder {
    color: #dadada;
    opacity: 1;
    font-weight: normal;
  }

  :-ms-input-placeholder {
    color: #dadada;
    font-weight: normal;
  }

  ::-ms-input-placeholder {
    color: #dadada;
    font-weight: normal;
  }
`;

const ZipCodeContainer = styled.div`
  padding: 20px 0;
  background: white;
  text-align: left;
`;

const SvgWrapper = styled.div`
  margin-top: 2px;
  cursor: pointer;
`;

const ZipCodeWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const LegendWrapper = styled.legend`
  font-size: 14px;
  color: #95989a;
`;

const FieldsetWrapper = styled.fieldset`
  border: 0.5px solid #bfbfbf;
  border-radius: 3px;
  padding: 0 12px;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  margin: 0;
`;

const ErrorMessage = styled.legend`
  font-size: 12px;
  padding-top: 5px;
  color: #ff4836;
  font-weight: 700;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  width: 100%;

  & > .error-wrapper {
    display: flex;

    & > .error-icon {
      padding-right: 3px;
    }
  }
`;

export interface Props {
  readonly zipCode: string;
  readonly error: string;
  readonly fetchZipCode: (zipCode: string) => FetchZipCodeDataAction;
  readonly handleInputZipCodeError: (errorMessage: string) => ZipCodeInputErrorAction;
  readonly getZipCodeByCoordinates: (coordinates: CoordinatesForZipCode) => GetZipCode;
  readonly removeZipCodeValue: () => RemoveZipCodeValue;
  readonly theme?: ThemeProp;
}

export interface State {
  readonly zipCodeInput: string;
}

export default class IndexView extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);

    this.state = {
      zipCodeInput: "",
    };
  }

  private zipInputRef: any;

  componentDidMount(): void {
    this.setState({ zipCodeInput: this.props.zipCode ? this.props.zipCode : "" });
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.zipCode !== this.state.zipCodeInput) {
      this.setState({ zipCodeInput: nextProps.zipCode ? nextProps.zipCode : "" });
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  render(): JSX.Element {
    const errorMessage = this.generateError();
    return (
      <I18nConsumer>
        {({ t }) => (
          <ThemeProvider theme={this.props.theme}>
            <ZipCodeContainer>
              <FieldsetWrapper>
                <LegendWrapper>{t("common.zipCodeLabel")}</LegendWrapper>
                <ZipCodeWrapper>
                  <ZipInput
                    // tslint:disable-next-line:jsx-no-lambda
                    innerRef={(comp: any) => (this.zipInputRef = comp)}
                    type="text"
                    onChange={this.handleZipCodeChange}
                    placeholder={t("common.zipCodePlaceholder")}
                    value={this.state.zipCodeInput}
                  />
                  <SvgWrapper onClick={this.handleFindLocationClick}>
                    <Icon icon="location" color={"#003764"} size={20} />
                  </SvgWrapper>
                </ZipCodeWrapper>
              </FieldsetWrapper>
              {errorMessage}
            </ZipCodeContainer>
          </ThemeProvider>
        )}
      </I18nConsumer>
    );
  }

  private readonly handleFindLocationClick = () => {
    this.props.fetchZipCode(this.state.zipCodeInput);
  };

  private readonly handleZipCodeChange = ($event: any) => {
    this.setState({ zipCodeInput: $event.target.value });
  };

  private readonly generateError = () => {
    if (this.props.error) {
      return (
        <I18nConsumer>
          {({ t }) => (
            <ErrorMessage>
              <div className="error-wrapper">
                <span className="error-icon">
                  <Icon icon="error" color={"#ff4836"} size={14} />
                </span>
                <span> {t(`common.error.${this.props.error}`)}</span>
              </div>
            </ErrorMessage>
          )}
        </I18nConsumer>
      );
    }
  };

  private readonly handleKeyUp = (event: any): void => {
    const dropdownNode = ReactDOM.findDOMNode(this.zipInputRef);
    const pressedKeyCode = event.keyCode ? event.keyCode : event.which;
    const enterKeyCode = 13;
    if (dropdownNode && dropdownNode.contains(event.target) && pressedKeyCode === enterKeyCode) {
      this.handleFindLocationClick();
    }
  };
}
