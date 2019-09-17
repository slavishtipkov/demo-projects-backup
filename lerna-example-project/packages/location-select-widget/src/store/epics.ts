import { of } from "rxjs";
import { filter, map, switchMap, catchError, mergeMap } from "rxjs/operators";
import { LocationSelectEpic } from "./";
import {
  ActionTypes,
  FetchStationsAction,
  fetchStationsErrorAction,
  fetchStationsSuccessAction,
} from "./actions";

export const fetchStationsEpic: LocationSelectEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter((action): action is FetchStationsAction => action.type === ActionTypes.FETCH_STATIONS),
    switchMap(action =>
      api.fetchStations(action.payload.stationId).pipe(
        map(fetchStationsSuccessAction),
        catchError(error => {
          return of(fetchStationsErrorAction(`Error: ${error[0].message}`));
        }),
      ),
    ),
  );
};
