import * as React from "react";
import { Consumer as I18nConsumer } from "../../i18n";
import { UiTheme } from "../../interfaces";
import styled, { ThemeProp } from "../../styled-components";
import Button from "../button";
import Icon from "../icon";

export interface SidebarContainerProps {
  readonly isOpen: boolean;
}

export const SidebarContainer = styled<SidebarContainerProps, "div">("div")`
  && {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    width: ${({ theme }) => (theme.ui === UiTheme.COMPACT ? "275px" : "360px")};
    height: 100%;
    transition: transform 0.4s;
    transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(-100%)")};
    display: flex;
    flex-direction: column;
  }
`;

export const SidebarContent = styled.div`
  && {
    position: relative;
    z-index: 1;
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
`;

export interface SidebarCloseButtonProps {
  readonly onClick: () => void;
  readonly isOpen: boolean;
  readonly className?: string;
}

export const sidebarCloseButton: React.SFC<SidebarCloseButtonProps> = props => (
  <div onClick={props.onClick} className={props.className}>
    <Icon icon="arrowLeft" size={34} color="currentColor" />
  </div>
);

export const SidebarCloseButton = styled<SidebarCloseButtonProps>(sidebarCloseButton)`
  && {
    position: absolute;
    z-index: 0;
    top: 25px;
    right: 0;
    width: 40px;
    height: ${({ theme }) => (theme.ui === UiTheme.COMPACT ? "44px" : "60px")};
    display: flex;
    align-items: center;
    border-radius: 0 3px 3px 0;
    cursor: pointer;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: transform 0.4s;
    transform: ${({ isOpen }) => (isOpen ? "translateX(40px)" : "translateX(0)")};
    touch-action: manipulation;

    svg {
      fill: #90b7bd;
      transition: fill 0.5s;
    }
  }
`;

export interface SidebarOpenButtonProps {
  readonly theme: ThemeProp;
  readonly onClick: () => void;
  readonly className?: string;
}

let sidebarOpenButton: React.SFC<SidebarOpenButtonProps> = props => (
  <I18nConsumer>
    {({ t }) => (
      <Button
        onClick={props.onClick}
        className={props.className}
        icon={"layers"}
        iconSize={props.theme.ui === UiTheme.COMPACT ? 44 : 52}
        label={props.theme.ui === UiTheme.COMPACT ? "" : t("menu.openButtonLabel")}
      />
    )}
  </I18nConsumer>
);

export const SidebarOpenButton = styled<SidebarOpenButtonProps>(sidebarOpenButton)`
  && {
    position: absolute;
    z-index: 1;
    top: 20px;
    left: 20px;
  }
`;

export interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export interface State {}

export default class Sidebar extends React.PureComponent<Props, State> {
  render(): JSX.Element {
    return (
      <SidebarContainer isOpen={this.props.isOpen}>
        <SidebarContent>{this.props.children}</SidebarContent>
        <SidebarCloseButton onClick={this.props.onClose} isOpen={this.props.isOpen} />
      </SidebarContainer>
    );
  }
}
