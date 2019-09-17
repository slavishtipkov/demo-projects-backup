import * as React from "react";
import styled, { keyframes } from "../../styled-components";

const circleFadeDelay = keyframes`
  0%,
  39%,
  100% {
    opacity: 0;
  }

  40% {
    opacity: 1;
  }
`;

export interface CirclePrimitiveProps {
  readonly delay?: number;
  readonly rotate?: number;
}

const CirclePrimitive = styled<CirclePrimitiveProps, "div">("div")`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;

  ${({ rotate }) =>
    rotate &&
    `
      transform: rotate(${rotate}deg);
    `};
  ${({ rotate }) =>
    rotate &&
    `
      transform: rotate(${rotate}deg);
    `};

  &::before {
    content: "";
    width: 15%;
    height: 15%;
    animation: ${circleFadeDelay} 1.2s infinite ease-in-out both;
    background-color: #999999;
    border-radius: 100%;
    display: block;
    margin: 0 auto;
    ${({ delay }) =>
      delay &&
      `
        animation-delay: ${delay}s;
      `};
  }
`;

export interface Props {
  readonly delay?: number;
  readonly rotate?: number;
}

const Circle = (props: Props) => {
  return <CirclePrimitive delay={props.delay} rotate={props.rotate} />;
};

export default Circle;
