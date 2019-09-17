import * as React from "react";
import styled from "../../../styled-components";
import Icon from "../icons";

const Arrow = styled("span")`
  position: absolute;
  left: 12px;
  top: 15px;
`;

export interface Props {
  readonly isExpandedView: boolean;
}

const ArrowContainer = (props: Props) => {
  const width = "10px";
  const height = "16px";
  const wrapper = "common";
  const color = "#5a5a5c";

  return (
    <Arrow>
      {!props.isExpandedView && (
        <Icon icon="rightArrow" color={color} width={width} height={height} wrapper={wrapper} />
      )}

      {props.isExpandedView && (
        <Icon icon="downArrow" color={color} width={width} height={height} wrapper={wrapper} />
      )}
    </Arrow>
  );
};

export default ArrowContainer;
