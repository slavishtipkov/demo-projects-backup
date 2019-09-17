import { forkJoin } from "rxjs";
import { filter, map, switchMap, withLatestFrom, tap } from "rxjs/operators";
import { SprayOutlookEpic } from "./";
import {
  ActionTypes,
  FetchSprayOutlookForecastAction,
  fetchSprayOutlookForecastSuccess,
} from "./actions";
import { selectThresholds } from "./selectors";

export const fetchSprayOutlookForecastEpic: SprayOutlookEpic = (
  action$,
  state$,
  { api, publicApiCallbacks },
) => {
  return action$.pipe(
    filter(
      (action): action is FetchSprayOutlookForecastAction =>
        action.type === ActionTypes.FETCH_SPRAY_OUTLOOK_FORECAST,
    ),
    withLatestFrom(state$),
    switchMap(([action, state]) =>
      forkJoin(
        api.fetchSprayOutlookForecast(action.payload.coordinates, selectThresholds(state)!),
        api.fetchObservedAt(action.payload.coordinates),
      ).pipe(
        tap(([sprayOutlookForecast, observedAt]) => {
          if (publicApiCallbacks) {
            if (publicApiCallbacks.onOutlookChange) {
              publicApiCallbacks.onOutlookChange(
                sprayOutlookForecast.nextSprayRecDate,
                selectThresholds(state)!,
              );
            }
            if (publicApiCallbacks.onPostalCodeChange) {
              publicApiCallbacks.onPostalCodeChange({
                latitude: observedAt.latitude,
                longitude: observedAt.longitude,
                postalCode: observedAt.postalCode,
              });
            }
          }
        }),
        map(([sprayOutlookForecast, observedAt]) =>
          fetchSprayOutlookForecastSuccess(sprayOutlookForecast, {
            ...observedAt,
            time: new Date(),
          }),
        ),
      ),
    ),
  );
};
