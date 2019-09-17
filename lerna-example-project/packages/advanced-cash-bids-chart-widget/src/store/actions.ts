import { Action, ActionCreator } from "redux";
import { CashBidChartData } from "../interfaces";

export const enum ActionTypes {
  BASIC_CASH_BIDS_REQUEST = "BASIC_CASH_BIDS_REQUEST",
  BASIC_CASH_BIDS_FETCHED_SUCCESS = "BASIC_CASH_BIDS_FETCHED_SUCCESS",
  BASIC_CASH_BIDS_FETCHED_ERROR = "BASIC_CASH_BIDS_FETCHED_ERROR",
  REDRAW_CASH_BIDS_DATA = "REDRAW_CASH_BIDS_DATA",
  REDRAW_CASH_BIDS_DATA_SUCCESS = "REDRAW_CASH_BIDS_DATA_SUCCESS",
  REDRAW_CASH_BIDS_DATA_ERROR = "REDRAW_CASH_BIDS_DATA_ERROR",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  CHANGE_CASH_BID_ID = "CHANGE_CASH_BID_ID",
  FETCH_LOCATIONS_FOR_SITE = "FETCH_LOCATIONS_FOR_SITE",
  FETCH_LOCATIONS_FOR_SITE_SUCCESS = "FETCH_LOCATIONS_FOR_SITE_SUCCESS",
  FETCH_LOCATIONS_FOR_SITE_ERROR = "FETCH_LOCATIONS_FOR_SITE_ERROR",
  FETCH_COMMODITIES_FOR_SITE = "FETCH_COMMODITIES_FOR_SITE",
  FETCH_COMMODITIES_FOR_SITE_SUCCESS = "FETCH_COMMODITIES_FOR_SITE_SUCCESS",
  FETCH_DELIVERY_PERIODS = "FETCH_DELIVERY_PERIODS",
  FETCH_DELIVERY_PERIODS_SUCCESS = "FETCH_DELIVERY_PERIODS_SUCCESS",
  CHANGE_LOCATION = "CHANGE_LOCATION",
  CHANGE_COMMODITY = "CHANGE_COMMODITY",
  CHANGE_DELIVERY_END_DATE = "CHANGE_DELIVERY_END_DATE",
  CHANGE_RANGE = "CHANGE_RANGE",
  CHANGE_ADDITIONAL_OPTIONS = "CHANGE_ADDITIONAL_OPTIONS",
  SET_REDRAW_CHART_TIME = "SET_REDRAW_CHART_TIME",
}

export type Actions =
  | FetchBasicCashBidsData
  | BasicCashBidsFetchedSuccess
  | BasicCashBidsFetchedError
  | RedrawCashBidsData
  | RedrawCashBidsDataSuccess
  | RedrawCashBidsDataError
  | ChangeCashBidId
  | SetErrorMessage
  | FetchLocationsForSite
  | FetchLocationsForSiteSuccess
  | FetchLocationsForSiteError
  | FetchCommoditiesForSite
  | FetchCommoditiesForSiteSuccess
  | FetchDeliveryPeriods
  | FetchDeliveryPeriodsSuccess
  | ChangeLocation
  | ChangeCommodity
  | ChangeDeliveryEndDate
  | ChangeRange
  | ChangeAdditionalOptions
  | SetRedrawChartTime;

export interface FetchBasicCashBidsData extends Action<ActionTypes> {
  readonly type: ActionTypes.BASIC_CASH_BIDS_REQUEST;
  readonly payload: {
    readonly cashBidId: number;
    readonly duration: string;
    readonly siteId: string;
    readonly locationId?: number;
    readonly commodityId?: number;
    readonly range: {
      readonly start: string;
      readonly end: string;
    };
  };
}

export const fetchBasicCashBidsData: ActionCreator<FetchBasicCashBidsData> = (
  cashBidId: number,
  duration: string,
  siteId: string,
  range: {
    readonly start: string;
    readonly end: string;
  },
  locationId?: number,
  commodityId?: number,
) => ({
  type: ActionTypes.BASIC_CASH_BIDS_REQUEST,
  payload: {
    cashBidId,
    duration,
    siteId,
    range,
    locationId,
    commodityId,
  },
});

export interface BasicCashBidsFetchedSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.BASIC_CASH_BIDS_FETCHED_SUCCESS;
  readonly payload: {
    readonly chartData: ReadonlyArray<CashBidChartData>;
    readonly symbol?: string;
    readonly commodity?: string;
    readonly commodityId?: number;
    readonly location?: string;
    readonly locationId?: number;
    readonly deliveryEndDate?: string;
    readonly updatedAt?: string;
    readonly cashBidId?: number;
    readonly deliveryPeriods: ReadonlyArray<{
      readonly cashBidId: number;
      readonly deliveryPeriod: {
        readonly start: string;
        readonly end: string;
      };
    }>;
  };
}

export const basicCashBidsFetchedSuccess: ActionCreator<BasicCashBidsFetchedSuccess> = (
  chartData: ReadonlyArray<CashBidChartData>,
  deliveryPeriods: ReadonlyArray<{
    readonly cashBidId: number;
    readonly deliveryPeriod: {
      readonly start: string;
      readonly end: string;
    };
  }>,
  symbol?: string,
  commodity?: string,
  commodityId?: number,
  location?: string,
  locationId?: number,
  deliveryEndDate?: string,
  updatedAt?: string,
  cashBidId?: number,
) => ({
  type: ActionTypes.BASIC_CASH_BIDS_FETCHED_SUCCESS,
  payload: {
    chartData,
    deliveryPeriods,
    symbol,
    commodity,
    commodityId,
    location,
    locationId,
    deliveryEndDate,
    updatedAt,
    cashBidId,
  },
});

export interface BasicCashBidsFetchedError extends Action<ActionTypes> {
  readonly type: ActionTypes.BASIC_CASH_BIDS_FETCHED_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const basicCashBidsFetchedError: ActionCreator<BasicCashBidsFetchedError> = (
  errorMessage: string,
) => ({
  type: ActionTypes.BASIC_CASH_BIDS_FETCHED_ERROR,
  payload: new Error(errorMessage),
  error: true,
});

export interface RedrawCashBidsData extends Action<ActionTypes> {
  readonly type: ActionTypes.REDRAW_CASH_BIDS_DATA;
  readonly payload: {
    readonly cashBidId: number;
    readonly duration: string;
    readonly siteId: string;
    readonly range: {
      readonly start: string;
      readonly end: string;
    };
  };
}

export const redrawCashBidsData: ActionCreator<RedrawCashBidsData> = (
  cashBidId: number,
  duration: string,
  siteId: string,
  range: {
    readonly start: string;
    readonly end: string;
  },
) => ({
  type: ActionTypes.REDRAW_CASH_BIDS_DATA,
  payload: {
    cashBidId,
    duration,
    siteId,
    range,
  },
});

export interface RedrawCashBidsDataSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.REDRAW_CASH_BIDS_DATA_SUCCESS;
  readonly payload: {
    readonly chartData: ReadonlyArray<CashBidChartData>;
    readonly symbol?: string;
    readonly commodity?: string;
    readonly commodityId?: number;
    readonly location?: string;
    readonly locationId?: number;
    readonly deliveryEndDate?: string;
    readonly updatedAt?: string;
    readonly deliveryPeriods: ReadonlyArray<{
      readonly cashBidId: number;
      readonly deliveryPeriod: {
        readonly start: string;
        readonly end: string;
      };
    }>;
  };
}

export const redrawCashBidsDataSuccess: ActionCreator<RedrawCashBidsDataSuccess> = (
  chartData: ReadonlyArray<CashBidChartData>,
  deliveryPeriods: ReadonlyArray<{
    readonly cashBidId: number;
    readonly deliveryPeriod: {
      readonly start: string;
      readonly end: string;
    };
  }>,
  symbol?: string,
  commodity?: string,
  commodityId?: number,
  location?: string,
  locationId?: number,
  deliveryEndDate?: string,
  updatedAt?: string,
) => ({
  type: ActionTypes.REDRAW_CASH_BIDS_DATA_SUCCESS,
  payload: {
    chartData,
    deliveryPeriods,
    symbol,
    commodity,
    commodityId,
    location,
    locationId,
    deliveryEndDate,
    updatedAt,
  },
});

