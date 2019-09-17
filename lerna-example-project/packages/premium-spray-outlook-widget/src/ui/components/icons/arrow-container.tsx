import * as React from "react";
import styled from "../../../styled-components";
import Icon from "../icons";

const Arrow = styled("span")`
  position: absolute;
  right: 8px;
  top: 10px;
`;

export interface Props {
  readonly isExpandedView: boolean;
}

const ArrowContainer = (props: Props) => {
  const width = "10px";
  const height = "16px";
  const wrapper = "common";
  const color = "#003764";

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
