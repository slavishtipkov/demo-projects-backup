import { Action, ActionCreator } from "redux";

export type PresetsActions = ApplyPresetAction;

export const enum PresetsActionTypes {
  APPLY_PRESET = "APPLY_PRESET",
}

export interface ApplyPresetAction extends Action<PresetsActionTypes> {
  readonly type: PresetsActionTypes.APPLY_PRESET;
  readonly payload: {
    readonly name: string;
  };
}

export const applyPreset: ActionCreator<ApplyPresetAction> = (name: string) => ({
  type: PresetsActionTypes.APPLY_PRESET,
  payload: {
    name,
  },
});
