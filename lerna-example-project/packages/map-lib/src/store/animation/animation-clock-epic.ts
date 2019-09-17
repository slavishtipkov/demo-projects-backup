import * as moment from "moment";
import { fromEvent, merge, timer, animationFrameScheduler } from "rxjs";
import { filter, mapTo, switchMap, take, takeUntil, withLatestFrom } from "rxjs/operators";
import {
  advanceCurrentFrame,
  AnimationActionTypes,
  getCurrentAnimationFrame,
  getTimeline,
  MapEpic,
  StartAnimationSuccessAction,
} from "../";
import { SECOND } from "../../constants";
import { AddLayerAction, LayersActionTypes } from "../layers";
import { PauseAnimationAction, ResumeAnimationSuccessAction, StopAnimationAction } from "./actions";
import { layerAnimates } from "./selectors";

const CLOCK_TICK_INTERVAL = SECOND * 0.15;
const FRAME_SKIP_COUNT = Math.round((SECOND * 1.75) / CLOCK_TICK_INTERVAL);

export const animationClockEpic: MapEpic = (action$, state$, { map }) => {
  let stopClock$ = merge(
    action$.pipe(
      filter(
        (action): action is StopAnimationAction | PauseAnimationAction | AddLayerAction =>
          action.type === AnimationActionTypes.STOP_ANIMATION ||
          action.type === AnimationActionTypes.PAUSE_ANIMATION ||
          action.type === LayersActionTypes.ADD_LAYER,
      ),
      withLatestFrom(state$),
      filter(([action, state]) => {
        if (action.type === LayersActionTypes.ADD_LAYER) {
          return layerAnimates(state, action.payload.layerId);
        }
        return true;
      }),
    ),
    fromEvent(map, "move").pipe(take(1)),
  );

  let clockTicks$ = timer(CLOCK_TICK_INTERVAL, CLOCK_TICK_INTERVAL, animationFrameScheduler);
  let skipCount = 0;

  return action$.pipe(
    filter(
      (action): action is StartAnimationSuccessAction | ResumeAnimationSuccessAction =>
        action.type === AnimationActionTypes.START_ANIMATION_SUCCESS ||
        action.type === AnimationActionTypes.RESUME_ANIMATION_SUCCESS,
    ),
    switchMap(() =>
      clockTicks$.pipe(
        withLatestFrom(state$),
        filter(([, state]) => {
          let currentAnimationFrame = getCurrentAnimationFrame(state);
          let timeline = getTimeline(state)!;
          let isLastFrame = (timeline: ReadonlyArray<moment.Moment>, frame: moment.Moment) =>
            timeline[timeline.length - 1].isSame(frame);

          if (isLastFrame(timeline, moment(currentAnimationFrame))) {
            if (skipCount < FRAME_SKIP_COUNT) {
              skipCount++;
              return false;
            } else {
              skipCount = 0;
            }
          }
          return true;
        }),
        mapTo(advanceCurrentFrame()),
        takeUntil(stopClock$),
      ),
    ),
  );
};
