import { createSelector, Selector } from "reselect";
import { StaticWeatherMapState, State } from "./";
import { MapsConfigInterface } from "../interfaces";

export const baseSelector: Selector<StaticWeatherMapState, State> = ({ staticWeatherMapState }) =>
  staticWeatherMapState;

export const selectActiveMap: Selector<StaticWeatherMapState, string | undefined> = createSelector(
  baseSelector,
  staticWeatherMapState => staticWeatherMapState.defaultMap,
);

export const selectMapsList: Selector<StaticWeatherMapState, MapsConfigInterface> = createSelector(
  baseSelector,
  staticWeatherMapState => staticWeatherMapState.maps,
);

export const selectLoading: Selector<StaticWeatherMapState, boolean> = createSelector(
  baseSelector,
  staticWeatherMapState => staticWeatherMapState.loading,
);

export const selectError: Selector<
  StaticWeatherMapState,
  string | undefined | Blob
> = createSelector(
  baseSelector,
  staticWeatherMapState => staticWeatherMapState.error,
);

export const selectMapSidebarState: Selector<
  StaticWeatherMapState,
  boolean | undefined
> = createSelector(
  baseSelector,
  staticWeatherMapState => staticWeatherMapState.isMapSidebarVisible,
);

export const selectMapImageData: Selector<
  StaticWeatherMapState,
  string | undefined
> = createSelector(
  baseSelector,
  staticWeatherMapState => staticWeatherMapState.mapImageData,
);
