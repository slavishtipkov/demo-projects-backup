import { Moment } from "moment";
import { createSelector, Selector } from "reselect";
import { GetThresholdSettings, Location, StationOutlook, View } from "../interfaces";
import { SprayOutlookState, State } from "./";

export const baseSelector: Selector<SprayOutlookState, State> = ({ sprayOutlook }) => sprayOutlook;

export const selectLocations: Selector<SprayOutlookState, ReadonlyArray<Location>> = createSelector(
  baseSelector,
  sprayOutlook => sprayOutlook.locations,
);

export const selectOutlooks: Selector<
  SprayOutlookState,
  ReadonlyArray<StationOutlook>
> = createSelector(
  baseSelector,
  sprayOutlook => sprayOutlook.outlooks,
);

export const selectSettings: Selector<
  SprayOutlookState,
  GetThresholdSettings | undefined
> = createSelector(
  baseSelector,
  sprayOutlook => sprayOutlook.settings,
);

export const selectCurrentView: Selector<SprayOutlookState, View> = createSelector(
  baseSelector,
  sprayOutlook => sprayOutlook.currentView,
);

export const selectPreviousView: Selector<SprayOutlookState, View | undefined> = createSelector(
  baseSelector,
  sprayOutlook => sprayOutlook.previousView,
);

export const selectForecastTimestamp: Selector<
  SprayOutlookState,
  Moment | undefined
> = createSelector(
  baseSelector,
  sprayOutlook => sprayOutlook.forecastTimestamp,
);

export const selectSettingsSaveInFlight: Selector<SprayOutlookState, boolean> = createSelector(
  baseSelector,
  sprayOutlook => sprayOutlook.settingsSaveInFlight,
);
