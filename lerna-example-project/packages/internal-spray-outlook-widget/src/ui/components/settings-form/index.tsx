// tslint:disable:jsx-no-lambda
import { Units } from "@dtn/i18n-lib";
import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import { GetThresholdSettings, ThresholdSettings } from "../../../interfaces";
import {
  BoldLabel,
  ButtonGroup,
  CancelButton,
  ControlGroup,
  ControlGroupIndent,
  ErrorLabel,
  Fieldset,
  InlineControlToggle,
  InlineSelect,
  Legend,
  NormalLabel,
  SaveButton,
  StackThenSplit,
  TextField,
} from "./form-controls";

let allowedMax: { readonly [key: string]: number } = {
  [Units.METRIC]: 54,
  [Units.IMPERIAL]: 130,
};
let allowedMin: { readonly [key: string]: number } = {
  [Units.METRIC]: -57,
  [Units.IMPERIAL]: -70,
};

export interface SettingsFormMeta {
  readonly rainfreeForecastPeriodToggle: boolean;
  readonly windThresholdToggle: boolean;
  readonly windGreaterThanToggle: boolean;
  readonly windLessThanToggle: boolean;
  readonly windFieldsInvalid: boolean;
  readonly temperatureThresholdToggle: boolean;
  readonly temperatureGreaterThanToggle: boolean;
  readonly temperatureLessThanToggle: boolean;
  readonly temperatureFieldsInvalid: boolean;
}

export interface SettingsWithMeta extends SettingsFormMeta, ThresholdSettings {}

export interface Props {
  readonly initialSettings: GetThresholdSettings;
  readonly showHelpText: boolean;
  readonly units: Units;
  readonly saving: boolean;
  readonly onSubmit: (settings: ThresholdSettings) => void;
  readonly onCancel?: () => void;
}

export interface State {
  readonly settings: SettingsWithMeta;
  readonly rainfreeForecastPeriodOptions: ReadonlyArray<number>;
  readonly greaterWindSpeedOptions: ReadonlyArray<number>;
  readonly lesserWindSpeedOptions: ReadonlyArray<number>;
  readonly minSprayWindowOptions: ReadonlyArray<number>;
}

export default class extends React.Component<Props, State> {
  windLessThanRef?: React.RefObject<HTMLSelectElement>;
  windGreaterThanRef?: React.RefObject<HTMLSelectElement>;

  constructor(props: Props) {
    super(props);

    this.windGreaterThanRef = React.createRef();
    this.windLessThanRef = React.createRef();

    this.state = {
      rainfreeForecastPeriodOptions: numberArray(25),
      greaterWindSpeedOptions: numberArray(props.units === Units.METRIC ? 33 : 21, false),
      lesserWindSpeedOptions: numberArray(props.units === Units.METRIC ? 33 : 21),
      minSprayWindowOptions: numberArray(11),
      settings: getInitialFormState(this.props.initialSettings),
    };
  }

  handleChange = (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { settings } = this.state;
    if (event.currentTarget instanceof HTMLSelectElement) {
      this.setState({
        settings: {
          ...settings,
          [event.currentTarget.name]: Number(event.currentTarget.value),
        },
      });
    } else if (event.currentTarget.type === "text") {
      let value = event.currentTarget.value;
      let next;
      if (value === "" || value === "-") {
        next = value;
      } else if (value.match(/[a-z]/i) !== null) {
        // @ts-ignore
        next = settings[event.currentTarget.name];
      } else if (isNaN(Number(value))) {
        // @ts-ignore
        next = settings[event.currentTarget.name];
      } else {
        next = Number(value);
      }
      this.setState({
        settings: {
          ...settings,
          [event.currentTarget.name]: next,
        },
      });
    } else if (event.currentTarget.type === "checkbox") {
      let currentTargetName = event.currentTarget.name.slice();
      this.setState(
        {
          settings: {
            ...settings,
            [event.currentTarget.name]: event.currentTarget.checked,
          },
        },
        () => {
          // Handle initializing values in the wind toggle selects
          // when the corresponding checkbox is toggled
          // Pretty hacky...
          if (currentTargetName.indexOf("windLessThanToggle") > -1) {
            let evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", true, true);
            this.windLessThanRef!.current!.dispatchEvent(evt);
          } else if (currentTargetName.indexOf("windGreaterThanToggle") > -1) {
            let evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", true, true);
            this.windGreaterThanRef!.current!.dispatchEvent(evt);
          }
        },
      );
    }
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.isTemperatureInvalid || this.isWindInvalid) {
      return false;
    }

