import * as React from "react";
import styled, { css } from "../../styled-components";
import Icon from "../icon";

export interface CategoryProps {
  readonly isActive?: boolean;
}

export const Category = styled<CategoryProps, "li">("li")`
  && {
    padding: 6px 0;
    border-color: transparent;
    transition: border-color 0.5s, background-color 0.5s;

    ${props =>
      props.isActive &&
      css`
        margin-bottom: 10px;
        border-top: 1px solid #eeeeee;
        border-bottom: 1px solid #eeeeee;
        background-color: #f8fafa;
      `};
  }
`;

export interface CategoryContainerProps {
  readonly isActive?: boolean;
}

export const CategoryContainer = styled<CategoryContainerProps, "div">("div")`
  && {
    overflow: hidden;
    height: 0;
    opacity: 0;
    transition: opacity 0.4s, transform 0.3s ease-out;
    transform: translateY(-10px);

    ${props =>
      props.isActive &&
      css`
        height: auto;
        opacity: 1;
        transform: translateY(0);
      `};
  }
`;

export interface CategoryHeaderProps {
  readonly isActive?: boolean;
}
export const CategoryHeader = styled<CategoryHeaderProps, "div">("div")`
  && {
    display: flex;
    padding: 0 20px 0 60px;
    line-height: 1.4 !important;
    align-items: center;
    cursor: pointer;

    ${props =>
      props.isActive &&
      css`
        margin-bottom: 10px;
      `};
  }
`;

export interface CategoryDisplayLabelProps {
  readonly isActive?: boolean;
}
export const CategoryDisplayLabel = styled<CategoryDisplayLabelProps, "span">("span")`
  && {
    flex-grow: 1;
    font-size: 16px;
    color: #1a4f5a;
    user-select: none;

    ${props =>
      props.isActive &&
      css`
        font-weight: 700;
      `};
  }
`;

export interface CategoryHeaderIconProps {
  readonly isActive?: boolean;
}

export const CategoryHeaderIcon = styled<CategoryHeaderIconProps, "div">("div")`
  && {
    transition: transform 0.4s;

    ${props =>
      props.isActive &&
      css`
        transform: rotate(90deg);
      `};
  }
`;

export interface Props {
  readonly displayLabel: string;
  readonly isOpen?: boolean;
}

export interface State {
  readonly isActive: boolean;
}

export default class extends React.PureComponent<Props, State> {
  state = {
    isActive: true,
  };

  handleToggle = () => {
    this.setState({ isActive: !this.state.isActive });
  };

  render(): JSX.Element {
    let { isActive } = this.state;
    let { children, displayLabel } = this.props;
    return (
      <Category isActive={isActive}>
        <CategoryHeader isActive={isActive} onClick={this.handleToggle}>
          <CategoryDisplayLabel isActive={isActive}>{displayLabel}</CategoryDisplayLabel>
          <CategoryHeaderIcon isActive={isActive}>
            <Icon icon={"caretRight"} size={20} color="#1A4F5A" />
          </CategoryHeaderIcon>
        </CategoryHeader>
        <CategoryContainer isActive={isActive}>{children}</CategoryContainer>
      </Category>
    );
  }
}
