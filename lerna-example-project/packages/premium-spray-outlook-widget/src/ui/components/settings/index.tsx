import * as React from "react";
import * as ReactDOM from "react-dom";
import styled, { css } from "../../../styled-components";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../i18n";
import Icon from "../icons";
import FooterContainer from "../footer/index";
import CheckboxComponent from "./checkbox";
import DropdownComponent, { DropdownOption } from "./dropdown";
import { generateOptions } from "../../../store/utils";
import Error from "../error-container/index";
import { DEFAULT_DROPDOWN_SETTINGS, MAX_MIN_TEMP_SETTINGS } from "../../../constants";
import { SprayOutlookThresholds } from "@dtn/api-lib";
import { Units } from "@dtn/i18n-lib";

const SettingsWrapper = styled("div")`
  color: #59595b;
  border: 0.5px solid #d5d5d6;
`;

const SettingsHeader = styled("div")`
  display: flex;
  justify-content: space-between;
  border-bottom: 0.5px solid #bfbfbf;
  padding: 10px;
  align-items: center;
`;

const Header = styled("span")`
  color: #000000;
  opacity: 0.8;
  font-size: 18px;
`;

const ImageContainer = styled("div")`
  text-align: center;
  height: auto;
  overflow: hidden;
  cursor: pointer;
`;

const SettingsBody = styled("div")`
  padding: 10px;
  border-bottom: 1px solid #dfdfdf;

  .dropdown-container {
    width: 40%;
  }
`;

const Label = styled("div")`
  font-size: 12px;
  color: #4e4e4e;
  opacity: 0.8;
  margin-top: 15px;
`;

const Row = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;

const Container = styled("div")`
  margin: 15px 0;
`;

const SprayWindowWrapper = styled("div")`
  display: flex;
  align-items: center;
  width: 100%;

  span {
    margin-left: 10px;
    margin-top: 5px;
  }
`;

const SettingsActions = styled("div")`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InputWrapper = styled("div")`
  display: flex;
  align-items: center;
  width: 40%;
  color: #59595b;
  opacity: 0.8;
`;

const Input = styled("input")`
  width: 100%;
  flex: 1;
  border: 1px solid rgb(223, 223, 223);
  border-radius: 3px;
  margin-right: 5px;
  padding: 7px 5px;

  &:focus {
    outline: none;
  }

  &:disabled {
    background: rgb(241, 241, 241);
  }
`;

const Cancel = styled("div")`
  &:hover {
    cursor: pointer;
  }
`;

const ErrorWrapper = styled("div")`
  margin: -10px 0 15px 0;
