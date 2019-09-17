import { Action, ActionCreator } from "redux";
import { CoordinatesDataObject, CoordinatesForZipCode } from "../interfaces";

export const enum ActionTypes {
  FETCH_ZIP_CODE_DATA = "FETCH_ZIP_CODE_DATA",
  FETCH_ZIP_CODE_DATA_SUCCESS = "FETCH_ZIP_CODE_DATA_SUCCESS",
  FETCH_ZIP_CODE_DATA_ERROR = "FETCH_ZIP_CODE_DATA_ERROR",
  ZIP_CODE_INPUT_ERROR = "ZIP_CODE_INPUT_ERROR",
  SET_ZIP_CODE = "SET_ZIP_CODE",
  GET_ZIP_CODE = "GET_ZIP_CODE",
  REMOVE_ZIP_CODE_VALUE = "REMOVE_ZIP_CODE_VALUE",
}

export type Actions =
  | FetchZipCodeDataAction
  | FetchZipCodeDataSuccessAction
  | FetchZipCodeDataErrorAction
  | ZipCodeInputErrorAction
  | SetZipCode
  | GetZipCode
  | RemoveZipCodeValue;

export interface ZipCodeInputErrorAction extends Action<ActionTypes> {
  readonly type: ActionTypes.ZIP_CODE_INPUT_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const zipCodeInputErrorAction: ActionCreator<ZipCodeInputErrorAction> = errorMessage => ({
  type: ActionTypes.ZIP_CODE_INPUT_ERROR,
  payload: new Error(errorMessage),
  error: true,
});

export interface FetchZipCodeDataAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_ZIP_CODE_DATA;
  readonly payload: {
    readonly zipCode: string;
  };
}

export const fetchZipCodeDataAction: ActionCreator<FetchZipCodeDataAction> = ({
  zipCode,
}: {
  readonly zipCode: string;
}) => ({
  type: ActionTypes.FETCH_ZIP_CODE_DATA,
  payload: {
    zipCode,
  },
});

export interface FetchZipCodeDataSuccessAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_ZIP_CODE_DATA_SUCCESS;
  readonly payload: CoordinatesDataObject;
}

export const fetchZipCodeDataSuccessAction: ActionCreator<FetchZipCodeDataSuccessAction> = (
  coordinates: CoordinatesDataObject,
) => ({
  type: ActionTypes.FETCH_ZIP_CODE_DATA_SUCCESS,
  payload: coordinates,
});

export interface FetchZipCodeDataErrorAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_ZIP_CODE_DATA_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const fetchZipCodeDataErrorAction: ActionCreator<
  FetchZipCodeDataErrorAction
> = errorMessage => ({
  type: ActionTypes.FETCH_ZIP_CODE_DATA_ERROR,
  payload: new Error(errorMessage),
  error: true,
});

export interface SetZipCode extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_ZIP_CODE;
  readonly payload: {
    readonly zipCode: string;
  };
}

export const setZipCode: ActionCreator<SetZipCode> = (zipCode: string) => ({
  type: ActionTypes.SET_ZIP_CODE,
  payload: {
    zipCode,
  },
});

export interface GetZipCode extends Action<ActionTypes> {
  readonly type: ActionTypes.GET_ZIP_CODE;
  readonly coordinates: CoordinatesForZipCode;
}

export const getZipCode: ActionCreator<GetZipCode> = (coordinates: CoordinatesForZipCode) => ({
  type: ActionTypes.GET_ZIP_CODE,
  coordinates,
});

export interface RemoveZipCodeValue extends Action<ActionTypes> {
  readonly type: ActionTypes.REMOVE_ZIP_CODE_VALUE;
}

export const removeZipCodeValue: ActionCreator<RemoveZipCodeValue> = () => ({
  type: ActionTypes.REMOVE_ZIP_CODE_VALUE,
});
