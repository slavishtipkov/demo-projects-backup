import { createSelector, Selector } from "reselect";
import { Station } from "../interfaces";
import { PremiumLocationSelectState, State } from "./";

export const baseSelector: Selector<PremiumLocationSelectState, State> = ({
  locationSelectState,
}) => locationSelectState;

export const selectStations: Selector<
  PremiumLocationSelectState,
  ReadonlyArray<Station> | undefined
> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.stations,
);

export const selectSelectedStation: Selector<
  PremiumLocationSelectState,
  Station | undefined
> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.selectedStation,
);

export const selectLoading: Selector<PremiumLocationSelectState, boolean> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.loading,
);

export const selectError: Selector<PremiumLocationSelectState, string | undefined> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.error,
);

export const selectIsDropdownExpanded: Selector<
  PremiumLocationSelectState,
  boolean | undefined
> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.isDropdownExpanded,
);

export const selectUser: Selector<PremiumLocationSelectState, string> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.user,
);

export const selectWidgetName: Selector<PremiumLocationSelectState, string> = createSelector(
  baseSelector,
  locationSelectState => locationSelectState.widgetName,
);
