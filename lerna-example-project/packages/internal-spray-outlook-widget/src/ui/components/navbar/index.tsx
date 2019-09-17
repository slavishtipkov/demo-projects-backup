import * as React from "react";
import { Consumer as I18nConsumer } from "../../../i18n";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";

const Navbar = styled.nav`
  margin-bottom: 20px;
  text-align: right;
`;

export interface Props {
  readonly onClick: () => void;
}

export default function({ onClick }: Props): JSX.Element {
  let handleSettingsClick = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onClick();
  };
  return (
    <I18nConsumer>
      {({ t }) => (
        <Navbar data-testid="navbar">
          <a href="" onClick={handleSettingsClick}>
            {t("overview.manageSettings")}
          </a>
        </Navbar>
      )}
    </I18nConsumer>
  );
}
