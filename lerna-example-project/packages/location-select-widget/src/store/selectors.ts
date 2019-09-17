import { createSelector, Selector } from "reselect";
import { Station } from "../interfaces";
import { LocationSelectState, State } from "./";

export const baseSelector: Selector<LocationSelectState, State> = ({ locationSelectState }) =>
  locationSelectState;

export const selectStations: Selector<
  LocationSelectState,
  ReadonlyArray<Station> | undefined
> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.stations,
);

export const selectSelectedStation: Selector<
  LocationSelectState,
  Station | undefined
> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.selectedStation,
);

export const selectLoading: Selector<LocationSelectState, boolean> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.loading,
);

export const selectError: Selector<LocationSelectState, string | undefined> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.error,
);

export const selectIsDropdownExpanded: Selector<
  LocationSelectState,
  boolean | undefined
> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.isDropdownExpanded,
);

export const selectWidgetName: Selector<LocationSelectState, string> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.widgetName,
);

export const selectIsSameStationSelected: Selector<LocationSelectState, boolean> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.isSameStationSelected,
);
