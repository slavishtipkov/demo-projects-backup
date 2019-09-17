import * as React from "react";
import { Risk } from "../../../interfaces";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import { getColorForRisk } from "../../../utils";
import Icon from "../icons";

export interface HeaderProps {
  readonly risk: Risk;
  readonly isOpen: boolean;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
  readonly className?: string;
}

let Header: React.SFC<HeaderProps> = props => {
  let { onClick, className, children } = props;
  return (
    <div className={className} onClick={onClick}>
      {children}
      <div className="icon">
        <Icon icon={"chevronRight"} size={14} color="currentColor" />
      </div>
    </div>
  );
};

let StyledHeader = styled(Header)`
  background-color: ${props => getColorForRisk(props.risk)};
  padding: 10px 5px;
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(22, 22, 22, 0.5);
  font-size: 14px;
  line-height: 1.2;
  overflow: hidden;
  cursor: pointer;

  .icon {
    float: right;
    transition: 0.2s;
    transform: ${({ isOpen }) => (isOpen ? "rotate(90deg)" : "none")};
  }
`;

export interface BodyProps {
  readonly risk: Risk;
  readonly isOpen: boolean;
  readonly children: React.ReactChild;
}

export const Body = styled<BodyProps, "div">("div")`
  box-sizing: border-box;
  overflow: hidden;
  height: ${({ isOpen }) => (isOpen ? "205px" : "0")};
  background-color: ${props => getColorForRisk(props.risk)};
  padding: ${({ isOpen }) => (isOpen ? "0 5px 5px" : "0 5px")};
  transition: all 0.25s ease-in-out;

  @media (min-width: 768px) {
    height: ${({ isOpen }) => (isOpen ? "59px" : "0")};
  }
`;

export default { Header: StyledHeader, Body };
