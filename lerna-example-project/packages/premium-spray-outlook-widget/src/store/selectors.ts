import { createSelector, Selector } from "reselect";
import { NamespacedState, SprayOutlookState } from "./";
import { SprayOutlookForecast, SprayOutlookThresholds } from "@dtn/api-lib";
import { Coordinates } from "@dtn/types-lib";

export const baseSelector: Selector<NamespacedState, SprayOutlookState> = ({ sprayOutlook }) =>
  sprayOutlook;

export const selectLoading: Selector<NamespacedState, boolean> = createSelector(
  baseSelector,
  state => Boolean(state.loading),
);

export const selectObservedAtTime: Selector<NamespacedState, Date | undefined> = createSelector(
  baseSelector,
  state => state.observedAtTime,
);

export const selectTimezone: Selector<NamespacedState, string | undefined> = createSelector(
  baseSelector,
  state => state.timezone,
);

export const selectSprayOutlook: Selector<
  NamespacedState,
  SprayOutlookForecast | undefined
> = createSelector(
  baseSelector,
  state => state.sprayOutlook,
);

export const selectThresholds: Selector<
  NamespacedState,
  SprayOutlookThresholds | undefined
> = createSelector(
  baseSelector,
  state => state.thresholds,
);

export const selectCoordinates: Selector<NamespacedState, Coordinates | undefined> = createSelector(
  baseSelector,
  state => state.coordinates,
);

export const selectObservedAt: Selector<
  NamespacedState,
  { readonly city: string; readonly time: Date } | undefined
> = createSelector(
  baseSelector,
  state => state.observedAt,
);
