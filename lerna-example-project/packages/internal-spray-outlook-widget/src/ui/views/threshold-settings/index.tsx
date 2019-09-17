import { Units } from "@dtn/i18n-lib";
import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import { GetThresholdSettings, ThresholdSettings } from "../../../interfaces";
import SettingsForm from "../../components/settings-form";
import SettingsHeader from "../../components/settings-header";

export interface Props {
  readonly saveThresholdSettings: (settins: ThresholdSettings) => void;
  readonly onCancel: () => void;

  readonly units: Units;
  readonly settingsSaveInFlight: boolean;
  readonly settings?: GetThresholdSettings;
  readonly onPreviousView?: () => void;
}

export interface State {
  readonly showHelpText: boolean;
}

export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showHelpText: window.matchMedia("(min-width: 768px)").matches,
    };
  }

  handleToggleHelpText = () => {
    this.setState({
      showHelpText: !this.state.showHelpText,
    });
  };

  render(): JSX.Element {
    if (!this.props.settings) {
      return <I18nConsumer>{({ t }) => <div>{t("common.loading")}</div>}</I18nConsumer>;
    }

    return (
      <div data-testid="threshold-settings-view">
        <SettingsHeader
          onBackClick={this.props.onPreviousView}
          onToggleHelpText={this.handleToggleHelpText}
        />
        <SettingsForm
          units={this.props.units}
          showHelpText={this.state.showHelpText}
          initialSettings={this.props.settings}
          saving={this.props.settingsSaveInFlight}
          onSubmit={this.props.saveThresholdSettings}
          onCancel={this.props.onCancel}
        />
      </div>
    );
  }
}
