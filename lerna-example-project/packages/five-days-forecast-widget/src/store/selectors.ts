import { createSelector, Selector } from "reselect";
import { DailyForecast, Coordinates, ObservedAt } from "../interfaces";
import { WeatherForecastState, State } from "./";

export const baseSelector: Selector<WeatherForecastState, State> = ({ weatherForecast }) =>
  weatherForecast;

export const selectWeatherForecast: Selector<
  WeatherForecastState,
  ReadonlyArray<DailyForecast>
> = createSelector(
  baseSelector,
  weatherForecast => weatherForecast.weatherForecast,
);

export const selectCoordinates: Selector<
  WeatherForecastState,
  Coordinates | undefined
> = createSelector(
  baseSelector,
  coordinates => coordinates.coordinates,
);

export const selectLoading: Selector<WeatherForecastState, boolean> = createSelector(
  baseSelector,
  loading => loading.loading,
);

export const selectDays: Selector<WeatherForecastState, number | undefined> = createSelector(
  baseSelector,
  days => days.days,
);

export const selectUnits: Selector<WeatherForecastState, string | undefined> = createSelector(
  baseSelector,
  units => units.units,
);

export const selectAllowDaySelection: Selector<WeatherForecastState, boolean> = createSelector(
  baseSelector,
  allowDaySelection => allowDaySelection.allowDaySelection,
);

export const selectActiveDay: Selector<WeatherForecastState, number> = createSelector(
  baseSelector,
  activeDay => activeDay.activeDay,
);

export const selectError: Selector<WeatherForecastState, string | undefined> = createSelector(
  baseSelector,
  error => error.error,
);

export const selectObservedAt: Selector<
  WeatherForecastState,
  ObservedAt | undefined
> = createSelector(
  baseSelector,
  observedAt => observedAt.observedAt,
);

export const selectObservedAtTime: Selector<
  WeatherForecastState,
  Date | undefined
> = createSelector(
  baseSelector,
  observedAtTime => observedAtTime.observedAtTime,
);

export const selectShowFooter: Selector<WeatherForecastState, boolean | undefined> = createSelector(
  baseSelector,
  showFooter => showFooter.showFooter,
);

export const selectTimezone: Selector<WeatherForecastState, string | undefined> = createSelector(
  baseSelector,
  timezone => timezone.timezone,
);
