import { filter, map, switchMap, catchError, mergeMap } from "rxjs/operators";
import { ZipCodeEpic } from "./";
import {
  ActionTypes,
  fetchZipCodeDataSuccessAction,
  fetchZipCodeDataErrorAction,
  FetchZipCodeDataAction,
  GetZipCode,
  setZipCode,
} from "./actions";
import { ERRORS } from "../constants";
import { ZipCodeDataObject, ZipCodeFromCoordinates } from "../interfaces";
import { of } from "rxjs/internal/observable/of";

export const fetchZipCodeDataEpic: ZipCodeEpic = (action$, state$, { zipApi }) => {
  return action$.pipe(
    filter(
      (action): action is FetchZipCodeDataAction => action.type === ActionTypes.FETCH_ZIP_CODE_DATA,
    ),
    switchMap(action =>
      zipApi.fetchCoordinates(action.payload.zipCode).pipe(
        map(data =>
          data.length !== 0
            ? fetchZipCodeDataSuccessAction(data[0])
            : fetchZipCodeDataErrorAction(ERRORS.GEOLOCATION_ERROR.key),
        ),
        catchError(error => {
          return of(fetchZipCodeDataErrorAction(`Error: ${error[0].message}`));
        }),
      ),
    ),
  );
};

export const fetchZipCodeByCoordinatesEpic: ZipCodeEpic = (action$, state$, { zipApi }) => {
  return action$.pipe(
    filter((action): action is GetZipCode => action.type === ActionTypes.GET_ZIP_CODE),
    switchMap(action =>
      zipApi.getZipCode(action.coordinates).pipe(
        map(res => {
          return setZipCode(res && res.postalCode ? res.postalCode : undefined);
        }),
      ),
    ),
  );
};
