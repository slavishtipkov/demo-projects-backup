import { renderWidget, WidgetFactory } from "@dtn/browser-render-lib";
import { pairwise } from "rxjs/operators";
import {
  initialState as i18nInitialState,
  Locales,
  reducer as i18nReducer,
  Units,
} from "@dtn/i18n-lib";
import * as React from "react";
import { ReducersMapObject } from "redux";
import { ApiService } from "../services";
import {
  initialState,
  LocationSelectActions,
  LocationSelectEpic,
  LocationSelectState,
  PublicApiCallbacks,
  reducer,
  selectError,
  selectSelectedStation,
  fetchStationsEpic,
  selectIsSameStationSelected,
} from "../store";
import { LocationSelect } from "../ui/widgets";
import { BehaviorSubject } from "rxjs";
import { Station } from "../interfaces";
import { ERRORS } from "../constants";
import IndexView from "../ui/views/index-view";

export interface WidgetConfig {
  readonly callbacks?: PublicApiCallbacks;
  readonly stations: ReadonlyArray<Station>;
}

export interface ThemeProp {}

export interface PublicApi {
  readonly setSelectedStation: (selectedStation: Station) => void;
  readonly removeSelectedStation: () => void;
}

export type CreateLocationSelectWidget = WidgetFactory<WidgetConfig, ThemeProp, PublicApi>;

export const createLocationSelectWidget: CreateLocationSelectWidget = ({
  container,
  token,
  baseUrl = "https://api.dtn.com",
  callbacks,
  locale = Locales.ENGLISH,
  theme = {},
  stations,
}) => {
  let component: any;
  let rootComponent = <LocationSelect ref={x => (component = x)} theme={theme} />;

  let rootReducer: ReducersMapObject<LocationSelectState, LocationSelectActions | any> = {
    locationSelectState: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<LocationSelectEpic> = [fetchStationsEpic];

  let epicDependencies = {
    api: new ApiService({
      token,
      locale,
      baseUrl,
    }),
    callbacks,
  };

  let { store } = renderWidget<LocationSelectState, LocationSelectActions, typeof epicDependencies>(
    {
      rootComponent,
      container,
      rootReducer,
      epics,
      epicDependencies,
      initialState: {
        locationSelectState: {
          ...initialState,
          stations,
        },
        i18n: {
          ...i18nInitialState,
          locale,
        },
      },
    },
  );

  let state$ = new BehaviorSubject<LocationSelectState>(store.getState());
  store.subscribe(() => state$.next(store.getState()));
  const inner: IndexView = component.getWrappedInstance();

  if (callbacks) {
    state$
      .asObservable()
      .pipe(pairwise())
      .subscribe(([previousState, state]: ReadonlyArray<LocationSelectState>) => {
        const { selectedStationDidChange, onError, isSameStationSelected } = callbacks;

        if (
          selectedStationDidChange &&
          selectSelectedStation(previousState) !== selectSelectedStation(state)
        ) {
          selectedStationDidChange(selectSelectedStation(state));
        }

        if (onError && selectError(previousState) !== selectError(state)) {
          const newErrorState = selectError(state);
          onError(
            newErrorState
              ? ERRORS[`${selectError(state)}`]
                ? ERRORS[`${selectError(state)}`].value
                : selectError(state)
              : newErrorState,
          );
        }

        if (
          isSameStationSelected &&
          selectIsSameStationSelected(previousState) !== selectIsSameStationSelected(state) &&
          selectIsSameStationSelected(state)
        ) {
          isSameStationSelected(selectSelectedStation(state));
          inner.props.setIsSameStationSelected(false);
        }
      });
  }

  return {
    removeSelectedStation(): void {
      inner.props.removeSelectedStation();
    },
    setSelectedStation(selectedStation: Station): void {
      inner.props.setSelectedStation(selectedStation);
    },
  };
};
