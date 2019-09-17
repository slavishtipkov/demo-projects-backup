import { Reducer } from "redux";
import { ZipCodeActions } from "./";
import { ActionTypes } from "./actions";
import { CoordinatesDataObject } from "../interfaces";

export interface State {
  readonly loading: boolean;
  readonly zipCode?: string;
  readonly coordinates?: CoordinatesDataObject;
  readonly error?: string;
}

export const initialState: State = {
  loading: false,
};

export const reducer: Reducer<State, ZipCodeActions> = (state = initialState, action) => {
  if (!action) return state;

  switch (action.type) {
    case ActionTypes.ZIP_CODE_INPUT_ERROR:
      return {
        ...state,
        loading: false,
        zipCode: undefined,
        error: action.payload.message,
      };
    case ActionTypes.FETCH_ZIP_CODE_DATA:
      return {
        ...state,
        loading: true,
        zipCode: action.payload.zipCode,
        error: undefined,
      };
    case ActionTypes.FETCH_ZIP_CODE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        coordinates: action.payload,
      };
    case ActionTypes.FETCH_ZIP_CODE_DATA_ERROR:
      return {
        ...state,
        loading: false,
        coordinates: undefined,
        error: action.payload.message,
      };
    case ActionTypes.SET_ZIP_CODE:
      return {
        ...state,
        zipCode: action.payload.zipCode,
      };
    case ActionTypes.REMOVE_ZIP_CODE_VALUE:
      return {
        ...state,
        zipCode: undefined,
        coordinates: undefined,
        error: undefined,
        loading: false,
      };
    default:
      return state;
  }
};
