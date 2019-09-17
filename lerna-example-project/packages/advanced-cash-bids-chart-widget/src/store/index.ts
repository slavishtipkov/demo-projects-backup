import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { Epic } from "redux-observable";
import { ApiService } from "../services/";
import { Actions } from "./actions";
import { State } from "./reducers";
import { PortalCashBid } from "../types";

export * from "./actions";
export * from "./epics";
export * from "./reducers";
export * from "./selectors";

export interface BasicCashBidsState extends I18nState {
  readonly basicCashBids: State;
}
export type BasicCashBidsActions = Actions | I18nActions;
export interface EpicDependencies {
  readonly api: ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
}
export interface PublicApiCallbacks {
  readonly onCashBidChange: (cashBid: {
    readonly locationId: number;
    readonly commodityId: number;
    readonly range: string;
    readonly deliveryEndDate: Date;
  }) => void;
}
export type BasicCashBidsEpic = Epic<
  BasicCashBidsActions,
  BasicCashBidsActions,
  BasicCashBidsState,
  EpicDependencies
>;
