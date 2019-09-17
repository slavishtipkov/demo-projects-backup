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
  fetchWeatherForecastEpic,
  initialState,
  PublicApiCallbacks,
  reducer,
  WeatherForecastActions,
  WeatherForecastEpic,
  WeatherForecastState,
  selectLoading,
  selectCoordinates,
  selectActiveDay,
  selectWeatherForecast,
  selectError,
  selectAllowDaySelection,
  fetchObservedAtEpic,
} from "../store";
import { WeatherForecast } from "../ui/widgets";
import { BehaviorSubject } from "rxjs";
import { Coordinates } from "../interfaces";
import { ERRORS } from "../constants";
import IndexView from "../ui/views/index-view";

export interface WidgetConfig {
  readonly coordinates: Coordinates;
  readonly callbacks?: PublicApiCallbacks;
  readonly allowDaySelection?: boolean;
  readonly units?: Units;
  readonly showFooter?: boolean;
}

export interface ThemeProp {}

export interface PublicApi {
  readonly fetchWeatherForecastData: (
    coordinates: Coordinates,
    days: number,
    units?: string,
    showFooter?: boolean,
  ) => void;
  readonly setActiveDay: (activeDay: number) => void;
  readonly setAllowDaySelection: (allowDaySelection: boolean) => void;
  readonly hideFooter: () => void;
}

export type CreateFiveDaysForecastWidget = WidgetFactory<WidgetConfig, ThemeProp, PublicApi>;

export const createFiveDaysForecastWidget: CreateFiveDaysForecastWidget = ({
  container,
  coordinates,
  allowDaySelection,
  token,
  baseUrl = "https://api.dtn.com",
  callbacks,
  units,
  locale = Locales.ENGLISH,
  theme = {},
  showFooter = true,
}) => {
  const days = 5;
  let component: any;
  let rootComponent = (
    <WeatherForecast
      ref={x => (component = x)}
      theme={theme}
      coordinates={coordinates}
      days={days}
      allowDaySelection={allowDaySelection}
    />
  );

  let rootReducer: ReducersMapObject<WeatherForecastState, WeatherForecastActions | any> = {
    weatherForecast: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<WeatherForecastEpic> = [fetchWeatherForecastEpic, fetchObservedAtEpic];

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
    WeatherForecastState,
    WeatherForecastActions,
    typeof epicDependencies
  >({
    rootComponent,
    container,
    rootReducer,
    epics,
    epicDependencies,
    initialState: {
      weatherForecast: {
        ...initialState,
        coordinates,
        allowDaySelection,
        days,
        units,
        showFooter,
      },
      i18n: {
        ...i18nInitialState,
        units,
        locale,
      },
    },
  });

  let state$ = new BehaviorSubject<WeatherForecastState>(store.getState());
  store.subscribe(() => state$.next(store.getState()));

  if (callbacks) {
    state$
      .asObservable()
      .pipe(pairwise())
      .subscribe(([previousState, state]: ReadonlyArray<WeatherForecastState>) => {
        const {
          loadingStateDidChange,
          coordinatesStateDidChange,
          weatherForecastDidChange,
          activeDayDidChange,
          allowDaySelectionDidChange,
          onError,
        } = callbacks;

        if (loadingStateDidChange && selectLoading(previousState) !== selectLoading(state)) {
          loadingStateDidChange(selectLoading(state));
        }

        if (
          coordinatesStateDidChange &&
          JSON.stringify(selectCoordinates(previousState)) !==
            JSON.stringify(selectCoordinates(state))
        ) {
          coordinatesStateDidChange(selectCoordinates(state));
        }

        if (
          weatherForecastDidChange &&
          JSON.stringify(selectWeatherForecast(previousState)) !==
            JSON.stringify(selectWeatherForecast(state))
        ) {
          const coordinates = selectWeatherForecast(state);
          weatherForecastDidChange({ lat: coordinates[0].latitude, lon: coordinates[0].longitude });
        }

        if (activeDayDidChange && selectActiveDay(previousState) !== selectActiveDay(state)) {
          activeDayDidChange(selectWeatherForecast(state), selectActiveDay(state));
        }

        if (
          allowDaySelectionDidChange &&
          selectAllowDaySelection(previousState) !== selectAllowDaySelection(state)
        ) {
          allowDaySelectionDidChange(selectAllowDaySelection(state));
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
    hideFooter(): void {
      inner.props.hideFooter();
    },
    setAllowDaySelection(allowDaySelection: boolean): void {
      inner.props.setAllowDaySelection(allowDaySelection);
    },
    setActiveDay(activeDay: number): void {
      inner.props.setActiveDay(activeDay);
    },
    fetchWeatherForecastData(
      coordinates: Coordinates,
      days: number,
      units?: string,
      showFooter?: boolean,
    ): void {
      inner.props.fetchWeatherForecastData(coordinates, days, units, showFooter);
    },
  };
};
