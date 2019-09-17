import { Commodities } from "@dtn/api-lib";
import { renderWidget, WidgetFactory } from "@dtn/browser-render-lib";
import {
  initialState as i18nInitialState,
  Locales,
  reducer as i18nReducer,
  Units,
} from "@dtn/i18n-lib";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReducersMapObject } from "redux";
import { BehaviorSubject } from "rxjs";
import { pairwise } from "rxjs/operators";
import { ALL_COMMODITIES, ERRORS } from "../constants";
import { ApiService } from "../services";
import {
  initialState,
  marketStrategiesChartsEpic,
  marketStrategiesEpic,
  premiumMarketStrategiesEpic,
  PremiumSixFactorsMarketStrategiesActions,
  PremiumSixFactorsMarketStrategiesEpic,
  PremiumSixFactorsMarketStrategiesState,
  PublicApiCallbacks,
  reducer,
  selectDefaultCommodity,
} from "../store";
import ErrorContainer from "../ui/components/error-container";
import IndexView from "../ui/views/index-view";
import { PremiumSixFactorsMarketStrategies } from "../ui/widgets";

export interface WidgetConfig {
  readonly apiKey: string;
  readonly container: HTMLElement | string;
  readonly units?: Units;
  readonly userId: string;
  readonly defaultCommodity: Commodities;
  readonly showCommodities?: ReadonlyArray<Commodities> | boolean;
  readonly callbacks?: PublicApiCallbacks;
}

export interface ThemeProp {}

export interface PublicApi {
  readonly setCommodity: (commodity: Commodities) => void;
}

export type CreatePremiumMarketStrategiesWidget = WidgetFactory<
  WidgetConfig,
  ThemeProp,
  Promise<PublicApi>
>;

export const createPremiumMarketStrategiesWidget: CreatePremiumMarketStrategiesWidget = async ({
  container,
  apiKey,
  baseUrl = "https://api.dtn.com",
  units = Units.IMPERIAL,
  locale = Locales.ENGLISH,
  userId,
  defaultCommodity = "CORN",
  showCommodities = true,
  theme = {},
  callbacks,
}) => {
  let containerElement =
    container instanceof Element ? container : document.querySelector(container);
  if (containerElement === null) {
    throw new Error("No container found");
  }
  if (!isCommodity(defaultCommodity)) {
    ReactDOM.render(<ErrorContainer error={ERRORS.wrongConfigMessage.key} />, containerElement);
    throw new Error(ERRORS.wrongConfigMessage.value);
  }

  let commodities: ReadonlyArray<Commodities> = [];
  if (showCommodities === true) {
    commodities = [...ALL_COMMODITIES];
  } else if (showCommodities === false || showCommodities.length === 0) {
    commodities = [];
  } else {
    const filteredValidCommodities = showCommodities.filter(isCommodity);
    const filteredCommoditiesIncludeDefault: boolean = filteredValidCommodities.includes(
      defaultCommodity,
    );

    commodities = filteredCommoditiesIncludeDefault
      ? filteredValidCommodities
      : [defaultCommodity, ...filteredValidCommodities];
  }

  let component: any;
  let rootComponent = (
    <PremiumSixFactorsMarketStrategies ref={x => (component = x)} theme={theme} />
  );

  let rootReducer: ReducersMapObject<
    PremiumSixFactorsMarketStrategiesState,
    PremiumSixFactorsMarketStrategiesActions | any
  > = {
    premiumSixFactorsMarketStrategies: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<PremiumSixFactorsMarketStrategiesEpic | any> = [
    marketStrategiesEpic,
    premiumMarketStrategiesEpic,
    marketStrategiesChartsEpic,
  ];

  let epicDependencies = {
    api: new ApiService({
      token: apiKey,
      units,
      locale,
      baseUrl,
    }),
  };

  let { store } = renderWidget<
    PremiumSixFactorsMarketStrategiesState,
    PremiumSixFactorsMarketStrategiesActions,
    typeof epicDependencies
  >({
    rootComponent,
    container,
    rootReducer,
    epics,
    epicDependencies,
    initialState: {
      premiumSixFactorsMarketStrategies: {
        ...initialState,
        units,
        user: userId,
        defaultCommodity: defaultCommodity
          ? (defaultCommodity.toUpperCase() as Commodities)
          : defaultCommodity,
        showCommodities,
        commodities,
      },
      i18n: {
        ...i18nInitialState,
        units,
        locale,
      },
    },
  });

  let state$ = new BehaviorSubject<PremiumSixFactorsMarketStrategiesState>(store.getState());
  store.subscribe(() => state$.next(store.getState()));
  if (callbacks) {
    state$
      .asObservable()
      .pipe(pairwise())
      .subscribe(
        ([previousState, state]: ReadonlyArray<PremiumSixFactorsMarketStrategiesState>) => {
          const { onCommodityChange } = callbacks;
          if (
            onCommodityChange &&
            selectDefaultCommodity(previousState) !== selectDefaultCommodity(state)
          ) {
            onCommodityChange(selectDefaultCommodity(state) as Commodities);
          }
        },
      );
  }

  const inner: IndexView = component.getWrappedInstance();
  return new Promise<PublicApi>(resolve => {
    resolve({
      setCommodity(commodity: Commodities): void {
        if (isCommodity(commodity)) {
          inner.props.fetchMarketStrategies(commodity);
        } else {
          inner.props.setErrorMessage("wrongConfigMessage");
        }
      },
    });
  });
};

function isCommodity(c: Commodities): c is Commodities {
  return ALL_COMMODITIES.includes(c);
}
