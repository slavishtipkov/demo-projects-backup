import { renderWidget, WidgetFactory } from "@dtn/browser-render-lib";
import { pairwise } from "rxjs/operators";
import {
  initialState as i18nInitialState,
  Locales,
  reducer as i18nReducer,
  Units,
} from "@dtn/i18n-lib";
import * as React from "react";
import * as moment from "moment-timezone";
import { ReducersMapObject } from "redux";
import { ApiService } from "../services";
import {
  initialState,
  PublicApiCallbacks,
  reducer,
  BasicCashBidsActions,
  BasicCashBidsEpic,
  BasicCashBidsState,
  basicCashBidsEpic,
  redrawCashBidsEpic,
  selectRedrawChartTime,
  selectLocationId,
  selectCommodityId,
  selectRange,
  selectDeliveryEndDate,
  selectCashBidId,
  locationsCashBidEpic,
  commoditiesCashBidEpic,
  deliveryPeriodCashBidEpic,
  selectPreviousRedrawState,
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
  DefaultCashBidLocationAndCommodity,
  DefaultCashBidId,
} from "../types";

export interface WidgetConfig {
  readonly apiKey: string;
  readonly container: HTMLElement | string;
  readonly defaultCashBid?: DefaultCashBidId | DefaultCashBidLocationAndCommodity;
  readonly siteId: SiteId;
  readonly showCurrentBasis: showCurrentBasis;
  readonly show3YearAverageBasis: show3YearAverageBasis;
  readonly show3YearAverageCashPrice: show3YearAverageCashPrice;
  readonly callbacks?: PublicApiCallbacks;
  readonly units?: Units;
}

export interface ThemeProp {}

export interface PublicApi {
  readonly setCashBid: (cashBid: DefaultCashBidId | DefaultCashBidLocationAndCommodity) => void;
}

export type CreateAdvancedCashBidsChartWidget = WidgetFactory<
  WidgetConfig,
  ThemeProp,
  Promise<PublicApi>
>;

