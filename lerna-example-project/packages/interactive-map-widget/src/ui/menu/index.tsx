import * as React from "react";
import styled, { css, keyframes } from "../../styled-components";
import Icon from "../icon";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface MenuProps {
  readonly isOpen?: boolean;
}

const Menu = styled<MenuProps, "div">("div")`
  && {
    padding: 20px 0;
    border-left: 4px solid transparent;
    font-family: LatoRegular;
    transition: border-color 0.4s;
    user-select: none;

    ${props =>
      props.isOpen &&
      css`
        padding: 20px 0 0;
        border-color: #90b7bd;
      `};
  }
`;

interface MenuHeaderProps {
  readonly isOpen?: boolean;
}

const MenuHeader = styled<MenuHeaderProps, "div">("div")`
  && {
    padding: 0 15px;
    font-size: 18px;
    color: #1a4f5a;
    cursor: pointer;

    ${props =>
      props.isOpen &&
      css`
        margin-bottom: 10px;
        font-weight: 700;
      `};
  }
`;

const MenuDisplayLabel = styled.span`
  && {
    display: inline-block;
    margin-right: 15px;
    font-size: inherit;
    vertical-align: middle;
    color: inherit;
  }
`;

const MenuIcon = styled.div`
  && {
    display: inline-block;
    margin-right: 15px;
    font-family: inherit;
    font-size: inherit;
    vertical-align: middle;
    color: inherit;
  }
`;

interface MenuContainerProps {
  readonly isOpen?: boolean;
}

const MenuContainer = styled<MenuContainerProps, "div">("div")`
  && {
    overflow: hidden;
    height: 0;
    opacity: 0;

    ${props =>
      props.isOpen &&
      css`
        height: auto;
        animation-name: ${fadeIn};
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        animation-timing-function: ease;
      `};
  }
`;

export interface Props {
  readonly displayLabel: string;
  readonly icon: string;
}

export interface State {
  readonly isOpen: boolean;
}

export default class extends React.Component<Props, State> {
  state = {
    isOpen: true,
  };

  handleToggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render(): JSX.Element {
    let { isOpen } = this.state;
    let { icon, displayLabel, children } = this.props;
    return (
      <Menu isOpen={isOpen}>
        <MenuHeader isOpen={isOpen} onClick={this.handleToggle}>
          <MenuIcon>
            <Icon icon={icon} size={30} color="currentColor" />
          </MenuIcon>
          <MenuDisplayLabel>{displayLabel}</MenuDisplayLabel>
        </MenuHeader>
        <MenuContainer isOpen={isOpen}>{children}</MenuContainer>
      </Menu>
    );
  }
}
