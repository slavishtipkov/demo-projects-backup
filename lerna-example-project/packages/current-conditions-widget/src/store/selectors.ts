import { createSelector, Selector } from "reselect";
import { State, CurrentConditionsState } from "./";
import {
  HourlySurfaceData,
  DailySurfaceData,
  ForecastProps,
  ObservedAt,
  Coordinates,
} from "../interfaces";

export const baseSelector: Selector<CurrentConditionsState, State> = ({ currentConditionsState }) =>
  currentConditionsState;

export const selectCurrentConditionsByObservation: Selector<
  CurrentConditionsState,
  ReadonlyArray<HourlySurfaceData> | undefined
> = createSelector(
  baseSelector,
  currentConditionsState => currentConditionsState.currentConditionsByObservation,
);

export const selectCurrentConditionsByForecast: Selector<
  CurrentConditionsState,
  ReadonlyArray<DailySurfaceData> | undefined
> = createSelector(
  baseSelector,
  currentConditionsState => currentConditionsState.currentConditionsByForecast,
);

export const selectLoadingState: Selector<
  CurrentConditionsState,
  boolean | undefined
> = createSelector(
  baseSelector,
  currentConditionsState => currentConditionsState.loading,
);

export const selectError: Selector<CurrentConditionsState, string | undefined> = createSelector(
  baseSelector,
  error => error.error,
);

export const selectCoordinates: Selector<
  CurrentConditionsState,
  Coordinates | undefined
> = createSelector(
  baseSelector,
  currentConditionsState => currentConditionsState.coordinates,
);

export const selectDays: Selector<CurrentConditionsState, number | undefined> = createSelector(
  baseSelector,
  currentConditionsState => currentConditionsState.days,
);

export const selectUnitsSelector: Selector<
  CurrentConditionsState,
  string | undefined
> = createSelector(
  baseSelector,
  currentConditionsState => currentConditionsState.units,
);

export const selectVisibleFields: Selector<
  CurrentConditionsState,
  ForecastProps | undefined
> = createSelector(
  baseSelector,
  currentConditionsState => currentConditionsState.visibleFields,
);

export const selectObservedAt: Selector<
  CurrentConditionsState,
  ObservedAt | undefined
> = createSelector(
  baseSelector,
  currentConditionsState => currentConditionsState.observedAt,
);

export const selectObservedAtTime: Selector<
  CurrentConditionsState,
  Date | undefined
> = createSelector(
  baseSelector,
  currentConditionsState => currentConditionsState.observedAtTime,
);

export const selectTimezone: Selector<CurrentConditionsState, string | undefined> = createSelector(
  baseSelector,
  currentConditionsState => currentConditionsState.timezone,
);

export const selectShowCurrentObservation: Selector<
  CurrentConditionsState,
  boolean | undefined
> = createSelector(
  baseSelector,
  currentConditionsState => currentConditionsState.showCurrentObservation,
);
