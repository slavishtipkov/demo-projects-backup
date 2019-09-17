import { Action, ActionCreator } from "redux";
import { Station, Coordinates } from "../interfaces";

export const enum ActionTypes {
  FETCH_STATIONS = "FETCH_STATIONS",
  FETCH_STATIONS_SUCCESS = "FETCH_STATIONS_SUCCESS",
  FETCH_STATIONS_ERROR = "FETCH_STATIONS_ERROR",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  SELECT_STATIONS = "SELECT_STATIONS",
  SELECT_SELECTED_STATION = "SELECT_SELECTED_STATION",
  SET_IS_DROPDOWN_EXPANDED = "SET_IS_DROPDOWN_EXPANDED",
  REMOVE_SELECTED_STATION = "REMOVE_SELECTED_STATION",
  SET_IS_SAME_STATION_SELECTED = "SET_IS_SAME_STATION_SELECTED",
}

export type Actions =
  | FetchStationsAction
  | FetchStationsSuccessAction
  | FetchStationsErrorAction
  | SelectSelectedStationAction
  | SetErrorMessageAction
  | SetIsDropdownExpandedAction
  | RemoveSelectedStation
  | SetIsSameStationSelected;

export interface FetchStationsAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_STATIONS;
  readonly payload: {
    readonly stationId: string;
  };
}

export const fetchStationsAction: ActionCreator<FetchStationsAction> = (stationId: string) => ({
  type: ActionTypes.FETCH_STATIONS,
  payload: {
    stationId,
  },
});

export interface FetchStationsSuccessAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_STATIONS_SUCCESS;
  readonly payload: {
    readonly stations: ReadonlyArray<Station>;
  };
}

export const fetchStationsSuccessAction: ActionCreator<FetchStationsSuccessAction> = (
  stations: ReadonlyArray<Station>,
) => ({
  type: ActionTypes.FETCH_STATIONS_SUCCESS,
  payload: {
    stations,
  },
});

export interface FetchStationsErrorAction extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_STATIONS_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const fetchStationsErrorAction: ActionCreator<FetchStationsErrorAction> = (
  errorMessage: string,
) => ({
  type: ActionTypes.FETCH_STATIONS_ERROR,
  payload: new Error(errorMessage),
  error: true,
});

export interface SelectStationsAction extends Action<ActionTypes> {
  readonly type: ActionTypes.SELECT_STATIONS;
  readonly payload: {
    readonly stations: ReadonlyArray<Station>;
  };
}

export const selectStationsAction: ActionCreator<SelectStationsAction> = (
  stations: ReadonlyArray<Station>,
) => ({
  type: ActionTypes.SELECT_STATIONS,
  payload: {
    stations,
  },
});

export interface SelectSelectedStationAction extends Action<ActionTypes> {
  readonly type: ActionTypes.SELECT_SELECTED_STATION;
  readonly payload: {
    readonly selectedStation: Station;
  };
}

export const selectSelectedStationAction: ActionCreator<SelectSelectedStationAction> = (
  selectedStation: Station,
) => ({
  type: ActionTypes.SELECT_SELECTED_STATION,
  payload: {
    selectedStation,
  },
});

export interface SetErrorMessageAction extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_ERROR_MESSAGE;
  readonly payload: Error;
  readonly error?: boolean;
}

export const setErrorMessageAction: ActionCreator<SetErrorMessageAction> = (error: string) => ({
  type: ActionTypes.SET_ERROR_MESSAGE,
  payload: new Error(error),
  error: true,
});

export interface SetIsDropdownExpandedAction extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_IS_DROPDOWN_EXPANDED;
  readonly payload: {
    readonly isDropdownExpanded: boolean;
  };
}

export const setIsDropdownExpandedAction: ActionCreator<SetIsDropdownExpandedAction> = (
  isDropdownExpanded: boolean,
) => ({
  type: ActionTypes.SET_IS_DROPDOWN_EXPANDED,
  payload: {
    isDropdownExpanded,
  },
});

export interface RemoveSelectedStation extends Action<ActionTypes> {
  readonly type: ActionTypes.REMOVE_SELECTED_STATION;
}

export const removeSelectedStationAction: ActionCreator<RemoveSelectedStation> = () => ({
  type: ActionTypes.REMOVE_SELECTED_STATION,
});

export interface SetIsSameStationSelected extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_IS_SAME_STATION_SELECTED;
  readonly payload: {
    readonly isSameStationSelected: boolean;
  };
}

export const setIsSameStationSelected: ActionCreator<SetIsSameStationSelected> = (
  isSameStationSelected: boolean,
) => ({
  type: ActionTypes.SET_IS_SAME_STATION_SELECTED,
  payload: {
    isSameStationSelected,
  },
});
