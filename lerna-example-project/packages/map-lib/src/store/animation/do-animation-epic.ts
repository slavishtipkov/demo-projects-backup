import * as moment from "moment";
import { filter, map, withLatestFrom } from "rxjs/operators";
import { getCurrentAnimationFrame, MapEpic } from "../";
import {
  AdvanceCurrentFrameAction,
  AnimationActionTypes,
  animationPlaybackError,
  didDrawFrame,
  ResumeAnimationSuccessAction,
  StartAnimationSuccessAction,
  stillLoadingFrame,
} from "./actions";
import { getTimeline } from "./selectors";

export const doAnimationEpic: MapEpic = (action$, state$, { animator }) => {
  return action$.pipe(
    filter(
      (
        action,
      ): action is
        | AdvanceCurrentFrameAction
        | StartAnimationSuccessAction
        | ResumeAnimationSuccessAction =>
        action.type === AnimationActionTypes.ADVANCE_CURRENT_FRAME ||
        action.type === AnimationActionTypes.START_ANIMATION_SUCCESS ||
        action.type === AnimationActionTypes.RESUME_ANIMATION_SUCCESS,
    ),
    withLatestFrom(state$),
    map(([action, state]) => {
      let timeline = getTimeline(state);
      if (!timeline) {
        return animationPlaybackError();
      }

      let currentAnimationFrame = getCurrentAnimationFrame(state);
      let frameToDraw: moment.Moment;

      // Initial playthrough of the animation, start with the first frame
      if (!currentAnimationFrame) {
        frameToDraw = timeline[0];
      } else if (action.type === AnimationActionTypes.RESUME_ANIMATION_SUCCESS) {
        // If resuming, draw the same frame
        let index = timeline.findIndex(m => m.isSame(currentAnimationFrame));
        frameToDraw = timeline[index];
      } else if (timeline[timeline.length - 1].isSame(currentAnimationFrame)) {
        // If currentAnimationFrame is the same as the last frame in the timeline
        // start the loop over again
        frameToDraw = timeline[0];
      } else {
        // Otherwise find the next frame
        let index = timeline.findIndex(m => m.isSame(currentAnimationFrame));
        frameToDraw = timeline[index + 1];
      }

      if (animator.isFrameFullyCached(frameToDraw.valueOf())) {
        animator.drawFrame(frameToDraw.valueOf());
        return didDrawFrame({ frame: frameToDraw });
      } else {
        return stillLoadingFrame({ frame: frameToDraw });
      }
    }),
  );
};