export interface RedrawCashBidsDataError extends Action<ActionTypes> {
  readonly type: ActionTypes.REDRAW_CASH_BIDS_DATA_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const redrawCashBidsDataError: ActionCreator<RedrawCashBidsDataError> = (
  errorMessage: string,
) => ({
  type: ActionTypes.REDRAW_CASH_BIDS_DATA_ERROR,
  payload: new Error(errorMessage),
  error: true,
});

export interface SetErrorMessage extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_ERROR_MESSAGE;
  readonly payload: Error;
  readonly error?: boolean;
}

export const setErrorMessage: ActionCreator<SetErrorMessage> = (error: string) => ({
  type: ActionTypes.SET_ERROR_MESSAGE,
  payload: new Error(error),
  error: true,
});

export interface ChangeCashBidId extends Action<ActionTypes> {
  readonly type: ActionTypes.CHANGE_CASH_BID_ID;
  readonly payload: {
    readonly cashBidId: number;
  };
}

export const changeCashBidId: ActionCreator<ChangeCashBidId> = (cashBidId: number) => ({
  type: ActionTypes.CHANGE_CASH_BID_ID,
  payload: {
    cashBidId,
  },
});

export interface ChangeLocation extends Action<ActionTypes> {
  readonly type: ActionTypes.CHANGE_LOCATION;
  readonly payload: {
    readonly locationId?: number;
    readonly location?: string;
  };
}

export const changeLocation: ActionCreator<ChangeLocation> = (
  locationId: number,
  location: string,
) => ({
  type: ActionTypes.CHANGE_LOCATION,
  payload: {
    locationId,
    location,
  },
});

export interface ChangeCommodity extends Action<ActionTypes> {
  readonly type: ActionTypes.CHANGE_COMMODITY;
  readonly payload: {
    readonly commodityId?: number;
    readonly commodity?: string;
  };
}

export const changeCommodity: ActionCreator<ChangeCommodity> = (
  commodityId: number,
  commodity: string,
) => ({
  type: ActionTypes.CHANGE_COMMODITY,
  payload: {
    commodityId,
    commodity,
  },
});

export interface ChangeDeliveryEndDate extends Action<ActionTypes> {
  readonly type: ActionTypes.CHANGE_DELIVERY_END_DATE;
  readonly payload: {
    readonly deliveryEndDate: string;
    readonly cashBidId: number;
  };
}

export const changeDeliveryEndDate: ActionCreator<ChangeDeliveryEndDate> = (
  deliveryEndDate: string,
  cashBidId: number,
) => ({
  type: ActionTypes.CHANGE_DELIVERY_END_DATE,
  payload: {
    deliveryEndDate,
    cashBidId,
  },
});

export interface ChangeRange extends Action<ActionTypes> {
  readonly type: ActionTypes.CHANGE_RANGE;
  readonly payload: {
    readonly range: {
      readonly start: string;
      readonly end: string;
    };
  };
}

export const changeRange: ActionCreator<ChangeRange> = (range: {
  readonly start: string;
  readonly end: string;
}) => ({
  type: ActionTypes.CHANGE_RANGE,
  payload: {
    range,
  },
});

export interface ChangeAdditionalOptions extends Action<ActionTypes> {
  readonly type: ActionTypes.CHANGE_ADDITIONAL_OPTIONS;
  readonly payload: {
    readonly additionalOptions: {
      readonly showCurrentBasis: boolean;
      readonly show3YearAverageBasis: boolean;
      readonly show3YearAverageCashPrice: boolean;
    };
  };
}

export const changeAdditionalOptions: ActionCreator<ChangeAdditionalOptions> = (additionalOptions: {
  readonly showCurrentBasis: boolean;
  readonly show3YearAverageBasis: boolean;
  readonly show3YearAverageCashPrice: boolean;
}) => ({
  type: ActionTypes.CHANGE_ADDITIONAL_OPTIONS,
  payload: {
    additionalOptions,
  },
});

export interface FetchLocationsForSite extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_LOCATIONS_FOR_SITE;
  readonly payload: {
    readonly siteId: string;
  };
}

export const fetchLocationsForSite: ActionCreator<FetchLocationsForSite> = (siteId: string) => ({
  type: ActionTypes.FETCH_LOCATIONS_FOR_SITE,
  payload: {
    siteId,
  },
});

