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
  PublicApiCallbacks,
  reducer,
  BasicCashBidsActions,
  BasicCashBidsEpic,
  BasicCashBidsState,
  selectLoading,
  selectError,
  basicCashBidsEpic,
  selectSiteId,
  selectCashBidId,
} from "../store";
import { BasicCashBidsChart } from "../ui/widgets";
import { BehaviorSubject } from "rxjs";
import { ERRORS } from "../constants";
import IndexView from "../ui/views/index-view";
import {
  CashBidId,
  SiteId,
  showCurrentBasis,
  show3YearAverageCashPrice,
  show3YearAverageBasis,
  PortalCashBid,
} from "../types";

export interface WidgetConfig {
  readonly apiKey: string;
  readonly container: HTMLElement | string;
  readonly cashBidId: CashBidId;
  readonly siteId: SiteId;
  readonly showCurrentBasis: showCurrentBasis;
  readonly show3YearAverageBasis: show3YearAverageBasis;
  readonly show3YearAverageCashPrice: show3YearAverageCashPrice;
  readonly callbacks?: PublicApiCallbacks;
  readonly units?: Units;
}

export interface ThemeProp {}

export interface PublicApi {
  readonly setCashBid: (portalCashBid: PortalCashBid) => void;
}

export type CreateCashBidsChartWidget = WidgetFactory<WidgetConfig, ThemeProp, Promise<PublicApi>>;

export const createCashBidsChartWidget: CreateCashBidsChartWidget = async ({
  container,
  cashBidId,
  apiKey,
  baseUrl = "https://api.dtn.com",
  locale = Locales.ENGLISH,
  theme = {},
  siteId,
  showCurrentBasis = true,
  show3YearAverageBasis = true,
  show3YearAverageCashPrice = true,
  units = Units.IMPERIAL,
  callbacks,
}) => {
  let component: any;
  let rootComponent = <BasicCashBidsChart ref={x => (component = x)} theme={theme} />;

  let rootReducer: ReducersMapObject<BasicCashBidsState, BasicCashBidsActions | any> = {
    basicCashBids: reducer,
    i18n: i18nReducer,
  };

  let epics: ReadonlyArray<BasicCashBidsEpic> = [basicCashBidsEpic];

  let epicDependencies = {
    api: new ApiService({
      token: apiKey,
      locale,
      baseUrl,
    }),
  };

  let { store } = renderWidget<BasicCashBidsState, BasicCashBidsActions, typeof epicDependencies>({
    rootComponent,
    container,
    rootReducer,
    epics,
    epicDependencies,
    initialState: {
      basicCashBids: {
        ...initialState,
        cashBidId,
        siteId,
        showCurrentBasis,
        show3YearAverageBasis,
        show3YearAverageCashPrice,
      },
      i18n: {
        ...i18nInitialState,
        locale,
        units,
      },
    },
  });

  let state$ = new BehaviorSubject<BasicCashBidsState>(store.getState());
  store.subscribe(() => state$.next(store.getState()));
  if (callbacks) {
    state$
      .asObservable()
      .pipe(pairwise())
      .subscribe(([previousState, state]: ReadonlyArray<BasicCashBidsState>) => {
        const { onCashBidChange } = callbacks;
        if (onCashBidChange && selectCashBidId(previousState) !== selectCashBidId(state)) {
          const siteId = selectSiteId(state);
          const cashBidId = selectCashBidId(state);
          if (siteId && cashBidId) {
            onCashBidChange({ siteId, cashBidId });
          }
        }
      });
  }

  const inner: IndexView = component.getWrappedInstance();

  return new Promise<PublicApi>(resolve => {
    resolve({
      setCashBid: (portalCashBid: PortalCashBid): void => {
        inner.props.fetchBasicCashBids(
          portalCashBid.cashBidId,
          inner.props.duration,
          portalCashBid.siteId,
        );
      },
    });
  });
};