    if (this.props.saving) {
      return false;
    }

    let { settings } = this.state;

    let temperatureLessThan =
      settings.temperatureThresholdToggle && settings.temperatureLessThanToggle
        ? settings.temperatureLessThan
        : null;
    let temperatureGreaterThan =
      settings.temperatureThresholdToggle && settings.temperatureGreaterThanToggle
        ? settings.temperatureGreaterThan
        : null;
    let windLessThan =
      settings.windThresholdToggle && settings.windLessThanToggle ? settings.windLessThan : null;
    let windGreaterThan =
      settings.windThresholdToggle && settings.windGreaterThanToggle
        ? settings.windGreaterThan
        : null;
    let rainfreeForecastPeriod = settings.rainfreeForecastPeriodToggle
      ? settings.rainfreeForecastPeriod
      : null;

    this.props.onSubmit({
      id: this.props.initialSettings.id,
      dayOnlyApplication: settings.dayOnlyApplication,
      minSprayWindow: settings.minSprayWindow,
      temperatureInversionRisk: settings.temperatureInversionRisk,
      rainfreeForecastPeriod,
      temperatureGreaterThan,
      temperatureLessThan,
      windGreaterThan,
      windLessThan,
    });
  };

  handleCancel = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.setState({
      settings: getInitialFormState(this.props.initialSettings),
    });

    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  render(): JSX.Element {
    let { units } = this.props;
    let { settings } = this.state;
    const renderRainfreeForecastPeriodOptions = (options: ReadonlyArray<number>) =>
      options.map(opt => (
        <option key={opt} value={opt}>
          {opt} {opt === 1 ? "hour" : "hours"}
        </option>
      ));
    const renderWindSpeedOptions = (options: ReadonlyArray<number>) =>
      options.map(opt => (
        <option key={opt} value={opt}>
          {opt} {speedUnits({ units })}
        </option>
      ));

    const renderMinSprayWindowOptions = (options: ReadonlyArray<number>) =>
      options.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ));

    return (
      <I18nConsumer>
        {({ t }) => (
          <form onSubmit={this.handleSubmit}>
            <StackThenSplit>
              <div>
                {/* START WIND THRESHOLDS */}
                <ControlGroup data-testid="threshold-settings-wind-thresholds">
                  <label>
                    <input
                      type="checkbox"
                      name="windThresholdToggle"
                      checked={this.state.settings.windThresholdToggle}
                      onChange={this.handleChange}
                    />
                    <BoldLabel>{t("thresholdSettings.form.windThresholds")}</BoldLabel>
                  </label>
                  <Fieldset disabled={!this.state.settings.windThresholdToggle}>
                    <ControlGroupIndent>
                      <InlineControlToggle>
                        <label>
                          <input
                            type="checkbox"
                            name="windLessThanToggle"
                            checked={this.state.settings.windLessThanToggle}
                            onChange={this.handleChange}
                          />
                          <NormalLabel>{t("thresholdSettings.form.upperLimit")}</NormalLabel>
                        </label>
                      </InlineControlToggle>

                      <label>
                        <InlineSelect
                          name="windLessThan"
                          innerRef={this.windLessThanRef}
                          value={valueOrUndefined(this.state.settings.windLessThan)}
                          onChange={this.handleChange}
                          disabled={!this.state.settings.windLessThanToggle}
                        >
                          {renderWindSpeedOptions(this.state.lesserWindSpeedOptions)}
                        </InlineSelect>
                      </label>
                    </ControlGroupIndent>
                    <ControlGroupIndent>
                      <InlineControlToggle>
                        <label>
                          <input
                            type="checkbox"
                            name="windGreaterThanToggle"
                            checked={this.state.settings.windGreaterThanToggle}
                            onChange={this.handleChange}
                          />
                          <NormalLabel>{t("thresholdSettings.form.lowerLimit")}</NormalLabel>
                        </label>
                      </InlineControlToggle>
                      <label>
                        <InlineSelect
                          name="windGreaterThan"
                          innerRef={this.windGreaterThanRef}
                          value={valueOrUndefined(this.state.settings.windGreaterThan)}
                          onChange={this.handleChange}
                          disabled={!this.state.settings.windGreaterThanToggle}
                        >
                          {renderWindSpeedOptions(this.state.greaterWindSpeedOptions)}
                        </InlineSelect>
                      </label>
                    </ControlGroupIndent>
                  </Fieldset>
                  {this.isWindInvalid && (
                    <ErrorLabel>{t("thresholdSettings.form.limitError")}</ErrorLabel>
                  )}
                  <Legend hide={!this.props.showHelpText}>
                    {t("thresholdSettings.form.description.windThresholds")}
                  </Legend>
                </ControlGroup>
                {/* END WIND THRESHOLDS */}

                {/* START INVERSION */}
                <ControlGroup data-testid="threshold-settings-inversion">
                  <label>
                    <input
                      type="checkbox"
                      name="temperatureInversionRisk"
                      checked={this.state.settings.temperatureInversionRisk}
                      onChange={this.handleChange}
                    />
                    <BoldLabel>{t("thresholdSettings.form.temperatureInversionRisk")}</BoldLabel>
                  </label>
                  <Legend hide={!this.props.showHelpText}>
                    {t("thresholdSettings.form.description.temperatureInversionRisk")}
                  </Legend>
                </ControlGroup>
                {/* END INVERSION */}

                {/* START RAINFREE PERIOD */}
                <ControlGroup data-testid="threshold-settings-rainfree-period">
                  <Fieldset>
                    <label>
                      <input
                        type="checkbox"
                        name="rainfreeForecastPeriodToggle"
                        checked={this.state.settings.rainfreeForecastPeriodToggle}
                        onChange={this.handleChange}
                      />
                      <BoldLabel>{t("thresholdSettings.form.rainfreeForecastPeriod")}</BoldLabel>
                    </label>
                    <ControlGroupIndent>
                      <label>
                        <InlineSelect
                          long
                          name="rainfreeForecastPeriod"
                          disabled={!this.state.settings.rainfreeForecastPeriodToggle}
                          value={valueOrUndefined(this.state.settings.rainfreeForecastPeriod)}
                          onChange={this.handleChange}
                        >
                          {renderRainfreeForecastPeriodOptions(
                            this.state.rainfreeForecastPeriodOptions,
                          )}
                        </InlineSelect>
                      </label>
                    </ControlGroupIndent>
                  </Fieldset>
                  <Legend hide={!this.props.showHelpText}>
                    {t("thresholdSettings.form.description.rainfreeForecastPeriod")}
                  </Legend>
                </ControlGroup>
                {/* END RAINFREE PERIOD */}
              </div>

              <div>
                {/* START TEMPERATURE THRESHOLDS */}
                <ControlGroup data-testid="threshold-settings-temperature-thresholds">
                  <label>
                    <input
                      type="checkbox"
                      name="temperatureThresholdToggle"
                      checked={this.state.settings.temperatureThresholdToggle}
                      onChange={this.handleChange}
                    />
                    <BoldLabel>{t("thresholdSettings.form.temperature")}</BoldLabel>
                  </label>

                  <Fieldset disabled={!this.state.settings.temperatureThresholdToggle}>
                    <ControlGroupIndent>
                      <Fieldset>
                        <InlineControlToggle>
                          <label>
                            <input
                              type="checkbox"
                              name="temperatureLessThanToggle"
                              checked={this.state.settings.temperatureLessThanToggle}
                              onChange={this.handleChange}
                            />
                            <NormalLabel>{t("thresholdSettings.form.upperLimit")}</NormalLabel>
                          </label>
                        </InlineControlToggle>
                        <label>
                          <TextField
                            name="temperatureLessThan"
                            disabled={!this.state.settings.temperatureLessThanToggle}
                            value={valueOrUndefined(this.state.settings.temperatureLessThan)}
                            onChange={this.handleChange}
                          />
                          {t("common.degreeSymbol")}
                          {temperatureUnits({ units })}
                        </label>
                      </Fieldset>
                    </ControlGroupIndent>

                    <ControlGroupIndent>
                      <Fieldset>
                        <InlineControlToggle>
                          <label>
                            <input
                              type="checkbox"
                              name="temperatureGreaterThanToggle"
                              checked={this.state.settings.temperatureGreaterThanToggle}
                              onChange={this.handleChange}
                            />
                            <NormalLabel>{t("thresholdSettings.form.lowerLimit")}</NormalLabel>
                          </label>
                        </InlineControlToggle>
                        <label>
                          <TextField
                            name="temperatureGreaterThan"
                            disabled={!this.state.settings.temperatureGreaterThanToggle}
                            value={valueOrUndefined(this.state.settings.temperatureGreaterThan)}
                            onChange={this.handleChange}
                          />
                          {t("common.degreeSymbol")}
                          {temperatureUnits({ units })}
                        </label>
                      </Fieldset>
                    </ControlGroupIndent>
                  </Fieldset>
                  {this.isTemperatureInvalid && (
                    <>
                      <ErrorLabel>{t("thresholdSettings.form.limitError")}</ErrorLabel>
                      <ErrorLabel>
                        {t("common.error", {
                          allowedMax: allowedMax[units],
                          allowedMin: allowedMin[units],
                        })}
                      </ErrorLabel>
                    </>
                  )}
                  <Legend hide={!this.props.showHelpText}>
                    {t("thresholdSettings.form.description.temperature")}
                  </Legend>
                </ControlGroup>
                {/* END TEMPERATURE THRESHOLDS */}

                {/* START DAYTIME ONLY */}
                <ControlGroup data-testid="threshold-settings-daytime-only">
                  <label>
                    <input
                      type="checkbox"
                      name="dayOnlyApplication"
                      checked={this.state.settings.dayOnlyApplication}
                      onChange={this.handleChange}
                    />
                    <BoldLabel>{t("thresholdSettings.form.daytimeOnly")}</BoldLabel>
                  </label>
                  <Legend hide={!this.props.showHelpText}>
                    {t("thresholdSettings.form.description.daytimeOnly")}
                  </Legend>
                </ControlGroup>
                {/* END DAYTIME ONLY */}

                {/* MINIMUM SPRAY WINDOW */}
                <ControlGroup data-testid="threshold-settings-minimum-spray-window">
                  <BoldLabel>{t("thresholdSettings.form.minimumSprayWindow")}</BoldLabel>
                  <ControlGroupIndent>
                    <label>
                      <InlineSelect
                        name="minSprayWindow"
                        value={this.state.settings.minSprayWindow}
                        onChange={this.handleChange}
                      >
                        {renderMinSprayWindowOptions(this.state.minSprayWindowOptions)}
                      </InlineSelect>
                      {t("thresholdSettings.form.consecutiveHours")}
                    </label>
                  </ControlGroupIndent>
                  <Legend hide={!this.props.showHelpText}>
                    {t("thresholdSettings.form.description.minimumSprayWindow")}
                  </Legend>
                </ControlGroup>
                {/* END SPRAY WINDOW */}
              </div>
            </StackThenSplit>

            <ButtonGroup>
              <div>
                <CancelButton href="#" onClick={this.handleCancel}>
                  {t("thresholdSettings.form.cancel")}
                </CancelButton>
                <SaveButton type="submit">
                  {this.props.saving ? "Saving Changes..." : "Save Changes"}
                </SaveButton>
              </div>
            </ButtonGroup>
          </form>
        )}
      </I18nConsumer>
    );
  }

  private get isTemperatureInvalid(): boolean {
    let { settings } = this.state;
    let invalid = false;
    if (
      settings.temperatureThresholdToggle &&
      settings.temperatureGreaterThanToggle &&
      settings.temperatureLessThanToggle
    ) {
      invalid = boundsInvalid({
        lower: settings.temperatureLessThan,
        upper: settings.temperatureGreaterThan,
      });
    }

    if (invalid) return invalid;

    if (
      settings.temperatureThresholdToggle &&
      (settings.temperatureGreaterThanToggle || settings.temperatureLessThanToggle)
    ) {
      invalid = minMaxInvalid({
        lower: settings.temperatureGreaterThan,
        upper: settings.temperatureLessThan,
        units: this.props.units,
      });
    }

    return invalid;
  }

  private get isWindInvalid(): boolean {
    let { settings } = this.state;
    if (
      settings.windThresholdToggle &&
      settings.windGreaterThanToggle &&
      settings.windLessThanToggle
    ) {
      return boundsInvalid({
        lower: settings.windLessThan,
        upper: settings.windGreaterThan,
      });
    }
    return false;
  }
}

