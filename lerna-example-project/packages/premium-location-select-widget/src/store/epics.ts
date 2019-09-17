import { of } from "rxjs";
import { filter, map, switchMap, catchError, mergeMap } from "rxjs/operators";
import { PremiumLocationSelectEpic } from "./";
import {
  ActionTypes,
  FetchStationsAction,
  fetchStationsErrorAction,
  fetchStationsSuccessAction,
} from "./actions";

export const fetchStationsEpic: PremiumLocationSelectEpic = (
  action$,
  state$,
  { locationSelectApi },
) => {
  return action$.pipe(
    filter((action): action is FetchStationsAction => action.type === ActionTypes.FETCH_STATIONS),
    switchMap(action =>
      locationSelectApi.fetchStations(action.payload.stationId).pipe(
        map(fetchStationsSuccessAction),
        catchError(error => {
          return of(fetchStationsErrorAction(`Error: ${error[0].message}`));
        }),
      ),
    ),
  );
};
