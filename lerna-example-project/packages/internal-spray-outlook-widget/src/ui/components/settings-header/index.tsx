import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import SettingsToggleButton from "../settings-toggle-button";

export const Wrapper = styled.div`
  margin-bottom: 20px;
`;

export const BackLink = styled.div`
  float: right;
  margin-bottom: 10px;
`;

export const Banner = styled.div`
  padding: 10px;
  background-color: #f8f6f6;
  clear: both;
  overflow: hidden;
`;

export const BannerHeader = styled.h1`
  font-family: LatoBold, sans-serif;
  color: #666666;
  font-size: 18px;
  margin-bottom: 10px;
`;

export const BannerToggle = styled.div`
  float: right;
`;

export const List = styled.ul`
  list-style-type: disc;
  list-style-position: inside;
`;

export const Group = styled.div`
  & + & {
    margin-top: 5px;
  }
`;

export const Emphasized = styled.p`
  font-style: italic;
`;

export interface Props {
  readonly onToggleHelpText: () => void;
  readonly onBackClick?: () => void;
}

export interface State {}

export default class extends React.PureComponent<Props, State> {
  handleToggleHelpText = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.onToggleHelpText();
  };

  render(): JSX.Element {
    let { onBackClick } = this.props;
    return (
      <I18nConsumer>
        {({ t }) => (
          <Wrapper>
            {onBackClick && (
              <BackLink>
                <SettingsToggleButton icon="list" onClick={onBackClick} />
              </BackLink>
            )}
            <Banner>
              <BannerHeader>{t("thresholdSettings.header.title")}</BannerHeader>
              <Group>
                <p>{t("thresholdSettings.header.description")}</p>
              </Group>
              <Group>
                <List>
                  <li>{t("thresholdSettings.header.riskDescription.clear")}</li>
                  <li>{t("thresholdSettings.header.riskDescription.caution")}</li>
                  <li>{t("thresholdSettings.header.riskDescription.warning")}</li>
                </List>
              </Group>
              <Group>
                <p>{t("thresholdSettings.header.paragraph")}</p>
              </Group>
              <Group>
                <Emphasized>{t("thresholdSettings.header.reminder")}</Emphasized>
              </Group>
              <BannerToggle data-testid="settings-info-toggle">
                <a href="#" onClick={this.handleToggleHelpText}>
                  {t("thresholdSettings.header.toggleDescriptions")}
                </a>
              </BannerToggle>
            </Banner>
          </Wrapper>
        )}
      </I18nConsumer>
    );
  }
}
