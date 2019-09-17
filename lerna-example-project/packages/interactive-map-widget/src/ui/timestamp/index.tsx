import * as moment from "moment-timezone";
import * as React from "react";
import styled from "../../styled-components";

export interface TimestampContainerProps {
  readonly isSidebarOpen?: boolean;
  readonly isLegendOpen?: boolean;
}

export const TimestampContainer = styled<TimestampContainerProps, "div">("div")`
  position: absolute;
  z-index: 1;
  bottom: 20px;
  left: 174px;
  border-radius: 3px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.4s;
  display: flex;
  align-items: center;
  height: 54px;
  padding: 0 20px;

  ${({ isLegendOpen, isSidebarOpen }) => {
    if (isLegendOpen && isSidebarOpen) {
      return "transform: translate(160px, -160px);";
    } else if (isLegendOpen) {
      return "transform: translateY(-160px);";
    } else if (isSidebarOpen) {
      return "transform: translate(160px, 0);";
    }
  }};
`;

export const TimestampTime = styled.time`
  font-weight: bold;
  font-size: 18px;
  color: #1a4f5a;
`;

export interface Props {
  readonly datetime: moment.Moment;
  readonly isSidebarOpen: boolean;
  readonly isLegendOpen: boolean;
}

export default class Timestamp extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <TimestampContainer
        isSidebarOpen={this.props.isSidebarOpen}
        isLegendOpen={this.props.isLegendOpen}
      >
        <TimestampTime>{this.props.datetime.tz("America/Chicago").format("H:mm z")}</TimestampTime>
      </TimestampContainer>
    );
  }
}
