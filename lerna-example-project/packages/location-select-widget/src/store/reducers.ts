import { Reducer } from "redux";
import { Station } from "../interfaces";
import { LocationSelectActions } from "./";
import { ActionTypes } from "./actions";

export interface State {
  readonly loading: boolean;
  readonly error?: string;
  readonly stations?: ReadonlyArray<Station>;
  readonly selectedStation: Station;
  readonly isDropdownExpanded?: boolean;
  readonly widgetName: string;
  readonly isSameStationSelected: boolean;
}

export const initialState: State = {
  loading: false,
  isDropdownExpanded: false,
  selectedStation: { stationId: "", displayName: "" },
  stations: [],
  widgetName: "local-weather-stations-basic",
  isSameStationSelected: false,
};

export const reducer: Reducer<State, LocationSelectActions> = (state = initialState, action) => {
  if (!action) return state;

  switch (action.type) {
    case ActionTypes.SELECT_SELECTED_STATION:
      return {
        ...state,
        selectedStation: action.payload.selectedStation,
        loading: false,
        error: undefined,
      };
    case ActionTypes.SET_IS_DROPDOWN_EXPANDED:
      return {
        ...state,
        isDropdownExpanded: action.payload.isDropdownExpanded,
        error: undefined,
      };
    case ActionTypes.SET_ERROR_MESSAGE:
      return {
        ...state,
        error: action.payload.message,
      };
    case ActionTypes.REMOVE_SELECTED_STATION:
      return {
        ...state,
        selectedStation: {
          stationId: "",
          displayName: "",
        },
        isSameStationSelected: false,
      };
    case ActionTypes.SET_IS_SAME_STATION_SELECTED:
      return {
        ...state,
        isSameStationSelected: action.payload.isSameStationSelected,
      };
    default:
      return state;
  }
};
