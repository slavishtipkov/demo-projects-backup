import * as React from "react";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
export interface Props {
  readonly children: ReadonlyArray<React.ReactNode>;
}

const CardToRow = styled<Props, "div">("div")`
  overflow: hidden;
  background-color: white;

  > * {
    box-sizing: border-box;
    float: left;
    padding: 5px;

    @media (max-width: 320px) {
      padding: 2px;
    }
  }

  > *:nth-child(1) {
    height: 200px;
    width: 25%;
  }

  > *:nth-child(2),
  > *:nth-child(3),
  > *:nth-child(4),
  > *:nth-child(5) {
    width: calc(75% / 2);
    height: 100px;
  }

  @media (min-width: 768px) {
    display: flex;
    height: 54px;

    > *:nth-child(n) {
      float: none;
      height: 100%;
      flex-basis: 100%;
    }
  }
`;

export default CardToRow;
