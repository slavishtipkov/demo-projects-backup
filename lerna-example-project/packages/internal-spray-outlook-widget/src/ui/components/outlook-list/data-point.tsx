import * as React from "react";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";

export interface TitleProps {
  readonly children: React.ReactNode | string;
}

export const Title = styled<TitleProps, "div">("div")`
  padding-bottom: 5px;
  margin-bottom: 5px;
  text-transform: uppercase;
  color: #999999;
  border-bottom: 1px solid #eeeeee;

  @media (max-width: 320px) {
    font-size: 12px;
  }

  @media (min-width: 768px) {
    border-bottom: none;
  }
`;

export interface DataPointProps {
  readonly title: React.ReactNode | string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export const DataPoint: React.SFC<DataPointProps> = props => (
  <div className={props.className}>
    <Title>{props.title}</Title>
    {props.children}
  </div>
);

export const StyledDataPoint = styled(DataPoint)`
  color: #555555;

  @media (min-width: 768px) {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;

    > *:first-child {
      display: none;
    }
  }
`;
export default StyledDataPoint;
