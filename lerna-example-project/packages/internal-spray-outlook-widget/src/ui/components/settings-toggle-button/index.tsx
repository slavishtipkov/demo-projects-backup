import * as React from "react";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import Icon from "../icons";

export interface Props {
  readonly icon: string;
  readonly onClick: () => void;
  readonly className?: string;
}

export const settingsToggleButton: React.SFC<Props> = props => {
  let onClick = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    props.onClick();
  };
  return (
    <a href="#" onClick={onClick} className={props.className}>
      <Icon icon={props.icon} color="currentColor" size={20} />
      <span>{props.icon === "gear" ? "Outlook Settings" : "Outlook Timeline"}</span>
    </a>
  );
};

export default styled<Props>(settingsToggleButton)`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  > * + * {
    padding-left: 5px;
  }
`;