export interface FetchLocationsForSiteError extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_LOCATIONS_FOR_SITE_ERROR;
  readonly payload: Error;
  readonly error?: boolean;
}

export const fetchLocationsForSiteError: ActionCreator<FetchLocationsForSiteError> = (
  errorMessage: string,
) => ({
  type: ActionTypes.FETCH_LOCATIONS_FOR_SITE_ERROR,
  payload: new Error(errorMessage),
  error: true,
});

export interface FetchLocationsForSiteSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_LOCATIONS_FOR_SITE_SUCCESS;
  readonly payload: {
    readonly locations: ReadonlyArray<{
      readonly grainBidElevatorIds: ReadonlyArray<number>;
      readonly links: Object;
      readonly id: number;
      readonly name: string;
    }>;
  };
}

export const fetchLocationsForSiteSuccess: ActionCreator<FetchLocationsForSiteSuccess> = (
  locations: ReadonlyArray<{
    readonly grainBidElevatorIds: ReadonlyArray<number>;
    readonly links: Object;
    readonly id: number;
    readonly name: string;
  }>,
) => ({
  type: ActionTypes.FETCH_LOCATIONS_FOR_SITE_SUCCESS,
  payload: {
    locations,
  },
});

export interface FetchCommoditiesForSite extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_COMMODITIES_FOR_SITE;
  readonly payload: {
    readonly siteId: string;
    readonly locationId: number;
  };
}

export const fetchCommoditiesForSite: ActionCreator<FetchCommoditiesForSite> = (
  siteId: string,
  locationId: number,
) => ({
  type: ActionTypes.FETCH_COMMODITIES_FOR_SITE,
  payload: {
    siteId,
    locationId,
  },
});

export interface FetchCommoditiesForSiteSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_COMMODITIES_FOR_SITE_SUCCESS;
  readonly payload: {
    readonly commodities: ReadonlyArray<{
      readonly commodityName: string;
      readonly id: number;
    }>;
  };
}

export const fetchCommoditiesForSiteSuccess: ActionCreator<FetchCommoditiesForSiteSuccess> = (
  commodities: ReadonlyArray<{
    readonly commodityName: string;
    readonly id: number;
  }>,
) => ({
  type: ActionTypes.FETCH_COMMODITIES_FOR_SITE_SUCCESS,
  payload: {
    commodities,
  },
});

export interface FetchDeliveryPeriods extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_DELIVERY_PERIODS;
  readonly payload: {
    readonly siteId: string;
    readonly locationId: number;
    readonly commodityId: number;
  };
}

export const fetchDeliveryPeriods: ActionCreator<FetchDeliveryPeriods> = (
  siteId: string,
  locationId: number,
  commodityId: number,
) => ({
  type: ActionTypes.FETCH_DELIVERY_PERIODS,
  payload: {
    siteId,
    locationId,
    commodityId,
  },
});

export interface FetchDeliveryPeriodsSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.FETCH_DELIVERY_PERIODS_SUCCESS;
  readonly payload: {
    readonly deliveryPeriods: ReadonlyArray<{
      readonly cashBidId: number;
      readonly deliveryPeriod: {
        readonly start: string;
        readonly end: string;
      };
    }>;
  };
}

export const fetchDeliveryPeriodsSuccess: ActionCreator<FetchDeliveryPeriodsSuccess> = (
  deliveryPeriods: ReadonlyArray<{
    readonly cashBidId: number;
    readonly deliveryPeriod: {
      readonly start: string;
      readonly end: string;
    };
  }>,
) => ({
  type: ActionTypes.FETCH_DELIVERY_PERIODS_SUCCESS,
  payload: {
    deliveryPeriods,
  },
});

export interface SetRedrawChartTime extends Action<ActionTypes> {
  readonly type: ActionTypes.SET_REDRAW_CHART_TIME;
  readonly payload: {
    readonly redrawChartTime: string;
    readonly previousRedrawState: string;
  };
}

export const setRedrawChartTime: ActionCreator<SetRedrawChartTime> = (
  redrawChartTime: string,
  previousRedrawState: string,
) => ({
  type: ActionTypes.SET_REDRAW_CHART_TIME,
  payload: {
    redrawChartTime,
    previousRedrawState,
  },
});
