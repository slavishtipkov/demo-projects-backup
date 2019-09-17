import * as React from "react";
import { Consumer as I18nConsumer } from "../../i18n";
import { UiTheme } from "../../interfaces";
import styled, { ThemeProp, withTheme } from "../../styled-components";
import Button from "../button";
import Icon from "../icon";

export interface LegendButtonProps {
  readonly isSidebarOpen?: boolean;
}

export const LegendButton = styled<LegendButtonProps, "div">("div")`
  && {
    position: absolute;
    z-index: 1;
    bottom: 20px;
    left: 20px;
    transition: transform 0.4s;
    ${({ isSidebarOpen, theme }) =>
      isSidebarOpen && theme.ui === UiTheme.SPACIOUS && "transform: translate(360px, 0)"};
  }
`;

export interface LegendCloseProps {
  readonly isOpen: boolean;
  readonly onClick: () => void;
  readonly isSidebarOpen?: boolean;
}

export const LegendClose = styled<LegendCloseProps, "div">("div")`
  && {
    position: absolute;
    z-index: 0;
    top: 0;
    left: ${({ theme }) => (theme.ui === UiTheme.COMPACT ? "20px" : "40px")};
    width: ${({ theme }) => (theme.ui === UiTheme.COMPACT ? "44px" : "60px")};
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px 3px 0 0;
    cursor: pointer;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: transform 0.4s;
    touch-action: manipulation;
    ${({ isOpen }) => isOpen && "transform: translateY(-40px);"};

    svg {
      transition: fill 0.5s;
      transform: rotate(-90deg);
    }
  }
`;

export interface LegendContainerProps {
  readonly isOpen: boolean;
  readonly isSidebarOpen: boolean;
}

export const LegendContainer = styled<LegendContainerProps, "div">("div")`
  && {
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 140px;
    transition: transform 0.4s;

    ${({ isOpen, isSidebarOpen, theme }) => {
      if (isOpen && isSidebarOpen && theme.ui === UiTheme.SPACIOUS) {
        return "transform: translate(360px, 0);";
      } else if (isOpen) {
        return "transform: translateY(0);";
      } else {
        return "transform: translateY(100%);";
      }
    }};
  }
`;

export const LegendContent = styled.div`
  && {
    position: relative;
    z-index: 1;
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    transition: width 0s 0s;
  }
`;

export const LegendList = styled.ul`
  && {
    display: flex;
    align-items: stretch;
    height: 100%;
    width: 100%;
  }
`;

export const LegendLabel = styled.div`
  && {
    padding: 10px 20px;
    color: #1a4f5a;
    background: #eeeeee;
    white-space: nowrap;
  }
`;

export const LegendImage = styled.div`
  && {
    margin: auto;
    padding: 0 20px;
  }
`;

export interface LayerLegendProps {
  readonly label: string;
  readonly urls: ReadonlyArray<string>;
  readonly className?: string;
}

export const layerLegend: React.SFC<LayerLegendProps> = ({ label, urls, className }) => (
  <div className={className}>
    <LegendLabel>{label}</LegendLabel>
    {urls.map(url => (
      <LegendImage key={url}>
        <img src={url} />
      </LegendImage>
    ))}
  </div>
);

export const LayerLegend = styled<LayerLegendProps>(layerLegend)`
  && {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-right: 1px solid #eeeeee;
  }
`;

export interface Props {
  readonly onOpen: () => void;
  readonly onClose: () => void;
  readonly theme: ThemeProp;
  readonly children: ReadonlyArray<JSX.Element>;
  readonly isOpen: boolean;
  readonly isSidebarOpen: boolean;
}

class Legend extends React.PureComponent<Props> {
  render(): JSX.Element {
    let { props } = this;
    return (
      <I18nConsumer>
        {({ t }) => (
          <React.Fragment>
            <LegendButton isSidebarOpen={props.isSidebarOpen}>
              <Button
                horizontal
                onClick={props.onOpen}
                label={props.theme.ui === UiTheme.COMPACT ? "" : t("legend.openButtonLabel")}
                icon="legend"
                iconSize={props.theme.ui === UiTheme.COMPACT ? 44 : 54}
              />
            </LegendButton>
            <LegendContainer isOpen={props.isOpen} isSidebarOpen={props.isSidebarOpen}>
              <LegendContent>
                <LegendList>
                  {props.children.map((child, i) => (
                    <li key={i}>{child}</li>
                  ))}
                </LegendList>
              </LegendContent>
              <LegendClose
                onClick={props.onClose}
                isOpen={props.isOpen}
                isSidebarOpen={props.isSidebarOpen}
              >
                <Icon icon={"arrowLeft"} color="#90b7bd" size={34} />
              </LegendClose>
            </LegendContainer>
          </React.Fragment>
        )}
      </I18nConsumer>
    );
  }
}

export default withTheme(Legend);
