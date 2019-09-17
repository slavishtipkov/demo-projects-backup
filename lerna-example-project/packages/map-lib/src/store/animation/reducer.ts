import * as moment from "moment-timezone";
import { Reducer } from "redux";
import { MapActions } from "../";
import { AnimationActionTypes } from "./actions";

export interface AnimationState {
  readonly isAnimating?: boolean;
  readonly currentAnimationFrame?: moment.Moment;
  readonly timeline?: ReadonlyArray<moment.Moment>;
}

export const initialState: AnimationState = {};

export const animationReducer: Reducer<AnimationState, MapActions> = (
  state = initialState,
  action,
) => {
  if (!action) return state;

  switch (action.type) {
    case AnimationActionTypes.START_ANIMATION:
      return {
        ...state,
        isAnimating: true,
      };
    case AnimationActionTypes.START_ANIMATION_SUCCESS:
    case AnimationActionTypes.RESUME_ANIMATION_SUCCESS:
      return {
        ...state,
        currentAnimationFrame: action.payload.currentAnimationFrame,
        timeline: action.payload.timeline,
      };
    case AnimationActionTypes.DID_DRAW_FRAME:
      return {
        ...state,
        currentAnimationFrame: action.payload.currentAnimationFrame,
      };
    case AnimationActionTypes.STOP_ANIMATION:
    case AnimationActionTypes.ANIMATION_PLAYBACK_ERROR:
      return {
        ...state,
        isAnimating: false,
        currentAnimationFrame: undefined,
        timeline: undefined,
      };
    default:
      return state;
  }
};
