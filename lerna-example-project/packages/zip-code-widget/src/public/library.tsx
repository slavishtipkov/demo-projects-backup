import { renderWidget, WidgetFactory } from "@dtn/browser-render-lib";
import {
  Clock,
  initialState as i18nInitialState,
  Locales,
  reducer as i18nReducer,
} from "@dtn/i18n-lib";
import * as React from "react";
import { ReducersMapObject } from "redux";
import { ApiService } from "../services";
import {
  fetchZipCodeDataEpic,
  initialState,
  PublicApiCallbacks,
  reducer,
  ZipCodeActions,
  ZipCodeEpic,
  fetchZipCodeByCoordinatesEpic,
  ZipCodeState,
  selectLoadingState,
  selectCoordinates,
  selectErrorState,
  selectZipCode,
} from "../store";
// import { IndexView } from "../ui/views";
import { ZipCode } from "../ui/widgets";
// import { Observable } from "rxjs/internal/Observable";
import { BehaviorSubject } from "rxjs";
import { pairwise } from "rxjs/operators";
import { ERRORS } from "../constants";
import IndexView from "../ui/views/index-view";
import { CoordinatesForZipCode } from "../interfaces";

export interface WidgetConfig {
  readonly callbacks?: PublicApiCallbacks;
}

export interface ThemeProp {}

export interface PublicApi {
  readonly fetchZipCode: (zipCode: string) => void;
  readonly getZipCodeByCoordinates: (coordinates: CoordinatesForZipCode) => void;
  readonly removeZipCodeValue: () => void;
}

export type CreateZipCodeWidget = WidgetFactory<WidgetConfig, ThemeProp, PublicApi>;

export const createZipCodeWidget: CreateZipCodeWidget = ({
  container,
  token,
  baseUrl = "https://api.dtn.com",
  locale = Locales.ENGLISH,
  callbacks,
  theme = {},
}) => {
  let component: any;
  let rootComponent = <ZipCode ref={x => (component = x)} theme={theme} />;

  let rootReducer: ReducersMapObject<ZipCodeState, ZipCodeActions | any> = {
    zipCodeState: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<ZipCodeEpic> = [fetchZipCodeDataEpic, fetchZipCodeByCoordinatesEpic];

  let epicDependencies = {
    zipApi: new ApiService({
      token,
      locale,
      baseUrl,
    }),
    callbacks,
  };

  let { store } = renderWidget<ZipCodeState, ZipCodeActions, typeof epicDependencies>({
    rootComponent,
    container,
    rootReducer,
    epics,
    epicDependencies,
    initialState: {
      zipCodeState: {
        ...initialState,
      },
      i18n: {
        ...i18nInitialState,
        locale,
      },
    },
  });

  // The pairwise() operator return new observable only if we have two emitted messages
  // in this case if we don't use BehaviorSubject with default state we will miss
  // the first iteration over the callbacks.
  let state$ = new BehaviorSubject<ZipCodeState>(store.getState());
  store.subscribe(() => state$.next(store.getState()));

  if (callbacks) {
    state$
      .asObservable()
      .pipe(pairwise())
      .subscribe(([previousState, state]: ReadonlyArray<ZipCodeState>) => {
        const {
          loadingStateDidChange,
          zipCodeDidChange,
          coordinatesDidChange,
          onError,
        } = callbacks;
        if (
          loadingStateDidChange &&
          selectLoadingState(previousState) !== selectLoadingState(state)
        ) {
          loadingStateDidChange(selectLoadingState(state));
        }
        if (zipCodeDidChange && selectZipCode(previousState) !== selectZipCode(state)) {
          zipCodeDidChange(selectZipCode(state));
        }
        if (
          coordinatesDidChange &&
          JSON.stringify(selectCoordinates(previousState)) !==
            JSON.stringify(selectCoordinates(state))
        ) {
          coordinatesDidChange(selectCoordinates(state));
        }
        if (onError && selectErrorState(previousState) !== selectErrorState(state)) {
          const newErrorState = selectErrorState(state);
          onError(
            newErrorState
              ? ERRORS[`${selectErrorState(state)}`]
                ? ERRORS[`${selectErrorState(state)}`].value
                : selectErrorState(state)
              : newErrorState,
          );
        }
      });
  }

  const inner: IndexView = component.getWrappedInstance();
  return {
    removeZipCodeValue(): void {
      inner.props.removeZipCodeValue();
    },
    getZipCodeByCoordinates(coordinates: CoordinatesForZipCode): void {
      inner.props.getZipCodeByCoordinates(coordinates);
    },
    fetchZipCode(zipCode: string): void {
      inner.props.fetchZipCode(zipCode);
    },
  };
};
