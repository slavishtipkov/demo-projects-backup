import * as React from "react";
import styled from "../../styled-components";
import Button from "../button";
import ButtonGroup from "../button-group";

export interface ZoomControlsWrapperProps {
  readonly isLegendOpen?: boolean;
}

export const ZoomControlsWrapper = styled<ZoomControlsWrapperProps, "div">("div")`
  && {
    position: absolute;
    z-index: 1;
    right: 30px;
    bottom: 30px;
    transition: transform 0.4s;
    transform: ${({ isLegendOpen }) => (isLegendOpen ? "translateY(-160px)" : "translateY(0)")};
  }
`;

export interface Props {
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
  readonly onStopZoom: () => void;
  readonly isLegendOpen?: boolean;
}

export default class ZoomControls extends React.PureComponent<Props> {
  render(): JSX.Element {
    return (
      <ZoomControlsWrapper isLegendOpen={this.props.isLegendOpen}>
        <ButtonGroup>
          <Button
            onMouseDown={this.props.onZoomIn}
            onMouseUp={this.props.onStopZoom}
            icon={"plus"}
            iconSize={36}
          />
          <Button
            onMouseDown={this.props.onZoomOut}
            onMouseUp={this.props.onStopZoom}
            icon={"minus"}
            iconSize={36}
          />
        </ButtonGroup>
      </ZoomControlsWrapper>
    );
  }
}
