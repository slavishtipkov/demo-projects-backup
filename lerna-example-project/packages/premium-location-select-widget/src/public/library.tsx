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
  PremiumLocationSelectActions,
  PremiumLocationSelectEpic,
  PremiumLocationSelectState,
  fetchStationsEpic,
  PublicApiCallbacks,
  reducer,
  selectError,
  selectSelectedStation,
} from "../store";
import { PremiumLocationSelect } from "../ui/widgets";
import { BehaviorSubject } from "rxjs";
import { Station } from "../interfaces";
import { ERRORS } from "../constants";
import IndexView from "../ui/views/index-view";

export interface WidgetConfig {
  readonly callbacks?: PublicApiCallbacks;
  readonly stations: ReadonlyArray<Station>;
  readonly user: string;
}

export interface ThemeProp {}

export interface PublicApi {
  readonly setSelectedStation: (selectedStation: Station) => void;
  readonly removeSelectedStation: () => void;
}

export type CreatePremiumLocationSelectWidget = WidgetFactory<WidgetConfig, ThemeProp, PublicApi>;

export const createPremiumLocationSelectWidget: CreatePremiumLocationSelectWidget = ({
  container,
  token,
  baseUrl = "https://api.dtn.com",
  callbacks,
  locale = Locales.ENGLISH,
  theme = {},
  stations,
  user,
}) => {
  let component: any;
  let rootComponent = <PremiumLocationSelect ref={x => (component = x)} theme={theme} />;

  let rootReducer: ReducersMapObject<
    PremiumLocationSelectState,
    PremiumLocationSelectActions | any
  > = {
    locationSelectState: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<PremiumLocationSelectEpic> = [fetchStationsEpic];

  let epicDependencies = {
    locationSelectApi: new ApiService({
      token,
      locale,
      baseUrl,
    }),
    callbacks,
  };

  let { store } = renderWidget<
    PremiumLocationSelectState,
    PremiumLocationSelectActions,
    typeof epicDependencies
  >({
    rootComponent,
    container,
    rootReducer,
    epics,
    epicDependencies,
    initialState: {
      locationSelectState: {
        ...initialState,
        user,
        stations,
      },
      i18n: {
        ...i18nInitialState,
        locale,
      },
    },
  });

  let state$ = new BehaviorSubject<PremiumLocationSelectState>(store.getState());
  store.subscribe(() => state$.next(store.getState()));

  if (callbacks) {
    state$
      .asObservable()
      .pipe(pairwise())
      .subscribe(([previousState, state]: ReadonlyArray<PremiumLocationSelectState>) => {
        const { selectedStationDidChange, onError } = callbacks;

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
      });
  }

  const inner: IndexView = component.getWrappedInstance();
  return {
    removeSelectedStation(): void {
      inner.props.removeSelectedStation();
    },
    setSelectedStation(selectedStation: Station): void {
      inner.props.setSelectedStation(selectedStation);
    },
  };
};
