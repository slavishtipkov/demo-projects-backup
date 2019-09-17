import * as moment from "moment-timezone";
import { MINUTE } from "../constants";
import { AnimationDescriptor, LayerId } from "../interfaces";

export function getTimestamp(interval: number): moment.Moment {
  let now = new Date();
  let minute = now.getMinutes();
  let hour = now.getHours();
  let day = now.getDate();
  let month = now.getMonth();
  let year = now.getFullYear();

  let intervalInMinutes = interval / MINUTE;
  let closestMinuteInterval = intervalInMinutes * Math.floor(minute / intervalInMinutes);
  let date = new Date(year, month, day, hour, closestMinuteInterval - intervalInMinutes);
  return moment(date);
}

export function getTimecodesForDescriptor({
  interval,
  past,
}: AnimationDescriptor): ReadonlyArray<moment.Moment> {
  let now = new Date();
  let minute = now.getMinutes();
  let hour = now.getHours();
  let day = now.getDate();
  let month = now.getMonth();
  let year = now.getFullYear();

  let intervalInMinutes = interval / MINUTE;
  let totalFrames = past / interval;
  let timeline: ReadonlyArray<moment.Moment> = [];

  let closestMinuteInterval = intervalInMinutes * Math.floor(minute / intervalInMinutes);
  for (let i = 0; i <= totalFrames; i++) {
    let date = new Date(year, month, day, hour, closestMinuteInterval);
    timeline = [...timeline, moment(date)];
    closestMinuteInterval = closestMinuteInterval - intervalInMinutes;
  }
  // tslint:disable-next-line
  timeline = [...timeline].sort((a, b) => a.valueOf() - b.valueOf()).reverse();

  return timeline;
}

export interface Timeline {
  readonly [timecode: number]: ReadonlyArray<LayerId>;
}

export function createAnimationTimeline(
  animationData: ReadonlyArray<{ readonly layerId: LayerId } & AnimationDescriptor>,
  sharedOnly = false,
): Timeline {
  let timeline: Timeline = {};
  animationData.forEach(d => {
    getTimecodesForDescriptor(d).forEach(t => {
      let v = t.valueOf();
      if (timeline[v]) {
        timeline = {
          ...timeline,
          ...{ [v]: [d.layerId, ...timeline[v]] },
        };
      } else {
        timeline = { ...timeline, ...{ [v]: [d.layerId] } };
      }
    });
  });

  if (sharedOnly) {
    let sharedTimeline: Timeline = {};
    let { length } = animationData;
    Object.keys(timeline).forEach(t => {
      if (timeline[Number(t)].length === length) {
        sharedTimeline = { ...sharedTimeline, [t]: timeline[Number(t)] };
      }
    });
    return sharedTimeline;
  } else {
    return timeline;
  }
}
