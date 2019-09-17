import { Reducer } from "redux";
import { BasicCashBidsActions } from "./";
import { ActionTypes } from "./actions";
import { CashBidChartData } from "../interfaces";

export interface State {
  readonly updatedAt?: string;
  readonly symbol?: string;
  readonly cashBidId: number;
  readonly location?: string;
  readonly commodity?: string;
  readonly deliveryEndDate?: string;
  readonly duration: string;
  readonly chartData: ReadonlyArray<CashBidChartData>;
  readonly loading: boolean;
  readonly error?: string;
  readonly siteId: string;
  readonly locationId?: number;
  readonly commodityId?: number;
  readonly range?: {
    readonly start: string;
    readonly end: string;
  };
  readonly showCurrentBasis: boolean;
  readonly show3YearAverageBasis: boolean;
  readonly show3YearAverageCashPrice: boolean;
  readonly locations: ReadonlyArray<{
    readonly grainBidElevatorIds: ReadonlyArray<number>;
    readonly links: Object;
    readonly id: number;
    readonly name: string;
  }>;
  readonly commodities: ReadonlyArray<{
    readonly commodityName: string;
    readonly id: number;
  }>;
  readonly deliveryPeriods: ReadonlyArray<{
    readonly cashBidId: number;
    readonly deliveryPeriod: {
      readonly start: string;
      readonly end: string;
    };
  }>;
  readonly redrawChartTime: string;
  readonly previousRedrawState?: string;
}

export const initialState: State = {
  loading: false,
  cashBidId: 0,
  siteId: "",
  duration: "12-M",
  chartData: [],
  showCurrentBasis: true,
  show3YearAverageBasis: true,
  show3YearAverageCashPrice: true,
  locations: [],
  commodities: [],
  deliveryPeriods: [],
  redrawChartTime: "",
};

export const reducer: Reducer<State, BasicCashBidsActions> = (state = initialState, action) => {
  if (!action) return state;

  switch (action.type) {
    case ActionTypes.BASIC_CASH_BIDS_REQUEST:
      return {
        ...state,
        cashBidId: action.payload.cashBidId,
        siteId: action.payload.siteId,
        range: action.payload.range,
        locationId: action.payload.locationId,
        commodityId: action.payload.commodityId,
        loading: true,
        error: undefined,
      };
    case ActionTypes.BASIC_CASH_BIDS_FETCHED_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        chartData: action.payload.chartData,
        symbol: action.payload.symbol,
        commodity: action.payload.commodity,
        commodityId: action.payload.commodityId,
        location: action.payload.location,
        locationId: action.payload.locationId,
        deliveryEndDate: action.payload.deliveryEndDate,
        updatedAt: action.payload.updatedAt,
        deliveryPeriods: action.payload.deliveryPeriods,
        cashBidId: action.payload.cashBidId ? action.payload.cashBidId : 0,
      };
    case ActionTypes.REDRAW_CASH_BIDS_DATA:
      return {
        ...state,
        cashBidId: action.payload.cashBidId,
        siteId: action.payload.siteId,
        loading: true,
        error: undefined,
      };
    case ActionTypes.REDRAW_CASH_BIDS_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        chartData: action.payload.chartData,
        symbol: action.payload.symbol,
        commodity: action.payload.commodity ? action.payload.commodity : state.commodity,
        commodityId: action.payload.commodityId ? action.payload.commodityId : state.commodityId,
        location: action.payload.location ? action.payload.location : state.location,
        locationId: action.payload.locationId ? action.payload.locationId : state.locationId,
        deliveryEndDate: action.payload.deliveryEndDate
          ? action.payload.deliveryEndDate
          : state.deliveryEndDate,
        updatedAt: action.payload.updatedAt,
        deliveryPeriods: action.payload.deliveryPeriods
          ? action.payload.deliveryPeriods
          : state.deliveryPeriods,
      };
    case ActionTypes.REDRAW_CASH_BIDS_DATA_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    case ActionTypes.CHANGE_CASH_BID_ID:
      return {
        ...state,
        cashBidId: action.payload.cashBidId,
      };
    case ActionTypes.BASIC_CASH_BIDS_FETCHED_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    case ActionTypes.SET_ERROR_MESSAGE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    case ActionTypes.CHANGE_LOCATION:
      return {
        ...state,
        locationId: action.payload.locationId,
        location: action.payload.location,
      };
    case ActionTypes.CHANGE_COMMODITY:
      return {
        ...state,
        commodityId: action.payload.commodityId,
        commodity: action.payload.commodity,
      };
    case ActionTypes.CHANGE_DELIVERY_END_DATE:
      return {
        ...state,
        deliveryEndDate: action.payload.deliveryEndDate,
        cashBidId: action.payload.cashBidId,
      };
    case ActionTypes.CHANGE_RANGE:
      return {
        ...state,
        range: action.payload.range,
      };
    case ActionTypes.CHANGE_ADDITIONAL_OPTIONS:
      return {
        ...state,
        showCurrentBasis: action.payload.additionalOptions.showCurrentBasis,
        show3YearAverageBasis: action.payload.additionalOptions.show3YearAverageBasis,
        show3YearAverageCashPrice: action.payload.additionalOptions.show3YearAverageCashPrice,
      };
    case ActionTypes.FETCH_LOCATIONS_FOR_SITE_SUCCESS:
      return {
        ...state,
        locations: action.payload.locations,
      };
    case ActionTypes.FETCH_LOCATIONS_FOR_SITE_ERROR:
      return {
        ...state,
        locations: [],
        error: action.payload.message,
      };
    case ActionTypes.FETCH_COMMODITIES_FOR_SITE:
      return {
        ...state,
        commodities: [],
      };
    case ActionTypes.FETCH_COMMODITIES_FOR_SITE_SUCCESS:
      return {
        ...state,
        commodities: action.payload.commodities,
      };
    case ActionTypes.FETCH_DELIVERY_PERIODS:
      return {
        ...state,
        deliveryPeriods: [],
      };
    case ActionTypes.FETCH_DELIVERY_PERIODS_SUCCESS:
      return {
        ...state,
        deliveryPeriods: action.payload.deliveryPeriods,
      };
    case ActionTypes.SET_REDRAW_CHART_TIME:
      return {
        ...state,
        redrawChartTime: action.payload.redrawChartTime,
        previousRedrawState: action.payload.previousRedrawState,
      };
    default:
      return state;
  }
};
