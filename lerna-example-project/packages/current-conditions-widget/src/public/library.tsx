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
  fetchCurrentConditionsEpic,
  initialState,
  PublicApiCallbacks,
  reducer,
  CurrentConditionsActions,
  CurrentConditionsEpic,
  CurrentConditionsState,
  selectLoadingState,
  selectCoordinates,
  selectCurrentConditionsByObservation,
  selectError,
  fetchObservedAtEpic,
} from "../store";
import { CurrentConditions } from "../ui/widgets";
import { BehaviorSubject } from "rxjs";
import { Coordinates, ForecastProps, DailySurfaceData } from "../interfaces";
import { ERRORS, VISIBLE_FIELDS } from "../constants";
import { IndexView } from "../ui/views";

export interface WidgetConfig {
  readonly callbacks?: PublicApiCallbacks;
  readonly coordinates: Coordinates;
  readonly visibleFields: ForecastProps;
  readonly showCurrentObservation?: boolean;
}

export interface ThemeProp {}

export interface PublicApi {
  readonly fetchCurrentConditionsDataAction: (
    coordinates: Coordinates,
    days: number,
    units?: string,
  ) => void;
  readonly changeCurrentConditionsByForecast: (
    currentConditionsByForecast: ReadonlyArray<DailySurfaceData>,
  ) => void;
}

export type CreateCurrentConditionsWidget = WidgetFactory<WidgetConfig, ThemeProp, PublicApi>;

export const createCurrentConditionsWidget: CreateCurrentConditionsWidget = ({
  container,
  coordinates,
  visibleFields,
  token,
  baseUrl = "https://api.dtn.com",
  callbacks,
  units,
  locale = Locales.ENGLISH,
  theme = {},
  showCurrentObservation = true,
}) => {
  const days = 1;
  let component: any;
  let rootComponent = <CurrentConditions ref={x => (component = x)} theme={theme} />;

  const fields: ForecastProps = { ...VISIBLE_FIELDS, ...visibleFields };

  let rootReducer: ReducersMapObject<CurrentConditionsState, CurrentConditionsActions | any> = {
    currentConditionsState: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<CurrentConditionsEpic> = [
    fetchCurrentConditionsEpic,
    fetchObservedAtEpic,
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

  let { store } = renderWidget<
    CurrentConditionsState,
    CurrentConditionsActions,
    typeof epicDependencies
  >({
    rootComponent,
    container,
    rootReducer,
    epics,
    epicDependencies,
    initialState: {
      currentConditionsState: {
        ...initialState,
        coordinates,
        visibleFields: fields,
        days,
        units,
        showCurrentObservation,
      },
      i18n: {
        ...i18nInitialState,
        units,
        locale,
      },
    },
  });

  let state$ = new BehaviorSubject<CurrentConditionsState>(store.getState());
  store.subscribe(() => state$.next(store.getState()));

  if (callbacks) {
    state$
      .asObservable()
      .pipe(pairwise())
      .subscribe(([previousState, state]: ReadonlyArray<CurrentConditionsState>) => {
        const {
          loadingStateDidChange,
          coordinatesStateDidChange,
          currentConditionsDidChange,
          onError,
        } = callbacks;

        if (
          loadingStateDidChange &&
          selectLoadingState(previousState) !== selectLoadingState(state)
        ) {
          loadingStateDidChange(selectLoadingState(state));
        }

        if (
          coordinatesStateDidChange &&
          selectCoordinates(previousState) !== selectCoordinates(state)
        ) {
          coordinatesStateDidChange(selectCoordinates(state));
        }

        if (
          currentConditionsDidChange &&
          selectCurrentConditionsByObservation(previousState) !==
            selectCurrentConditionsByObservation(state)
        ) {
          const coordinates = selectCurrentConditionsByObservation(state);
          if (coordinates) {
            currentConditionsDidChange({
              lat: coordinates[0].latitude,
              lon: coordinates[0].longitude,
            });
          }
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
    changeCurrentConditionsByForecast(
      currentConditionsByForecast: ReadonlyArray<DailySurfaceData>,
    ): void {
      inner.props.changeCurrentConditionsByForecast(currentConditionsByForecast);
    },
    fetchCurrentConditionsDataAction(coordinates: Coordinates, days: number, units?: string): void {
      inner.props.fetchCurrentConditionsDataAction(coordinates, days, units);
    },
  };
};
