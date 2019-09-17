import { Reducer } from "redux";
import { Station } from "../interfaces";
import { PremiumLocationSelectActions } from "./";
import { ActionTypes } from "./actions";

export interface State {
  readonly loading: boolean;
  readonly error?: string;
  readonly stations?: ReadonlyArray<Station>;
  readonly selectedStation: Station;
  readonly isDropdownExpanded?: boolean;
  readonly user: string;
  readonly widgetName: string;
}

export const initialState: State = {
  loading: false,
  isDropdownExpanded: false,
  selectedStation: { stationId: "", displayName: "" },
  stations: [],
  user: "",
  widgetName: "local-weather-stations-premium",
};

export const reducer: Reducer<State, PremiumLocationSelectActions> = (
  state = initialState,
  action,
) => {
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
    case ActionTypes.SET_LOCATION_SELECT_ERROR_MESSAGE:
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
      };
    default:
      return state;
  }
};
