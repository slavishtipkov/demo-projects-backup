import { findIndex } from "lodash-es";
import * as moment from "moment";
import { forkJoin, fromEvent, merge, Observable, of } from "rxjs";
import {
  catchError,
  filter,
  map as mapOperator,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import {
  AnimationActionTypes,
  animationPlaybackError,
  getCurrentAnimationFrame,
  MapActions,
  MapEpic,
  ResumeAnimationAction,
  resumeAnimationSuccess,
  StartAnimationAction,
  startAnimationSuccess,
  StopAnimationAction,
} from "../";
import { WmsRasterOverlayLayer } from "../../interfaces";
import { toBoundingBox } from "../../utils";
import { getActiveAnimatableLayers } from "../layers";

export const PREREQUISITE_FRAME_COUNT = 1;

export const animationLoaderEpic: MapEpic = (action$, state$, { map, animator }) => {
  let cancel$ = merge(
    action$.pipe(
      filter(
        (action): action is StopAnimationAction =>
          action.type === AnimationActionTypes.STOP_ANIMATION,
      ),
    ),
    fromEvent(map, "move").pipe(take(1)),
  );

  return action$.pipe(
    filter(
      (action): action is StartAnimationAction | ResumeAnimationAction =>
        action.type === AnimationActionTypes.START_ANIMATION ||
        action.type === AnimationActionTypes.RESUME_ANIMATION,
    ),
    withLatestFrom(state$),
    switchMap(
      ([action, state]): Observable<MapActions> => {
        let layers = getActiveAnimatableLayers(state) as ReadonlyArray<WmsRasterOverlayLayer>;
        if (layers.length < 1) return of(animationPlaybackError());
        let { offsetHeight: height, offsetWidth: width } = map.getContainer();

        animator.setNewAnimationData(
          layers.map(l => ({ layerId: l.id, ...l.animation! })),
          toBoundingBox(map.getBounds()),
          { height, width },
          true,
        );

        let { timecodes } = animator;
        let currentAnimationFrame = getCurrentAnimationFrame(state);

        let prerequisite: ReadonlyArray<Observable<ReadonlyArray<HTMLImageElement>>>;
        if (currentAnimationFrame) {
          let currentAnimationFrameIndex = timecodes.indexOf(currentAnimationFrame.valueOf());
          if (currentAnimationFrameIndex === -1) {
            currentAnimationFrameIndex = findIndex(timecodes, t =>
              currentAnimationFrame!.isSameOrAfter(moment(t)),
            );
            if (currentAnimationFrameIndex === -1) {
              currentAnimationFrameIndex = 0;
            }
            currentAnimationFrame = moment(timecodes[currentAnimationFrameIndex]);
          }
          prerequisite = timecodes
            .slice(
              currentAnimationFrameIndex,
              currentAnimationFrameIndex + PREREQUISITE_FRAME_COUNT,
            )
            .map(animator.loadFrame);
        } else {
          currentAnimationFrame = moment(timecodes[0]);
          prerequisite = timecodes.slice(0, PREREQUISITE_FRAME_COUNT).map(animator.loadFrame);
        }

        return forkJoin(...prerequisite).pipe(
          catchError(() => of(animationPlaybackError())),
          tap(() => {
            let [loadFrom, loopBack] = currentAnimationFrame
              ? [currentAnimationFrame.valueOf(), true]
              : [timecodes[PREREQUISITE_FRAME_COUNT], false];
            animator.loadFrom(loadFrom, loopBack);
          }),
          mapOperator(() => {
            let timecodesAsMoments = timecodes.map(t => moment(new Date(t)));
            if (action.type === AnimationActionTypes.START_ANIMATION) {
              return startAnimationSuccess(timecodesAsMoments, currentAnimationFrame);
            } else {
              return resumeAnimationSuccess(timecodesAsMoments, currentAnimationFrame);
            }
          }),
          takeUntil(cancel$),
        );
      },
    ),
  );
};
