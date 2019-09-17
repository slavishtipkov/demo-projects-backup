import { createSelector, Selector } from "reselect";
import {
  HourlyForecast,
  Coordinates,
  ObservedAt,
  VisibleFields,
  DayForecast,
  Station,
} from "../interfaces";
import { HourlyForecastState, State } from "./";

export const baseSelector: Selector<HourlyForecastState, State> = ({ hourlyForecast }) =>
  hourlyForecast;

export const selectHourlyForecast: Selector<
  HourlyForecastState,
  ReadonlyArray<HourlyForecast> | undefined
> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.weatherForecast,
);

export const selectCoordinates: Selector<
  HourlyForecastState,
  Coordinates | undefined
> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.coordinates,
);

export const selectLoading: Selector<HourlyForecastState, boolean> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.loading,
);

export const selectDays: Selector<HourlyForecastState, number | undefined> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.days,
);

export const selectUnits: Selector<HourlyForecastState, string | undefined> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.units,
);

export const selectVisibleFields: Selector<HourlyForecastState, VisibleFields> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.visibleFields,
);

export const selectError: Selector<HourlyForecastState, string | undefined> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.error,
);

export const selectDayForecast: Selector<
  HourlyForecastState,
  ReadonlyArray<DayForecast> | undefined
> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.dayForecast,
);

export const selectObservedAt: Selector<
  HourlyForecastState,
  ObservedAt | undefined
> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.observedAt,
);

export const selectObservedAtTime: Selector<HourlyForecastState, Date | undefined> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.observedAtTime,
);

export const selectUser: Selector<HourlyForecastState, string> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.user,
);

export const selectWidgetName: Selector<HourlyForecastState, string> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.widgetName,
);

export const selectCoordinatesFromEpic: Selector<HourlyForecastState, boolean> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.coordinatesFromEpic,
);

export const selectShowHourlyForecast: Selector<HourlyForecastState, boolean> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.showHourlyForecast,
);

export const selectZipCode: Selector<HourlyForecastState, string | undefined> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.zipCode,
);

export const selectStation: Selector<HourlyForecastState, Station | undefined> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.selectedStation,
);

export const selectShowStationSelect: Selector<HourlyForecastState, boolean> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.showStationSelect,
);

export const selectShowZipCode: Selector<HourlyForecastState, boolean> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.showZipCode,
);

export const selectPremiumRequestSuccess: Selector<HourlyForecastState, boolean> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.hasSuccessPremiumRequest,
);

export const selectTimezone: Selector<HourlyForecastState, string | undefined> = createSelector(
  baseSelector,
  hourlyForecast => hourlyForecast.timezone,
);
