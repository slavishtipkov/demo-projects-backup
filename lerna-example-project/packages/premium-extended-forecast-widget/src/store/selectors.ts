import { createSelector, Selector } from "reselect";
import {
  DailyForecast,
  Coordinates,
  ObservedAt,
  Station,
  HourlyObservationData,
} from "../interfaces";
import { PremiumWeatherForecastState, State } from "./";

export const baseSelector: Selector<PremiumWeatherForecastState, State> = ({
  premiumWeatherForecast,
}) => premiumWeatherForecast;

export const selectWeatherForecast: Selector<
  PremiumWeatherForecastState,
  ReadonlyArray<DailyForecast>
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.weatherForecast,
);

export const selectCoordinates: Selector<
  PremiumWeatherForecastState,
  Coordinates | undefined
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.coordinates,
);

export const selectLoading: Selector<PremiumWeatherForecastState, boolean> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.loading,
);

export const selectDays: Selector<PremiumWeatherForecastState, number | undefined> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.days,
);

export const selectUnits: Selector<
  PremiumWeatherForecastState,
  string | undefined
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.units,
);

export const selectError: Selector<
  PremiumWeatherForecastState,
  string | undefined
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.error,
);

export const selectObservedAt: Selector<
  PremiumWeatherForecastState,
  ObservedAt | undefined
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.observedAt,
);

export const selectObservedAtTime: Selector<
  PremiumWeatherForecastState,
  Date | undefined
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.observedAtTime,
);

export const selectUser: Selector<PremiumWeatherForecastState, string> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.user,
);

export const selectWidgetName: Selector<PremiumWeatherForecastState, string> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.widgetName,
);

export const selectCoordinatesFromEpic: Selector<
  PremiumWeatherForecastState,
  boolean
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.coordinatesFromEpic,
);

export const selectShowDailyForecast: Selector<
  PremiumWeatherForecastState,
  boolean
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.showDailyForecast,
);

export const selectZipCode: Selector<
  PremiumWeatherForecastState,
  string | undefined
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.zipCode,
);

export const selectStation: Selector<
  PremiumWeatherForecastState,
  Station | undefined
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.selectedStation,
);

export const selectShowStationSelect: Selector<
  PremiumWeatherForecastState,
  boolean
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.showStationSelect,
);

export const selectShowZipCode: Selector<PremiumWeatherForecastState, boolean> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.showZipCode,
);

export const selectPremiumRequestSuccess: Selector<
  PremiumWeatherForecastState,
  boolean
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.hasSuccessPremiumRequest,
);

export const selectHourlyData: Selector<
  PremiumWeatherForecastState,
  ReadonlyArray<HourlyObservationData>
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.hourlyObservation,
);

export const selectTimezone: Selector<
  PremiumWeatherForecastState,
  string | undefined
> = createSelector(
  baseSelector,
  premiumWeatherForecast => premiumWeatherForecast.timezone,
);
