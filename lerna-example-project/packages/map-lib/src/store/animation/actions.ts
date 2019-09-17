import * as moment from "moment-timezone";
import { Action, ActionCreator } from "redux";
import { LayerDefinition } from "../../interfaces";

export type AnimationActions =
  | AnimationPlaybackErrorAction
  | StartAnimationAction
  | StartAnimationSuccessAction
  | StopAnimationAction
  | AdvanceCurrentFrameAction
  | DidDrawFrameAction
  | StillLoadingFrameAction
  | RestartAnimationAction
  | PauseAnimationAction
  | ResumeAnimationAction
  | ResumeAnimationSuccessAction;

export const enum AnimationActionTypes {
  ANIMATION_PLAYBACK_ERROR = "ANIMATION_PLAYBACK_ERROR",
  START_ANIMATION = "START_ANIMATION",
  START_ANIMATION_SUCCESS = "START_ANIMATION_SUCCESS",
  STOP_ANIMATION = "STOP_ANIMATION",
  ADVANCE_CURRENT_FRAME = "ADVANCE_CURRENT_FRAME",
  DID_DRAW_FRAME = "DID_DRAW_FRAME",
  STILL_LOADING_FRAME = "STILL_LOADING_FRAME",
  RESTART_ANIMATION = "RESTART_ANIMATION",
  PAUSE_ANIMATION = "PAUSE_ANIMATION",
  RESUME_ANIMATION = "RESUME_ANIMATION",
  RESUME_ANIMATION_SUCCESS = "RESUME_ANIMATION_SUCCESS",
}

export interface AnimationPlaybackErrorAction extends Action<AnimationActionTypes> {
  readonly type: AnimationActionTypes.ANIMATION_PLAYBACK_ERROR;
  readonly error: boolean;
}

export const animationPlaybackError: ActionCreator<AnimationPlaybackErrorAction> = () => ({
  type: AnimationActionTypes.ANIMATION_PLAYBACK_ERROR,
  error: true,
});

export interface StartAnimationAction extends Action<AnimationActionTypes> {
  readonly type: AnimationActionTypes.START_ANIMATION;
}

export const startAnimation: ActionCreator<StartAnimationAction> = (
  activeLayers: ReadonlyArray<LayerDefinition>,
) => ({
  type: AnimationActionTypes.START_ANIMATION,
});

export interface StartAnimationSuccessAction extends Action<AnimationActionTypes> {
  readonly type: AnimationActionTypes.START_ANIMATION_SUCCESS;
  readonly payload: {
    readonly timeline: ReadonlyArray<moment.Moment>;
    readonly currentAnimationFrame: moment.Moment;
  };
}

export const startAnimationSuccess: ActionCreator<StartAnimationSuccessAction> = (
  timeline: ReadonlyArray<moment.Moment>,
  currentAnimationFrame: moment.Moment,
) => ({
  type: AnimationActionTypes.START_ANIMATION_SUCCESS,
  payload: { timeline, currentAnimationFrame },
});

export interface StopAnimationAction extends Action<AnimationActionTypes> {
  readonly type: AnimationActionTypes.STOP_ANIMATION;
}

export const stopAnimation: ActionCreator<StopAnimationAction> = () => ({
  type: AnimationActionTypes.STOP_ANIMATION,
});

export interface AdvanceCurrentFrameAction extends Action<AnimationActionTypes> {
  readonly type: AnimationActionTypes.ADVANCE_CURRENT_FRAME;
}

export const advanceCurrentFrame: ActionCreator<AdvanceCurrentFrameAction> = () => ({
  type: AnimationActionTypes.ADVANCE_CURRENT_FRAME,
});

export interface DidDrawFrameAction extends Action<AnimationActionTypes> {
  readonly type: AnimationActionTypes.DID_DRAW_FRAME;
  readonly payload: {
    readonly currentAnimationFrame: moment.Moment;
  };
}

export const didDrawFrame: ActionCreator<DidDrawFrameAction> = ({
  frame,
}: {
  readonly frame: moment.Moment;
}) => ({
  type: AnimationActionTypes.DID_DRAW_FRAME,
  payload: {
    currentAnimationFrame: frame,
  },
});

export interface StillLoadingFrameAction extends Action<AnimationActionTypes> {
  readonly type: AnimationActionTypes.STILL_LOADING_FRAME;
  readonly payload: {
    readonly frame: moment.Moment;
  };
}

export const stillLoadingFrame: ActionCreator<StillLoadingFrameAction> = ({
  frame,
}: {
  readonly frame: moment.Moment;
}) => ({
  type: AnimationActionTypes.STILL_LOADING_FRAME,
  payload: {
    frame,
  },
});

export interface RestartAnimationAction extends Action<AnimationActionTypes> {
  readonly type: AnimationActionTypes.RESTART_ANIMATION;
}

export const restartAnimation: ActionCreator<RestartAnimationAction> = () => ({
  type: AnimationActionTypes.RESTART_ANIMATION,
});

export interface PauseAnimationAction extends Action<AnimationActionTypes> {
  readonly type: AnimationActionTypes.PAUSE_ANIMATION;
}

export const pauseAnimation: ActionCreator<PauseAnimationAction> = () => ({
  type: AnimationActionTypes.PAUSE_ANIMATION,
});

export interface ResumeAnimationAction extends Action<AnimationActionTypes> {
  readonly type: AnimationActionTypes.RESUME_ANIMATION;
}

export const resumeAnimation: ActionCreator<ResumeAnimationAction> = () => ({
  type: AnimationActionTypes.RESUME_ANIMATION,
});

export interface ResumeAnimationSuccessAction extends Action<AnimationActionTypes> {
  readonly type: AnimationActionTypes.RESUME_ANIMATION_SUCCESS;
  readonly payload: {
    readonly timeline: ReadonlyArray<moment.Moment>;
    readonly currentAnimationFrame: moment.Moment;
  };
}

export const resumeAnimationSuccess: ActionCreator<ResumeAnimationSuccessAction> = (
  timeline: ReadonlyArray<moment.Moment>,
  currentAnimationFrame: moment.Moment,
) => ({
  type: AnimationActionTypes.RESUME_ANIMATION_SUCCESS,
  payload: { timeline, currentAnimationFrame },
});
