import { Reducer, Action, ActionCreator } from "redux";
import { Selector, createSelector } from "reselect";
import { Locales, Units, Clock } from "./types";

export type Actions = ChangeClockAction | ChangeUnitsAction;

export const enum ActionTypes {
  CHANGE_CLOCK = "CHANGE_CLOCK",
  CHANGE_UNITS = "CHANGE_UNITS",
}

export interface ChangeClockAction extends Action<ActionTypes> {
  readonly type: ActionTypes.CHANGE_CLOCK;
  readonly payload: {
    readonly clock: Clock;
  };
}

export const changeClock: ActionCreator<ChangeClockAction> = (clock: Clock) => ({
  type: ActionTypes.CHANGE_CLOCK,
  payload: {
    clock,
  },
});

export interface ChangeUnitsAction extends Action<ActionTypes> {
  readonly type: ActionTypes.CHANGE_UNITS;
  readonly payload: {
    readonly units: Units;
  };
}

export const changeUnits: ActionCreator<ChangeUnitsAction> = (units: Units) => ({
  type: ActionTypes.CHANGE_UNITS,
  payload: {
    units,
  },
});

// tslint:disable-next-line:interface-name
export interface I18nState {
  readonly locale: Locales;
  readonly units: Units;
  readonly clock: Clock;
}

export const initialState: I18nState = {
  locale: Locales.ENGLISH,
  units: Units.IMPERIAL,
  clock: Clock.TWELVE_HOUR,
};

export const reducer: Reducer<I18nState, Actions> = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CHANGE_UNITS:
      return {
        ...state,
        units: action.payload.units,
      };
    case ActionTypes.CHANGE_CLOCK:
      return {
        ...state,
        clock: action.payload.clock,
      };
    default:
      return state;
  }
};

export interface State {
  readonly i18n: I18nState;
}

export const baseSelector: Selector<State, I18nState> = ({ i18n }) => i18n;
export const selectLocale: Selector<State, Locales> = createSelector(
  baseSelector,
  i18n => i18n.locale,
);
export const selectUnits: Selector<State, Units> = createSelector(
  baseSelector,
  i18n => i18n.units,
);
export const selectClock: Selector<State, Clock> = createSelector(
  baseSelector,
  i18n => i18n.clock,
);
