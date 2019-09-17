import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import SettingsToggleButton from "../settings-toggle-button";

const Header = styled.div`
  overflow: hidden;
  margin-bottom: 30px;
`;

const Toggle = styled.form`
  float: left;

  > * + * {
    margin-left: 10px;
  }
`;

const ToggleLabel = styled.label`
  font-family: LatoBold, sans-serif;
`;

const Links = styled.div`
  float: right;
`;

export interface Props {
  readonly isHourlyView: boolean;
  readonly onToggle: () => void;
  readonly onSettingsClick: () => void;
}

export default class extends React.Component<Props> {
  render(): JSX.Element {
    let { onToggle, isHourlyView } = this.props;
    return (
      <I18nConsumer>
        {({ t }) => (
          <Header data-testid="overview-header">
            <Toggle>
              <ToggleLabel>
                <input
                  type="radio"
                  name="hourlydailyview"
                  checked={!isHourlyView}
                  onChange={onToggle}
                />
                {t("overview.days")}
              </ToggleLabel>
              <ToggleLabel>
                <input
                  type="radio"
                  name="hourlydailyview"
                  checked={isHourlyView}
                  onChange={onToggle}
                />
                {t("overview.hours")}
              </ToggleLabel>
            </Toggle>
            <Links>
              <SettingsToggleButton icon="gear" onClick={this.props.onSettingsClick} />
            </Links>
          </Header>
        )}
      </I18nConsumer>
    );
  }
}
