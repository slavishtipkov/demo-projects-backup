import { Clock, selectClock } from "@dtn/i18n-lib";
import {
  ActiveLayerDescriptor,
  getCurrentAnimationFrame,
  getLoadingAnimation,
  getTimeline,
  NamespacedState,
} from "@dtn/map-lib";
import * as moment from "moment-timezone";
import * as React from "react";
import { connect } from "react-redux";
import { UiTheme } from "../../interfaces";
import styled, { ThemeProp, withTheme } from "../../styled-components";
import Icon from "../icon";

// stylelint-disable
// I have no idea why but this block of code makes stylelint angry
interface TimelineContainerProps {
  readonly isSidebarOpen?: boolean;
  readonly isLegendOpen?: boolean;
}

const TimelineContainer = styled<TimelineContainerProps, "div">("div")`
  && {
    position: absolute;
    z-index: 1;
    bottom: 20px;
    left: ${({ theme }) => (theme.ui === UiTheme.COMPACT ? "80px" : " 174px")};
    transition: transform 0.4s;

    ${({ isLegendOpen, isSidebarOpen, theme }) => {
      let x = theme.ui === UiTheme.SPACIOUS ? 360 : 0;
      let y = theme.ui === UiTheme.SPACIOUS ? -160 : 0;
      if (isLegendOpen && isSidebarOpen) {
        return `transform: translate(${x}px, ${y}px);`;
      } else if (isLegendOpen) {
        return `transform: translateY(${y}px);`;
      } else if (isSidebarOpen) {
        return `transform: translate(${x}px, 0);`;
      }
    }};
  }
`;
// stylelint-enable

export const TimelineInner = styled.div`
  && {
    display: flex;
    height: ${({ theme }) => (theme.ui === UiTheme.COMPACT ? "44px" : " 54px")};
    border-radius: 3px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`;

export interface TimelineButtonProps {
  readonly onPlay: () => void;
  readonly onStop: () => void;
  readonly isPlaying: boolean;
  readonly isLoading?: boolean;
  readonly className?: string;
}

export const timelineButton: React.SFC<TimelineButtonProps> = props => {
  let icon;
  if (props.isLoading) {
    icon = "loading";
  } else if (props.isPlaying) {
    icon = "stop";
  } else {
    icon = "play";
  }
  return (
    <div className={props.className} onClick={props.isPlaying ? props.onStop : props.onPlay}>
      <Icon icon={icon} size={32} color="currentColor" />
    </div>
  );
};

export const TimelineButton = styled<TimelineButtonProps>(timelineButton)`
  && {
    cursor: pointer;
    width: ${({ theme }) => (theme.ui === UiTheme.COMPACT ? "44px" : " 60px")};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1a4f5a;
  }
`;

export const TimelineControls = styled.div`
  && {
    border-right: 1px solid #eeeeee;
    display: flex;
    transition: width 0.3s, opacity 0.3s 0.15s;
    overflow: visible;
    opacity: 1;
    border-left: 1px solid #eeeeee;
  }
`;

export const TimelineControlsStatus = styled.div`
  && {
    ${({ theme }) => theme.ui !== UiTheme.COMPACT && "min-width: 260px"};
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export const TimelineControlsLabel = styled.div`
  && {
    display: flex;
    justify-content: space-between;
    color: #90b7bd;
  }
`;

export const TimelineControlsSlider = styled.div`
  && {
    position: relative;
    margin-bottom: 4px;

    > input::before,
    > input::after {
      content: "";
      position: absolute;
      z-index: 0;
      top: 0;
      width: 3px;
      height: 14px;
      border: 3px solid #eeeeee;
      background-color: transparent;
    }

    > input::before {
      left: 0;
      border-right-width: 0;
      border-radius: 3px 0 0 3px;
    }

    > input::after {
      right: 0;
      border-left-width: 0;
      border-radius: 0 3px 3px 0;
    }

    > input {
      width: 100%;
      height: 20px;
      z-index: 2;
      position: relative;
      background: transparent;
      -webkit-appearance: none; /* stylelint-disable-line */
    }

    > input:focus {
      outline: none;
    }

    > input::-webkit-slider-runnable-track {
      height: 4px;
      border-radius: 3px;
      background: #eeeeee;
    }

    > input::-webkit-slider-thumb {
      position: relative;
      z-index: 1;
      width: 14px;
      height: 14px;
      margin-top: -5px;
      border-radius: 50%;
      background-color: #1a4f5a;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      -webkit-appearance: none; /* stylelint-disable-line */
    }
  }