`;

export interface ApplyButtonProps {
  readonly disabled?: boolean;
}

const ApplyButton = styled<ApplyButtonProps, "div">("div")`
  background: #00b355;
  color: white;
  padding: 8px 26px;
  border: none;
  border-radius: 3px;
  font-size: 14px;

  &:hover {
    cursor: pointer;
  }

  &:active,
  &:focus {
    outline: none;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.7;

      &:hover {
        cursor: default;
      }
    `};
`;

export interface Props {
  readonly observedAtTime?: Date;
  readonly units: Units;
  readonly thresholds: SprayOutlookThresholds;
  readonly defaultSettings: SprayOutlookThresholds;
  readonly changeSettingsState: () => void;
  readonly setThresholds: (thresholds: SprayOutlookThresholds) => void;
}

export interface State {
  readonly isMaxWindChecked: boolean;
  readonly isMinWindChecked: boolean;
  readonly isMaxTempChecked: boolean;
  readonly isMinTempChecked: boolean;
  readonly isTempInversionRiskChecked: boolean;
  readonly isDayTimeOnlyChecked: boolean;
  readonly isMaxWindDropdownExpanded: boolean;
  readonly isMinWindDropdownExpanded: boolean;
  readonly isSprayWindowDropdownExpanded: boolean;
  readonly isRainFreeDropdownExpanded: boolean;
  readonly maxWindDropdownSelectedOption: DropdownOption;
  readonly minWindDropdownSelectedOption: DropdownOption;
  readonly sprayWindowDropdownSelectedOption: DropdownOption;
  readonly rainFreeDropdownSelectedOption: DropdownOption;
  readonly maxTempInputValue?: number | boolean;
  readonly minTempInputValue?: number | boolean;
  readonly invalidFields: {
    readonly maxWind: {
      readonly invalid: boolean;
      readonly message: string;
    };
    readonly temp: {
      readonly invalid: boolean;
      readonly message: string;
    };
  };
}

export default class SettingsContainer extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      isMaxWindChecked: this.props.thresholds.windThresholdUpperLimit ? true : false,
      isMinWindChecked: this.props.thresholds.windThresholdLowerLimit ? true : false,
      isMaxTempChecked: this.props.thresholds.temperatureUpperLimit ? true : false,
      isMinTempChecked: this.props.thresholds.temperatureLowerLimit ? true : false,
      isTempInversionRiskChecked: this.props.thresholds.temperatureInversionRisk ? true : false,
      isDayTimeOnlyChecked: this.props.thresholds.daytimeOnlyApplication ? true : false,
      isMaxWindDropdownExpanded: false,
      isMinWindDropdownExpanded: false,
      isSprayWindowDropdownExpanded: false,
      isRainFreeDropdownExpanded: false,

      maxWindDropdownSelectedOption: {
        key: this.props.thresholds.windThresholdUpperLimit
          ? this.props.thresholds.windThresholdUpperLimit
          : this.props.defaultSettings.windThresholdUpperLimit,
        value: `${
          this.props.thresholds.windThresholdUpperLimit
            ? this.props.thresholds.windThresholdUpperLimit
            : this.props.defaultSettings.windThresholdUpperLimit
        } ${this.getUnit("windDir", this.props.units)}`,
      },
      minWindDropdownSelectedOption: {
        key: this.props.thresholds.windThresholdLowerLimit
          ? this.props.thresholds.windThresholdLowerLimit
          : this.props.defaultSettings.windThresholdLowerLimit,
        value: `${
          this.props.thresholds.windThresholdLowerLimit
            ? this.props.thresholds.windThresholdLowerLimit
            : this.props.defaultSettings.windThresholdLowerLimit
        } ${this.getUnit("windDir", this.props.units)}`,
      },
      sprayWindowDropdownSelectedOption: {
        key: this.props.thresholds.minimumSprayWindow,
        value: `${this.props.thresholds.minimumSprayWindow}`,
      },
      rainFreeDropdownSelectedOption: {
        key: this.props.thresholds.rainfreeForecastPeriod,
        value: `${
          this.props.thresholds.rainfreeForecastPeriod === 0
            ? "None"
            : this.props.thresholds.rainfreeForecastPeriod
        } ${
          this.props.thresholds.rainfreeForecastPeriod === 0
            ? ""
            : this.props.thresholds.rainfreeForecastPeriod === 1
            ? "hour"
            : "hours"
        }`,
      },
      maxTempInputValue: this.props.thresholds.temperatureUpperLimit
        ? this.props.thresholds.temperatureUpperLimit
        : this.props.defaultSettings.temperatureUpperLimit,
      minTempInputValue: this.props.thresholds.temperatureLowerLimit
        ? this.props.thresholds.temperatureLowerLimit
        : this.props.defaultSettings.temperatureLowerLimit,
      invalidFields: {
        maxWind: {
          invalid: false,
          message: "",
        },
        temp: {
          invalid: false,
          message: "",
        },
      },
    };
  }

  private maxWindRef: any;
  private minWindRef: any;
  private sprayWindowRef: any;
  private rainFreeRef: any;

  componentDidMount(): void {
    const event = "ontouchstart" in window ? "touchstart" : "click";
    document.addEventListener(event, this.handleClickOutside);
  }

  componentWillUnmount(): void {
    const event = "ontouchstart" in window ? "touchstart" : "click";
    document.removeEventListener(event, this.handleClickOutside);
  }

  render(): JSX.Element {
    const maxWindThresholdDropdownOptions: ReadonlyArray<DropdownOption> = generateOptions({
      ...DEFAULT_DROPDOWN_SETTINGS[this.props.units]["maxWindThresholdDropdownOptions"],
      unit: this.getUnit("windDir", this.props.units),
    });
    const minWindThresholdDropdownOptions: ReadonlyArray<DropdownOption> = generateOptions({
      ...DEFAULT_DROPDOWN_SETTINGS[this.props.units]["minWindThresholdDropdownOptions"],
      unit: this.getUnit("windDir", this.props.units),
    });
    const sprayWindowDropdownOptions: ReadonlyArray<DropdownOption> = generateOptions({
      ...DEFAULT_DROPDOWN_SETTINGS[this.props.units]["sprayWindowDropdownOptions"],
    });
    const rainFreeDropdownOptions: ReadonlyArray<DropdownOption> = generateOptions({
      ...DEFAULT_DROPDOWN_SETTINGS[this.props.units]["rainFreeDropdownOptions"],
      unit: "hour",
      hasNone: true,
    });

    return (
      <I18nConsumer>
        {({ t }) => (
          <div>
            <SettingsWrapper>
              <SettingsHeader>
                <Header>{t(`common.settings.header`)}</Header>
                {/* tslint:disable-next-line:jsx-no-lambda */}
                <ImageContainer onClick={() => this.props.changeSettingsState()}>
                  <Icon
                    wrapper={"common"}
                    icon={"close"}
                    color={"#59595B"}
                    width={"18px"}
                    height={"18px"}
                  />
                </ImageContainer>
              </SettingsHeader>

              <SettingsBody>
                {/* Wind Threshold */}
                <Label>{t(`common.settings.windThresholdsLabel`)}</Label>
                <Row>
                  <CheckboxComponent
                    name="maxWind"
                    isChecked={this.state.isMaxWindChecked}
                    label={"common.settings.upperLimit"}
                    toggleIsChecked={this.handleCheckboxToggle}
                  />
                  <DropdownComponent
                    // tslint:disable-next-line:jsx-no-lambda
                    ref={(comp: any) => (this.maxWindRef = comp)}
                    dropdownName="maxWind"
                    options={maxWindThresholdDropdownOptions}
                    toggleDropdown={this.handleToggleDropdown}
                    isDropdownExpanded={this.state.isMaxWindDropdownExpanded}
                    changeSelectedOption={this.handleDropdownOptionChange}
                    selectedOption={this.state.maxWindDropdownSelectedOption}
                    disabled={!this.state.isMaxWindChecked}
                  />
                </Row>
                <Row>
                  <CheckboxComponent
                    name="minWind"
                    isChecked={this.state.isMinWindChecked}
                    label={"common.settings.lowerLimit"}
                    toggleIsChecked={this.handleCheckboxToggle}
                  />
                  <DropdownComponent
                    // tslint:disable-next-line:jsx-no-lambda
                    ref={(comp: any) => (this.minWindRef = comp)}
                    dropdownName="minWind"
                    options={minWindThresholdDropdownOptions}
                    toggleDropdown={this.handleToggleDropdown}
                    isDropdownExpanded={this.state.isMinWindDropdownExpanded}
                    changeSelectedOption={this.handleDropdownOptionChange}
                    selectedOption={this.state.minWindDropdownSelectedOption}
                    disabled={!this.state.isMinWindChecked}
                  />
                </Row>
                {this.state.invalidFields.maxWind.invalid && (
                  <ErrorWrapper>
                    <Error error={this.state.invalidFields.maxWind.message} />
                  </ErrorWrapper>
                )}

                {/* Temperature */}
                <Label>{t(`common.settings.temperatureLabel`)}</Label>
                <Row>
                  <CheckboxComponent
                    name="maxTemp"
                    isChecked={this.state.isMaxTempChecked}
                    label={"common.settings.upperLimit"}
                    toggleIsChecked={this.handleCheckboxToggle}
                  />
                  <InputWrapper>
                    <Input
                      type="text"
                      value={`${this.state.maxTempInputValue ? this.state.maxTempInputValue : ""}`}
                      // tslint:disable-next-line:jsx-no-lambda
                      onChange={e => this.validateMaxTemp(e)}
                      disabled={!this.state.isMaxTempChecked}
                    />
                    <span>{`${String.fromCharCode(176)}${this.getUnit(
                      "temp",
                      this.props.units,
                    )}`}</span>
                  </InputWrapper>
                </Row>
                <Row>
                  <CheckboxComponent
                    name="minTemp"
                    isChecked={this.state.isMinTempChecked}
                    label={"common.settings.lowerLimit"}
                    toggleIsChecked={this.handleCheckboxToggle}
                  />
                  <InputWrapper>
                    <Input
                      type="text"
                      value={`${this.state.minTempInputValue ? this.state.minTempInputValue : ""}`}
                      // tslint:disable-next-line:jsx-no-lambda
                      onChange={e => this.validateMinTemp(e)}
                      disabled={!this.state.isMinTempChecked}
                    />
                    <span>{`${String.fromCharCode(176)}${this.getUnit(
                      "temp",
                      this.props.units,
                    )}`}</span>
                  </InputWrapper>
                </Row>
                {this.state.invalidFields.temp.invalid && (
                  <ErrorWrapper>
                    <Error error={this.state.invalidFields.temp.message} />
                  </ErrorWrapper>
                )}

                {/* Minimum Spray Window */}
                <Label>{t(`common.settings.minSprayWindowLabel`)}</Label>
                <Row>
                  <SprayWindowWrapper>
                    <DropdownComponent
                      // tslint:disable-next-line:jsx-no-lambda
                      ref={(comp: any) => (this.sprayWindowRef = comp)}
                      dropdownName="minSprayWindow"
                      options={sprayWindowDropdownOptions}
                      toggleDropdown={this.handleToggleDropdown}
                      isDropdownExpanded={this.state.isSprayWindowDropdownExpanded}
                      changeSelectedOption={this.handleDropdownOptionChange}
                      selectedOption={this.state.sprayWindowDropdownSelectedOption}
                    />
                    <span>{t(`common.settings.consecutiveHours`)}</span>
                  </SprayWindowWrapper>
                </Row>

                {/* Rainfree forecast Period */}
                <Label>{t(`common.settings.rainFreeForecastPeriodLabel`)}</Label>
                <Row>
                  <DropdownComponent
                    // tslint:disable-next-line:jsx-no-lambda
                    ref={(comp: any) => (this.rainFreeRef = comp)}
                    dropdownName="minRainFreeHours"
                    options={rainFreeDropdownOptions}
                    toggleDropdown={this.handleToggleDropdown}
                    isDropdownExpanded={this.state.isRainFreeDropdownExpanded}
                    changeSelectedOption={this.handleDropdownOptionChange}
                    selectedOption={this.state.rainFreeDropdownSelectedOption}
                  />
                </Row>

                {/* tempInversionRisk and dayTimeOnly*/}
                <Container>
                  <CheckboxComponent
                    name="tempInversionRisk"
                    isChecked={this.state.isTempInversionRiskChecked}
                    label={"common.settings.tempInversionRiskLabel"}
                    toggleIsChecked={this.handleCheckboxToggle}
                    isFullWidth
                  />
                </Container>
                <Container>
                  <CheckboxComponent
                    name="dayTimeOnly"
                    isChecked={this.state.isDayTimeOnlyChecked}
                    label={"common.settings.dayTimeOnlyLabel"}
                    toggleIsChecked={this.handleCheckboxToggle}
                    isFullWidth
                  />
                </Container>
              </SettingsBody>

              <SettingsActions>
                <Cancel
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => this.props.changeSettingsState()}
                >
                  {t(`common.settings.cancel`)}
                </Cancel>
                <ApplyButton
                  disabled={
                    this.state.invalidFields.maxWind.invalid ||
                    this.state.invalidFields.temp.invalid
                  }
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => this.apply()}
                >
                  {t(`common.settings.apply`)}
                </ApplyButton>
              </SettingsActions>
            </SettingsWrapper>

            {/* <FooterContainer
              observedAt={this.props.observedAt}
              observedAtTime={this.props.observedAtTime}
            /> */}
          </div>
        )}
      </I18nConsumer>
    );
  }

  private readonly handleClickOutside = (event: any) => {
    const maxWindDropdownNode = ReactDOM.findDOMNode(this.maxWindRef);
    const minWindDropdownNode = ReactDOM.findDOMNode(this.minWindRef);
    const sprayWindowDropdownNode = ReactDOM.findDOMNode(this.sprayWindowRef);
    const rainFreeDropdownNode = ReactDOM.findDOMNode(this.rainFreeRef);
    if (
      maxWindDropdownNode &&
      minWindDropdownNode &&
      sprayWindowDropdownNode &&
      rainFreeDropdownNode
    ) {
      if (
        !maxWindDropdownNode.contains(event.target) &&
        !minWindDropdownNode.contains(event.target) &&
        !sprayWindowDropdownNode.contains(event.target) &&
        !rainFreeDropdownNode.contains(event.target)
      ) {
        this.setState({
          isMaxWindDropdownExpanded: false,
          isMinWindDropdownExpanded: false,
          isSprayWindowDropdownExpanded: false,
          isRainFreeDropdownExpanded: false,
        });
      }
    }
  };

  private readonly handleCheckboxToggle = (checkboxName: string): void => {
    const defaultValues = {
      ...DEFAULT_DROPDOWN_SETTINGS[this.props.units],
    };

    switch (checkboxName) {
      case "maxWind":
        // debugger;
        if (this.state.isMaxWindChecked) {
          this.setState({
            isMaxWindChecked: !this.state.isMaxWindChecked,
            invalidFields: {
              ...this.state.invalidFields,
              maxWind: {
                invalid: false,
                message: "",
              },
            },
          });
        } else {
          if (this.validateWindStet("maxWind", this.state.maxWindDropdownSelectedOption)) {
            this.setState({
              isMaxWindChecked: !this.state.isMaxWindChecked,
              invalidFields: {
                ...this.state.invalidFields,
                maxWind: {
                  invalid: false,
                  message: "",
                },
              },
            });
          } else {
            this.setState({
              isMaxWindChecked: !this.state.isMaxWindChecked,
              invalidFields: {
                ...this.state.invalidFields,
                maxWind: {
                  invalid: true,
                  message: "invalidWindNumberMessage",
                },
              },
            });
          }
        }
        break;
      case "minWind":
        if (this.state.isMinWindChecked) {
          this.setState({
            isMinWindChecked: !this.state.isMinWindChecked,
            invalidFields: {
              ...this.state.invalidFields,
              maxWind: {
                invalid: false,
                message: "",
              },
            },
          });
        } else {
          if (this.validateWindStet("minWind", this.state.minWindDropdownSelectedOption)) {
            this.setState({
              isMinWindChecked: !this.state.isMinWindChecked,
              invalidFields: {
                ...this.state.invalidFields,
                maxWind: {
                  invalid: false,
                  message: "",
                },
              },
            });
          } else {
            this.setState({
              isMinWindChecked: !this.state.isMinWindChecked,
              invalidFields: {
                ...this.state.invalidFields,
                maxWind: {
                  invalid: true,
                  message: "invalidWindNumberMessage",
                },
              },
            });
          }
        }
        break;
      case "maxTemp":
        this.setState(
          {
            isMaxTempChecked: !this.state.isMaxTempChecked,
          },
          () => {
            if (!this.state.isMaxTempChecked) {
              // remove error and set default input value
              this.setState({
                invalidFields: {
                  ...this.state.invalidFields,
                  temp: {
                    invalid: false,
                    message: "",
                  },
                },
              });
            } else {
              let isFieldInvalid = this.state.invalidFields.temp.invalid;
              let message = this.state.invalidFields.temp.message;

              if (
                this.state.isMaxTempChecked &&
                this.state.isMinTempChecked &&
                this.state.maxTempInputValue &&
                this.state.minTempInputValue &&
                this.state.maxTempInputValue < this.state.minTempInputValue
              ) {
                isFieldInvalid = true;
                message =
                  this.props.units && this.props.units.toLocaleLowerCase() === "imperial"
                    ? "invalidTempMessageImperial"
                    : "invalidTempMessageMetric";
              } else if (
                this.state.isMaxTempChecked &&
                !this.state.isMinTempChecked &&
                ((this.state.maxTempInputValue &&
                  this.state.maxTempInputValue <
                    MAX_MIN_TEMP_SETTINGS[
                      this.props.units ? this.props.units.toLocaleLowerCase() : "imperial"
                    ].min) ||
                  (this.state.maxTempInputValue &&
                    this.state.maxTempInputValue >
                      MAX_MIN_TEMP_SETTINGS[
                        this.props.units ? this.props.units.toLocaleLowerCase() : "imperial"
                      ].max))
              ) {
                isFieldInvalid = true;
                message = "invalidUpperLimitNumberMessage";
              } else {
                isFieldInvalid = false;
                message = "";
              }

              this.setState({
                invalidFields: {
                  ...this.state.invalidFields,
                  temp: {
                    invalid: isFieldInvalid,
                    message,
                  },
                },
              });
            }
          },
        );
        break;
      case "minTemp":
        this.setState(
          {
            isMinTempChecked: !this.state.isMinTempChecked,
          },
          () => {
            if (!this.state.isMinTempChecked) {
              // remove error and set default input value
              this.setState({
                invalidFields: {
                  ...this.state.invalidFields,
                  temp: {
                    invalid: false,
                    message: "",
                  },
                },
              });
            } else {
              let isFieldInvalid = this.state.invalidFields.temp.invalid;
              let message = this.state.invalidFields.temp.message;

              if (
                this.state.isMaxTempChecked &&
                this.state.isMinTempChecked &&
                this.state.maxTempInputValue &&
                this.state.minTempInputValue &&
                this.state.maxTempInputValue < this.state.minTempInputValue
              ) {
                isFieldInvalid = true;
                message =
                  this.props.units && this.props.units.toLocaleLowerCase() === "imperial"
                    ? "invalidTempMessageImperial"
                    : "invalidTempMessageMetric";
              } else if (
                this.state.isMaxTempChecked &&
                !this.state.isMinTempChecked &&
                ((this.state.minTempInputValue &&
                  this.state.minTempInputValue <
                    MAX_MIN_TEMP_SETTINGS[
                      this.props.units ? this.props.units.toLocaleLowerCase() : "imperial"
                    ].min) ||
                  (this.state.minTempInputValue &&
                    this.state.minTempInputValue >
                      MAX_MIN_TEMP_SETTINGS[
                        this.props.units ? this.props.units.toLocaleLowerCase() : "imperial"
                      ].max))
              ) {
                isFieldInvalid = true;
                message = "invalidUpperLimitNumberMessage";
              } else {
                isFieldInvalid = false;
                message = "";
              }

              this.setState({
                invalidFields: {
                  ...this.state.invalidFields,
                  temp: {
                    invalid: isFieldInvalid,
                    message,
                  },
                },
              });
            }
          },
        );
        break;
      case "tempInversionRisk":
        this.setState({
          isTempInversionRiskChecked: !this.state.isTempInversionRiskChecked,
        });
        break;
      case "dayTimeOnly":
        this.setState({
          isDayTimeOnlyChecked: !this.state.isDayTimeOnlyChecked,
        });
        break;
      default:
        break;
    }
  };

  private readonly handleToggleDropdown = (dropdownName: string) => {
    switch (dropdownName) {
      case "maxWind":
        this.setState({
          isMaxWindDropdownExpanded: !this.state.isMaxWindDropdownExpanded,
          isMinWindDropdownExpanded: false,
          isSprayWindowDropdownExpanded: false,
          isRainFreeDropdownExpanded: false,
        });
        break;
      case "minWind":
        this.setState({
          isMinWindDropdownExpanded: !this.state.isMinWindDropdownExpanded,
          isMaxWindDropdownExpanded: false,
          isSprayWindowDropdownExpanded: false,
          isRainFreeDropdownExpanded: false,
        });
        break;
      case "minSprayWindow":
        this.setState({
          isSprayWindowDropdownExpanded: !this.state.isSprayWindowDropdownExpanded,
          isMaxWindDropdownExpanded: false,
          isMinWindDropdownExpanded: false,
          isRainFreeDropdownExpanded: false,
        });
        break;
      case "minRainFreeHours":
        this.setState({
          isRainFreeDropdownExpanded: !this.state.isRainFreeDropdownExpanded,
          isMaxWindDropdownExpanded: false,
          isMinWindDropdownExpanded: false,
          isSprayWindowDropdownExpanded: false,
        });
        break;
      default:
        break;
    }
  };

  private readonly validateWindStet = (dropdownName: string, selectedOption: DropdownOption) => {
    switch (dropdownName) {
      case "maxWind":
        if (
          (selectedOption.key as number) >= (this.state.minWindDropdownSelectedOption.key as number)
        ) {
          return true;
        } else if (!this.state.isMinWindChecked) {
          return true;
        } else {
          return false;
        }
      case "minWind":
        if (
          (selectedOption.key as number) <= (this.state.maxWindDropdownSelectedOption.key as number)
        ) {
          return true;
        } else if (!this.state.isMaxWindChecked) {
          return true;
        } else {
          return false;
        }
      default:
        break;
    }
  };

  private readonly handleDropdownOptionChange = (
    dropdownName: string,
    selectedOption: DropdownOption,
  ) => {
    switch (dropdownName) {
      case "maxWind":
        if (this.validateWindStet(dropdownName, selectedOption)) {
          this.setState({
            maxWindDropdownSelectedOption: selectedOption,
            invalidFields: {
              ...this.state.invalidFields,
              maxWind: {
                invalid: false,
                message: "",
              },
            },
          });
        } else {
          this.setState({
            maxWindDropdownSelectedOption: selectedOption,
            invalidFields: {
              ...this.state.invalidFields,
              maxWind: {
                invalid: true,
                message: "invalidWindNumberMessage",
              },
            },
          });
        }
        break;
      case "minWind":
        if (this.validateWindStet(dropdownName, selectedOption)) {
          this.setState({
            minWindDropdownSelectedOption: selectedOption,
            invalidFields: {
              ...this.state.invalidFields,
              maxWind: {
                invalid: false,
                message: "",
              },
            },
          });
        } else {
          this.setState({
            minWindDropdownSelectedOption: selectedOption,
            invalidFields: {
              ...this.state.invalidFields,
              maxWind: {
                invalid: true,
                message: "invalidWindNumberMessage",
              },
            },
          });
        }
        break;
      case "minSprayWindow":
        this.setState({ sprayWindowDropdownSelectedOption: selectedOption });
        break;
      case "minRainFreeHours":
        this.setState({ rainFreeDropdownSelectedOption: selectedOption });
        break;
      default:
        break;
    }
  };

  private readonly getUnit = (field: string, units?: string): string => {
    const convertedUnit = units && units.toLowerCase() === "metric" ? "metric" : "imperial";
    switch (field) {
      case "windDir":
        if (convertedUnit === "imperial") {
          return "mph";
        } else {
          return "kmh";
        }
      case "temp":
        if (convertedUnit === "imperial") {
          return "F";
        } else {
          return "C";
        }
      default:
        return "";
    }
  };

  private readonly validateMaxTemp = (e: any) => {
    let newValue = e.target.value;
    let isFieldInvalid = this.state.invalidFields.temp.invalid;
    let message = this.state.invalidFields.temp.message;

    if (
      this.state.isMaxTempChecked &&
      this.state.isMinTempChecked &&
      (newValue.trim() === "" ||
        (parseInt(newValue) <
          MAX_MIN_TEMP_SETTINGS[
            this.props.units ? this.props.units.toLocaleLowerCase() : "imperial"
          ].min ||
          parseInt(newValue) >
            MAX_MIN_TEMP_SETTINGS[
              this.props.units ? this.props.units.toLocaleLowerCase() : "imperial"
            ].max) ||
        (this.state.minTempInputValue && parseInt(newValue) < this.state.minTempInputValue))
    ) {
      isFieldInvalid = true;
      message =
        this.props.units && this.props.units.toLocaleLowerCase() === "imperial"
          ? "invalidTempMessageImperial"
          : "invalidTempMessageMetric";
    } else if (
      this.state.isMaxTempChecked &&
      this.state.isMinTempChecked &&
      !/^[-+]?\d*$/.test(newValue)
    ) {
      isFieldInvalid = true;
      message = "invalidUpperLimitNumberMessage";
    } else if (
      this.state.isMaxTempChecked &&
      !this.state.isMinTempChecked &&
      (newValue.trim() === "" ||
        (parseInt(newValue) <
          MAX_MIN_TEMP_SETTINGS[
            this.props.units ? this.props.units.toLocaleLowerCase() : "imperial"
          ].min ||
          parseInt(newValue) >
            MAX_MIN_TEMP_SETTINGS[
              this.props.units ? this.props.units.toLocaleLowerCase() : "imperial"
            ].max))
    ) {
      isFieldInvalid = true;
      message =
        this.props.units && this.props.units.toLocaleLowerCase() === "imperial"
          ? "invalidTempMessageImperial"
          : "invalidTempMessageMetric";
    } else if (
      this.state.isMaxTempChecked &&
      !this.state.isMinTempChecked &&
      !/^[-+]?\d*$/.test(newValue)
    ) {
      isFieldInvalid = true;
      message = "invalidUpperLimitNumberMessage";
    } else {
      isFieldInvalid = false;
      message = "";
    }

    this.setState({
      invalidFields: {
        ...this.state.invalidFields,
        temp: {
          invalid: isFieldInvalid,
          message,
        },
      },
      maxTempInputValue: newValue,
    });
  };

  private readonly validateMinTemp = (e: any) => {
    let newValue = e.target.value;
    let isFieldInvalid = this.state.invalidFields.temp.invalid;
    let message = this.state.invalidFields.temp.message;

    if (
      this.state.isMinTempChecked &&
      this.state.isMaxTempChecked &&
      (newValue.trim() === "" ||
        (parseInt(newValue) <
          MAX_MIN_TEMP_SETTINGS[
            this.props.units ? this.props.units.toLocaleLowerCase() : "imperial"
          ].min ||
          parseInt(newValue) >
            MAX_MIN_TEMP_SETTINGS[
              this.props.units ? this.props.units.toLocaleLowerCase() : "imperial"
            ].max) ||
        (this.state.maxTempInputValue && parseInt(newValue) > this.state.maxTempInputValue))
    ) {
      isFieldInvalid = true;
      message =
        this.props.units && this.props.units.toLocaleLowerCase() === "imperial"
          ? "invalidTempMessageImperial"
          : "invalidTempMessageMetric";
    } else if (
      this.state.isMinTempChecked &&
      this.state.isMaxTempChecked &&
      !/^[-+]?\d*$/.test(newValue)
    ) {
      isFieldInvalid = true;
      message = "invalidLowerLimitNumberMessage";
    } else if (
      this.state.isMinTempChecked &&
      !this.state.isMaxTempChecked &&
      (newValue.trim() === "" ||
        (parseInt(newValue) <
          MAX_MIN_TEMP_SETTINGS[
            this.props.units ? this.props.units.toLocaleLowerCase() : "imperial"
          ].min ||
          parseInt(newValue) >
            MAX_MIN_TEMP_SETTINGS[
              this.props.units ? this.props.units.toLocaleLowerCase() : "imperial"
            ].max))
    ) {
      isFieldInvalid = true;
      message =
        this.props.units && this.props.units.toLocaleLowerCase() === "imperial"
          ? "invalidTempMessageImperial"
          : "invalidTempMessageMetric";
    } else if (
      this.state.isMinTempChecked &&
      !this.state.isMaxTempChecked &&
      !/^[-+]?\d*$/.test(newValue)
    ) {
      isFieldInvalid = true;
      message = "invalidLowerLimitNumberMessage";
    } else {
      isFieldInvalid = false;
      message = "";
    }

    this.setState({
      invalidFields: {
        ...this.state.invalidFields,
        temp: {
          invalid: isFieldInvalid,
          message,
        },
      },
      minTempInputValue: newValue,
    });
  };

  private readonly apply = () => {
    if (!this.state.invalidFields.maxWind.invalid && !this.state.invalidFields.temp.invalid) {
      const thresholds: SprayOutlookThresholds = {
        minimumSprayWindow: this.state.sprayWindowDropdownSelectedOption.key as number,
        rainfreeForecastPeriod: this.state.rainFreeDropdownSelectedOption.key as number,
        windThresholdUpperLimit: this.state.isMaxWindChecked
          ? this.state.maxWindDropdownSelectedOption.key
          : false,
        windThresholdLowerLimit: this.state.isMinWindChecked
          ? this.state.minWindDropdownSelectedOption.key
          : false,
        temperatureUpperLimit: this.state.isMaxTempChecked ? this.state.maxTempInputValue : false,
        temperatureLowerLimit: this.state.isMinTempChecked ? this.state.minTempInputValue : false,
        temperatureInversionRisk: this.state.isTempInversionRiskChecked,
        daytimeOnlyApplication: this.state.isDayTimeOnlyChecked,
      };

      this.props.setThresholds(thresholds);
      this.props.changeSettingsState();
    }
  };
}
