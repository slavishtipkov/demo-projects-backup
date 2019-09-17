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
  readonly showCurrentBasis: boolean;
  readonly show3YearAverageBasis: boolean;
  readonly show3YearAverageCashPrice: boolean;
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
};

export const reducer: Reducer<State, BasicCashBidsActions> = (state = initialState, action) => {
  if (!action) return state;

  switch (action.type) {
    case ActionTypes.BASIC_CASH_BIDS_REQUEST:
      return {
        ...state,
        cashBidId: action.payload.cashBidId,
        siteId: action.payload.siteId,
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
        location: action.payload.location,
        deliveryEndDate: action.payload.deliveryEndDate,
        updatedAt: action.payload.updatedAt,
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
    default:
      return state;
  }
};