`;

export interface TimelineTimestampProps {
  readonly datetime: moment.Moment;
  readonly clock: Clock;
  readonly className?: string;
}

export const timelineTimestamp: React.SFC<TimelineTimestampProps> = ({
  datetime,
  clock,
  className,
}) => {
  let d = datetime.tz(moment.tz.guess());
  let n = moment().tz(moment.tz.guess());
  let isSame = d.isSame(n, "day");
  return (
    <div className={className}>
      <time dateTime={datetime.toString()}>
        {clock === Clock.TWENTY_FOUR_HOUR
          ? datetime.format(`${!isSame ? "ddd " : ""}H:mm`)
          : datetime.format(`${!isSame ? "ddd " : ""}h:mm A`)}
      </time>
    </div>
  );
};
export const TimelineTimestamp = styled<TimelineTimestampProps>(timelineTimestamp)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 10px;
    flex-direction: column;
    width: ${({ theme }) => (theme.ui === UiTheme.COMPACT ? "56px" : "auto")};

    > * {
      color: #1a4f5a;
    }
  }
`;

export interface Props {
  readonly isAnimating: boolean;
  readonly isOpen: boolean;
  readonly showAnimationControls: boolean;
  readonly timeline: ReadonlyArray<moment.Moment>;
  readonly currentAnimationFrame: moment.Moment;
  readonly activeLayerDescriptors: ReadonlyArray<ActiveLayerDescriptor>;
  readonly onClose: () => void;
  readonly onStart: () => void;
  readonly onStop: () => void;
  readonly isSidebarOpen: boolean;
  readonly isLegendOpen: boolean;
  readonly clock: Clock;
  readonly theme: ThemeProp;
  readonly loadingAnimation?: boolean;
}

class Timeline extends React.PureComponent<Props> {
  get timelinLabels(): {
    readonly first: string;
    readonly middle: string;
    readonly last: string;
  } {
    let { timeline } = this.props;
    let [first] = timeline;
    let middle = Math.ceil(timeline.length / 2);
    let last = timeline.length - 1;
    const format = (date: moment.Moment) =>
      this.props.clock === Clock.TWENTY_FOUR_HOUR ? date.format("H:mm") : date.format("h:mm A");
    return {
      first: format(first),
      middle: format(timeline[middle]),
      last: format(timeline[last]),
    };
  }

  handleSliderChange = () => {
    return;
  };

  render(): JSX.Element {
    let timestamp: moment.Moment | undefined;
    if (this.props.currentAnimationFrame) {
      timestamp = this.props.currentAnimationFrame;
    } else {
      timestamp = this.props.activeLayerDescriptors
        .map(({ lastUpdated }) => lastUpdated)
        .filter(Boolean)
        // tslint:disable-next-line
        .sort((a, b) => a!.valueOf() - b!.valueOf())
        .reverse()[0]!;
    }

    return (
      <TimelineContainer
        isLegendOpen={this.props.isLegendOpen}
        isSidebarOpen={this.props.isSidebarOpen}
      >
        <TimelineInner>
          {this.props.showAnimationControls && this.props.activeLayerDescriptors.length > 0 && (
            <TimelineButton
              onPlay={this.props.onStart}
              onStop={this.props.onStop}
              isPlaying={this.props.isAnimating}
              isLoading={this.props.loadingAnimation}
            />
          )}
          {this.props.timeline.length > 0 && (
            <TimelineControls>
              <TimelineControlsStatus>
                <TimelineControlsSlider>
                  <input
                    onChange={this.handleSliderChange}
                    // onMouseUp={this.props.beginPlayback}
                    name="timeline"
                    type="range"
                    min={0}
                    max={this.props.timeline.length - 1}
                    step="1"
                    value={this.props.timeline.findIndex((m, i) => m.isSame(timestamp))}
                  />

                  <TimelineControlsLabel>
                    <div>{this.timelinLabels.first}</div>
                    {/* !this.props.compact && <div>{this.timelinLabels.middle}</div> */}
                    <div>{this.timelinLabels.last}</div>
                  </TimelineControlsLabel>
                </TimelineControlsSlider>
              </TimelineControlsStatus>
            </TimelineControls>
          )}
          {timestamp && <TimelineTimestamp datetime={timestamp} clock={this.props.clock} />}
        </TimelineInner>
      </TimelineContainer>
    );
  }
}

const mapStateToProps = (state: NamespacedState): Partial<Props> => ({
  currentAnimationFrame: getCurrentAnimationFrame(state),
  timeline: getTimeline(state) || [],
  loadingAnimation: getLoadingAnimation(state),
  clock: selectClock(state),
});

export default connect<Partial<Props>, Partial<Props>, Partial<Props>, NamespacedState>(
  mapStateToProps,
)(withTheme(Timeline));
