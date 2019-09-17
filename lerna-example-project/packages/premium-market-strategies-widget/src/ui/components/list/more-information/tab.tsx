import * as React from "react";
import { Consumer as I18nConsumer, t as translationFunction } from "../../../../i18n";
import styled, { StyledComponentClass, ThemeProp, css } from "../../../../styled-components";
import Icon from "../../icons";
import { ICON_MAP, MOBILE_WIDTH } from "../../../../constants";

export interface ItemContainerProps {
  readonly active: boolean;
  readonly width: number;
}

const Wrapper = styled<ItemContainerProps, "div">("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  margin-right: ${({ width }) => (width <= MOBILE_WIDTH ? "10px" : "20px")};
  font-size: ${({ width }) => width <= MOBILE_WIDTH && "13px"};
  padding-bottom: 3px;
  border-bottom: 4px solid #ffffff;
  flex: 0 0 auto;
  ${({ active }) =>
    active &&
    css`
      border-bottom: 4px solid #0b94cf;
    `};

  &:hover {
    cursor: pointer;
  }

  &:last-of-type {
    margin-right: 0;
  }
`;

export interface TitleProps {
  readonly width: number;
}

const Title = styled<TitleProps, "div">("div")`
  padding-left: ${({ width }) => (width <= MOBILE_WIDTH ? "0" : "8px")};
  color: #5a5a5c;
`;

export interface Props {
  readonly title: string;
  readonly key: string;
  readonly index: number;
  readonly onTabSelect: (activeTab: number) => void;
  readonly activeTab: number;
  readonly width: number;
}

export interface State {
  readonly isExpanded: boolean;
}

export default class Tab extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    const iconWrapper = "common";
    const iconName = ICON_MAP.find(icon => icon.value === this.props.title);

    return (
      <I18nConsumer>
        {({ t }) => (
          <Wrapper
            onClick={this.handleTabSelect}
            active={this.props.activeTab === this.props.index}
            width={this.props.width}
          >
            {this.props.width > MOBILE_WIDTH && (
              <Icon
                wrapper={iconWrapper}
                icon={iconName ? iconName.key : "error"}
                color={"#5a5a5c"}
                width={"20px"}
                height={"20px"}
              />
            )}
            <Title width={this.props.width}>{this.props.title}</Title>
          </Wrapper>
        )}
      </I18nConsumer>
    );
  }

  private readonly handleTabSelect = () => {
    this.props.onTabSelect(this.props.index);
  };
}
