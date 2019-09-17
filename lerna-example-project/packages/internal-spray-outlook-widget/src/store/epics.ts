import { of } from "rxjs";
import { filter, flatMap, map, mergeMap, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { Views } from "../types";
import { SprayOutlookEpic } from "./";
import {
  ActionTypes,
  changeViewAction,
  FetchSprayOutlookAction,
  FetchThresholdDefaultsAction,
  fetchThresholdDefaultsAction,
  FetchThresholdSettingsAction,
  SaveThresholdSettingsAction,
  sprayOutlookFetchedAction,
  thresholdDefaultsFetchedAction,
  thresholdSettingsFetchedAction,
  thresholdSettingsSavedAction,
} from "./actions";
import { selectLocations, selectPreviousView } from "./selectors";

export const fetchSprayOutlookEpic: SprayOutlookEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchSprayOutlookAction =>
        action.type === ActionTypes.FETCH_SPRAY_OUTLOOK,
    ),
    switchMap(action =>
      api.fetchSprayOutlook(action.payload.locations).pipe(map(sprayOutlookFetchedAction)),
    ),
  );
};

export const fetchThresholdSettingsEpic: SprayOutlookEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchThresholdSettingsAction =>
        action.type === ActionTypes.FETCH_THRESHOLD_SETTINGS,
    ),
    switchMap(action =>
      api
        .fetchThresholdSettings()
        .pipe(
          map(settings =>
            settings ? thresholdSettingsFetchedAction(settings) : fetchThresholdDefaultsAction(),
          ),
        ),
    ),
  );
};

export const fetchThresholdDefaultsEpic: SprayOutlookEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter(
      (action): action is FetchThresholdDefaultsAction =>
        action.type === ActionTypes.FETCH_THRESHOLD_DEFAULTS,
    ),
    switchMap(action => api.fetchThresholdDefaults()),
    map(thresholdDefaultsFetchedAction),
  );
};

export const saveThresholdSettingsEpic: SprayOutlookEpic = (
  action$,
  state$,
  { api, publicApiCallbacks = {} },
) => {
  return action$.pipe(
    filter(
      (action): action is SaveThresholdSettingsAction =>
        action.type === ActionTypes.SAVE_THRESHOLD_SETTINGS,
    ),
    switchMap(action => api.saveThresholdSettings(action.payload.settings)),
    withLatestFrom(state$),
    tap(() => {
      if (publicApiCallbacks.settingsDidSave) {
        publicApiCallbacks.settingsDidSave();
      }
    }),
    flatMap(([settings, state]) =>
      api
        .fetchSprayOutlook(selectLocations(state))
        .pipe(
          mergeMap(sprayOutlook =>
            of(
              sprayOutlookFetchedAction(sprayOutlook),
              thresholdSettingsSavedAction(settings),
              changeViewAction(selectPreviousView(state) || { view: Views.OVERVIEW }),
            ),
          ),
        ),
    ),
  );
};
