import * as moment from "moment-timezone";
import { Reducer } from "redux";
import { GetThresholdSettings, Location, StationOutlook, View } from "../interfaces";
import { Views } from "../types";
import { SprayOutlookActions } from "./";
import { ActionTypes } from "./actions";

export interface State {
  readonly outlooks: ReadonlyArray<StationOutlook>;
  readonly locations: ReadonlyArray<Location>;
  readonly forecastTimestamp?: moment.Moment;
  readonly settings?: GetThresholdSettings;
  readonly settingsSaveInFlight: boolean;
  readonly currentView: View;
  readonly previousView?: View;
}

export const initialState: State = {
  outlooks: [],
  locations: [],
  settingsSaveInFlight: false,
  currentView: { view: Views.OVERVIEW },
};

export const reducer: Reducer<State, SprayOutlookActions> = (state = initialState, action) => {
  if (!action) return state;

  switch (action.type) {
    case ActionTypes.CHANGE_VIEW:
      return {
        ...state,
        currentView: action.payload,
        previousView: state.currentView,
      };
    case ActionTypes.SPRAY_OUTLOOK_FETCHED:
      let { sprayOutlook } = action.payload;
      return {
        ...state,
        outlooks: sprayOutlook,
        forecastTimestamp: moment().tz(moment.tz.guess()),
      };
    case ActionTypes.THRESHOLD_DEFAULTS_FETCHED:
      return {
        ...state,
        settings: action.payload.defaults,
      };
    case ActionTypes.THRESHOLD_SETTINGS_FETCHED:
      return {
        ...state,
        settings: action.payload.settings,
      };
    case ActionTypes.SAVE_THRESHOLD_SETTINGS:
      return {
        ...state,
        settingsSaveInFlight: true,
      };
    case ActionTypes.THRESHOLD_SETTINGS_SAVED:
      return {
        ...state,
        settings: {
          ...action.payload.settings,
        },
        settingsSaveInFlight: false,
      };
    default:
      return state;
  }
};
