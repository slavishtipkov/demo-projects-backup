import * as React from "react";
import styled from "../../../styled-components";
import Icon from "../icons";

const Arrow = styled("span")`
  position: absolute;
  left: 8px;
  top: 13px;
`;

export interface Props {
  readonly index: number;
  readonly isExpandedView: boolean;
}

const ArrowContainer = (props: Props) => {
  const width = "10px";
  const height = "16px";
  const wrapper = "common";
  const color = "#003764";

  return (
    <Arrow>
      {props.index < 5 && !props.isExpandedView && (
        <Icon icon="rightArrow" color={color} width={width} height={height} wrapper={wrapper} />
      )}

      {props.index < 5 && props.isExpandedView && (
        <Icon icon="downArrow" color={color} width={width} height={height} wrapper={wrapper} />
      )}
    </Arrow>
  );
};

export default ArrowContainer;
