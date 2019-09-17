import { Action, ActionCreator } from "redux";
import { CashBidChartData } from "../interfaces";

export const enum ActionTypes {
  BASIC_CASH_BIDS_REQUEST = "BASIC_CASH_BIDS_REQUEST",
  BASIC_CASH_BIDS_FETCHED_SUCCESS = "BASIC_CASH_BIDS_FETCHED_SUCCESS",
  BASIC_CASH_BIDS_FETCHED_ERROR = "BASIC_CASH_BIDS_FETCHED_ERROR",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  CHANGE_CASH_BID_ID = "CHANGE_CASH_BID_ID",
}

export type Actions =
  | FetchBasicCashBidsData
  | BasicCashBidsFetchedSuccess
  | BasicCashBidsFetchedError
  | ChangeCashBidId
  | SetErrorMessage;

export interface FetchBasicCashBidsData extends Action<ActionTypes> {
  readonly type: ActionTypes.BASIC_CASH_BIDS_REQUEST;
  readonly payload: {
    readonly cashBidId: number;
    readonly duration: string;
    readonly siteId: string;
  };
}

export const fetchBasicCashBidsData: ActionCreator<FetchBasicCashBidsData> = (
  cashBidId: number,
  duration: string,
  siteId: string,
) => ({
  type: ActionTypes.BASIC_CASH_BIDS_REQUEST,
  payload: {
    cashBidId,
    duration,
    siteId,
  },
});

export interface BasicCashBidsFetchedSuccess extends Action<ActionTypes> {
  readonly type: ActionTypes.BASIC_CASH_BIDS_FETCHED_SUCCESS;
  readonly payload: {
    readonly chartData: ReadonlyArray<CashBidChartData>;
    readonly symbol?: string;
    readonly commodity?: string;
    readonly location?: string;
    readonly deliveryEndDate?: string;
    readonly updatedAt?: string;
  };
}

export const basicCashBidsFetchedSuccess: ActionCreator<BasicCashBidsFetchedSuccess> = (
  chartData: ReadonlyArray<CashBidChartData>,
  symbol?: string,
  commodity?: string,
  location?: string,
  deliveryEndDate?: string,
  updatedAt?: string,
) => ({
  type: ActionTypes.BASIC_CASH_BIDS_FETCHED_SUCCESS,
  payload: {
    symbol,
    chartData,
    commodity,
    location,
    deliveryEndDate,
    updatedAt,
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
