import { of } from "rxjs";
import { filter, map, switchMap, catchError, mergeMap } from "rxjs/operators";
import { StaticWeatherMapEpic } from "./";
import { ActionTypes, FetchMapImage, setActiveMapSuccess, setActiveMapError } from "./actions";
import { MAP_IDS } from "../constants";

export const fetchMapImageEpic: StaticWeatherMapEpic = (action$, state$, { api }) => {
  return action$.pipe(
    filter((action): action is FetchMapImage => action.type === ActionTypes.SET_ACTIVE_MAP),
    switchMap(action =>
      api.fetchMapImage(MAP_IDS[action.payload.defaultMap]).pipe(
        map((imageBlob: Blob) => {
          const imageUrl = URL.createObjectURL(imageBlob);
          return setActiveMapSuccess(imageUrl);
        }),
        catchError(error => {
          return of(setActiveMapError(error));
        }),
      ),
    ),
  );
};
