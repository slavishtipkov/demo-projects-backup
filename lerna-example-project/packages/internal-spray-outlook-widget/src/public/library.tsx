import { renderWidget, WidgetFactory } from "@dtn/browser-render-lib";
import {
  Clock,
  initialState as i18nInitialState,
  Locales,
  reducer as i18nReducer,
  Units,
} from "@dtn/i18n-lib";
import * as React from "react";
import { ReducersMapObject } from "redux";
import { Observable } from "rxjs";
import { pairwise } from "rxjs/operators";
import { Location, View } from "../interfaces";
import { ApiService } from "../services";
import {
  fetchSprayOutlookEpic,
  fetchThresholdDefaultsEpic,
  fetchThresholdSettingsEpic,
  initialState,
  PublicApiCallbacks,
  reducer,
  saveThresholdSettingsEpic,
  selectCurrentView,
  SprayOutlookActions,
  SprayOutlookEpic,
  SprayOutlookState,
} from "../store";
import { IndexView } from "../ui/views";
import { SprayOutlook } from "../ui/widgets";

export interface WidgetConfig {
  readonly locations: ReadonlyArray<Location>;
  readonly initialView?: View;
  readonly callbacks?: PublicApiCallbacks;
}

export interface ThemeProp {
  readonly baseWeatherIconUrl: string;
  readonly button?: string;
}

export type CreateSprayOutlookWidget = WidgetFactory<WidgetConfig, ThemeProp>;

export const createSprayOutlookWidget: CreateSprayOutlookWidget = ({
  container,
  token,
  baseUrl,
  units = Units.IMPERIAL,
  locale = Locales.ENGLISH,
  clock = Clock.TWELVE_HOUR,
  callbacks,
  locations,
  initialView,
  theme,
}) => {
  let component: any;
  let rootComponent = (
    <SprayOutlook ref={x => (component = x)} theme={theme} locations={locations} />
  );

  let rootReducer: ReducersMapObject<SprayOutlookState, SprayOutlookActions | any> = {
    sprayOutlook: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<SprayOutlookEpic> = [
    fetchSprayOutlookEpic,
    fetchThresholdSettingsEpic,
    fetchThresholdDefaultsEpic,
    saveThresholdSettingsEpic,
  ];

  let epicDependencies = {
    api: new ApiService({
      token,
      units,
      locale,
      baseUrl,
    }),
    callbacks,
  };

  let { store } = renderWidget<SprayOutlookState, SprayOutlookActions, typeof epicDependencies>({
    rootComponent,
    container,
    rootReducer,
    epics,
    epicDependencies,
    initialState: {
      sprayOutlook: {
        ...initialState,
        locations,
        currentView: initialView,
      },
      i18n: {
        ...i18nInitialState,
        units,
        locale,
        clock,
      },
    },
  });

  if (callbacks) {
    if (callbacks.viewDidChange) {
      let { viewDidChange } = callbacks;
      let state$ = new Observable<SprayOutlookState>(observer => {
        store.subscribe(() => observer.next(store.getState()));
      });

      state$
        .pipe(pairwise())
        .subscribe(([previousState, state]: ReadonlyArray<SprayOutlookState>) => {
          if (selectCurrentView(previousState).view !== selectCurrentView(state).view) {
            viewDidChange(selectCurrentView(state));
          }
        });
    }
  }

  let inner: IndexView = component.getWrappedInstance();
  return {
    changeView(nextView: View): void {
      switch (nextView.view) {
        case "SETTINGS":
          inner.setSettingsView();
          return;
        case "STATION":
          if (!nextView.locationName) {
            throw new Error("You must supply a location name");
          }
          inner.setStationView(nextView.locationName);
          return;
        case "OVERVIEW":
        default:
          inner.setOverviewView();
          return;
      }
    },
  };
};