export const createAdvancedCashBidsChartWidget: CreateAdvancedCashBidsChartWidget = async ({
  container,
  defaultCashBid,
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

  let epics: ReadonlyArray<BasicCashBidsEpic> = [
    basicCashBidsEpic,
    redrawCashBidsEpic,
    locationsCashBidEpic,
    commoditiesCashBidEpic,
    deliveryPeriodCashBidEpic,
  ];

  let epicDependencies = {
    api: new ApiService({
      token: apiKey,
      locale,
      baseUrl,
    }),
  };

  const defaultCashBidIdData = defaultCashBid as DefaultCashBidId;
  const defaultCashBidLocationData = defaultCashBid as DefaultCashBidLocationAndCommodity;
  const range = defaultCashBidIdData
    ? defaultCashBidIdData.range
    : undefined || defaultCashBidLocationData
    ? defaultCashBidLocationData.range
    : undefined;
  let parsedRange = {};
  const previousDate = new Date();
  const dateNow = new Date();

  if (range) {
    const normalizedRange = range.trim().toUpperCase();
    if (normalizedRange.includes("-")) {
      const interval = normalizedRange.split("-")[0];
      const realRange = normalizedRange.split("-")[1];
      if (realRange === "M") {
        previousDate.setMonth(previousDate.getMonth() - parseInt(interval));
        previousDate.setDate(previousDate.getDate() + 1);
        parsedRange = {
          start: previousDate.toISOString(),
          end: dateNow.toISOString(),
        };
      } else if (realRange === "D") {
        previousDate.setDate(previousDate.getDate() - parseInt(interval));
        previousDate.setDate(previousDate.getDate() + 1);
        parsedRange = {
          start: previousDate.toISOString(),
          end: dateNow.toISOString(),
        };
      } else if (realRange === "W") {
        previousDate.setDate(previousDate.getDate() - parseInt(interval) * 7);
        previousDate.setDate(previousDate.getDate() + 1);
        parsedRange = {
          start: previousDate.toISOString(),
          end: dateNow.toISOString(),
        };
      } else if (realRange === "Y") {
        previousDate.setMonth(previousDate.getMonth() - parseInt(interval) * 12);
        previousDate.setDate(previousDate.getDate() + 1);
        parsedRange = {
          start: previousDate.toISOString(),
          end: dateNow.toISOString(),
        };
      } else {
        previousDate.setMonth(previousDate.getMonth() - 12);
        previousDate.setDate(previousDate.getDate() + 1);
        parsedRange = {
          start: previousDate.toISOString(),
          end: dateNow.toISOString(),
        };
      }
    } else {
      if (normalizedRange === "M") {
        previousDate.setMonth(previousDate.getMonth() - 1);
        previousDate.setDate(previousDate.getDate() + 1);
        parsedRange = {
          start: previousDate.toISOString(),
          end: dateNow.toISOString(),
        };
      } else if (normalizedRange === "D") {
        previousDate.setDate(previousDate.getDate() - 1);
        parsedRange = {
          start: previousDate.toISOString(),
          end: dateNow.toISOString(),
        };
      } else if (normalizedRange === "W") {
        previousDate.setDate(previousDate.getDate() - 7);
        previousDate.setDate(previousDate.getDate() + 1);
        parsedRange = {
          start: previousDate.toISOString(),
          end: dateNow.toISOString(),
        };
      } else {
        previousDate.setMonth(previousDate.getMonth() - 12);
        previousDate.setDate(previousDate.getDate() + 1);
        parsedRange = {
          start: previousDate.toISOString(),
          end: dateNow.toISOString(),
        };
      }
    }
  } else {
    previousDate.setMonth(previousDate.getMonth() - 12);
    previousDate.setDate(previousDate.getDate() + 1);
    parsedRange = {
      start: previousDate.toISOString(),
      end: dateNow.toISOString(),
    };
  }

  let { store } = renderWidget<BasicCashBidsState, BasicCashBidsActions, typeof epicDependencies>({
    rootComponent,
    container,
    rootReducer,
    epics,
    epicDependencies,
    initialState: {
      basicCashBids: {
        ...initialState,
        cashBidId: defaultCashBidIdData ? defaultCashBidIdData.cashBidId : undefined,
        locationId: defaultCashBidLocationData ? defaultCashBidLocationData.locationId : undefined,
        commodityId: defaultCashBidLocationData
          ? defaultCashBidLocationData.commodityId
          : undefined,
        range: parsedRange,
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
        if (
          onCashBidChange &&
          selectRedrawChartTime(previousState) !== selectRedrawChartTime(state) &&
          selectPreviousRedrawState(previousState) !== selectPreviousRedrawState(state)
        ) {
          const locationId = selectLocationId(state);
          const commodityId = selectCommodityId(state);
          const range = selectRange(state);
          const endDate = range ? new Date(range.end) : new Date();
          const startDate = range ? new Date(range.start) : new Date();
          const days = moment(endDate).diff(moment(startDate), "days", true) + 1;
          const deliveryEndDate = new Date(selectDeliveryEndDate(state) as string);

          if (locationId && commodityId && range && deliveryEndDate) {
            onCashBidChange({ locationId, commodityId, range: `${days}-D`, deliveryEndDate });
          }
        }
      });
  }

  const inner: IndexView = component.getWrappedInstance();

  return new Promise<PublicApi>(resolve => {
    resolve({
      setCashBid: (cashBid: DefaultCashBidId | DefaultCashBidLocationAndCommodity): void => {
        const defaultCashBidIdData = cashBid as DefaultCashBidId;
        const defaultCashBidLocationData = cashBid as DefaultCashBidLocationAndCommodity;
        const range = defaultCashBidIdData
          ? defaultCashBidIdData.range
          : undefined || defaultCashBidLocationData
          ? defaultCashBidLocationData.range
          : undefined;
        let parsedRange = { start: "", end: "" };
        const previousDate = new Date();
        const dateNow = new Date();

        if (range) {
          const normalizedRange = range.trim().toUpperCase();
          if (normalizedRange.includes("-")) {
            const interval = normalizedRange.split("-")[0];
            const realRange = normalizedRange.split("-")[1];
            if (realRange === "M") {
              previousDate.setMonth(previousDate.getMonth() - parseInt(interval));
              previousDate.setDate(previousDate.getDate() + 1);
              parsedRange = {
                start: previousDate.toISOString(),
                end: dateNow.toISOString(),
              };
            } else if (realRange === "D") {
              previousDate.setDate(previousDate.getDate() - parseInt(interval));
              previousDate.setDate(previousDate.getDate() + 1);
              parsedRange = {
                start: previousDate.toISOString(),
                end: dateNow.toISOString(),
              };
            } else if (realRange === "W") {
              previousDate.setDate(previousDate.getDate() - parseInt(interval) * 7);
              previousDate.setDate(previousDate.getDate() + 1);
              parsedRange = {
                start: previousDate.toISOString(),
                end: dateNow.toISOString(),
              };
            } else if (realRange === "Y") {
              previousDate.setMonth(previousDate.getMonth() - parseInt(interval) * 12);
              previousDate.setDate(previousDate.getDate() + 1);
              parsedRange = {
                start: previousDate.toISOString(),
                end: dateNow.toISOString(),
              };
            } else {
              previousDate.setMonth(previousDate.getMonth() - 12);
              previousDate.setDate(previousDate.getDate() + 1);
              parsedRange = {
                start: previousDate.toISOString(),
                end: dateNow.toISOString(),
              };
            }
          } else {
            if (normalizedRange === "M") {
              previousDate.setMonth(previousDate.getMonth() - 1);
              previousDate.setDate(previousDate.getDate() + 1);
              parsedRange = {
                start: previousDate.toISOString(),
                end: dateNow.toISOString(),
              };
            } else if (normalizedRange === "D") {
              previousDate.setDate(previousDate.getDate() - 1);
              parsedRange = {
                start: previousDate.toISOString(),
                end: dateNow.toISOString(),
              };
            } else if (normalizedRange === "W") {
              previousDate.setDate(previousDate.getDate() - 7);
              previousDate.setDate(previousDate.getDate() + 1);
              parsedRange = {
                start: previousDate.toISOString(),
                end: dateNow.toISOString(),
              };
            } else {
              previousDate.setMonth(previousDate.getMonth() - 12);
              previousDate.setDate(previousDate.getDate() + 1);
              parsedRange = {
                start: previousDate.toISOString(),
                end: dateNow.toISOString(),
              };
            }
          }
        } else {
          previousDate.setMonth(previousDate.getMonth() - 12);
          previousDate.setDate(previousDate.getDate() + 1);
          parsedRange = {
            start: previousDate.toISOString(),
            end: dateNow.toISOString(),
          };
        }

        inner.props.fetchBasicCashBids(
          defaultCashBidIdData.cashBidId,
          inner.props.duration,
          inner.props.siteId,
          parsedRange,
          defaultCashBidLocationData.locationId,
          defaultCashBidLocationData.commodityId,
        );
      },
    });
  });
};