function numberArray(length: number, slice0 = true): ReadonlyArray<number> {
  // tslint:disable
  // @ts-ignore
  return Array.apply(null, { length })
    .map(Number.call, Number)
    .slice(slice0 ? 1 : 0) as ReadonlyArray<number>;
  // tslint:enable
}

function getInitialFormState(settings: GetThresholdSettings): SettingsWithMeta {
  let rainfreeForecastPeriodToggle = !!settings.rainfreeForecastPeriod;
  let windLessThanToggle = settings.windLessThan.value !== null;
  let windGreaterThanToggle = settings.windGreaterThan.value !== null;
  let windThresholdToggle = windGreaterThanToggle || windLessThanToggle;
  let temperatureLessThanToggle = settings.temperatureLessThan.value !== null;
  let temperatureGreaterThanToggle = settings.temperatureGreaterThan.value !== null;
  let temperatureThresholdToggle = temperatureGreaterThanToggle || temperatureLessThanToggle;

  return {
    rainfreeForecastPeriodToggle,
    windGreaterThanToggle,
    windLessThanToggle,
    windThresholdToggle,
    windFieldsInvalid: false,
    temperatureGreaterThanToggle,
    temperatureLessThanToggle,
    temperatureThresholdToggle,
    temperatureFieldsInvalid: false,
    dayOnlyApplication: settings.dayOnlyApplication,
    minSprayWindow: settings.minSprayWindow,
    rainfreeForecastPeriod: settings.rainfreeForecastPeriod,
    temperatureInversionRisk: settings.temperatureInversionRisk,
    temperatureGreaterThan: settings.temperatureGreaterThan.value,
    temperatureLessThan: settings.temperatureLessThan.value,
    windGreaterThan: settings.windGreaterThan.value,
    windLessThan: settings.windLessThan.value,
  };
}

function valueOrUndefined(x: string | number | null): string | number {
  if (x === null) {
    return "";
  }
  return x;
}

function speedUnits({ units }: { readonly units: Units }) {
  return units === Units.METRIC ? "km/h" : "mph";
}

function temperatureUnits({ units }: { readonly units: Units }) {
  return units === Units.METRIC ? "C" : "F";
}

function boundsInvalid({
  lower,
  upper,
}: {
  readonly upper: number | "" | null;
  readonly lower: number | "" | null;
}) {
  if (upper === "" || upper === null || lower === "" || lower === null) {
    return false;
  }

  if (upper > lower || lower < upper) {
    return true;
  } else {
    return false;
  }
}

function minMaxInvalid({
  lower,
  upper,
  units,
}: {
  readonly upper: number | "" | null;
  readonly lower: number | "" | null;
  readonly units: Units;
}) {
  let invalid = false;

  if (typeof upper === "number") {
    if (upper > allowedMax[units]) {
      invalid = true;
    }
  }
  if (typeof lower === "number") {
    if (lower < allowedMin[units]) {
      invalid = true;
    }
  }
  return invalid;
}
