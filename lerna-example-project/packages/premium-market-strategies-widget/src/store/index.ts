import { Actions as I18nActions, State as I18nState } from "@dtn/i18n-lib";
import { Epic } from "redux-observable";
import { ApiService } from "../services/";
import { Actions } from "./actions";
import { State } from "./reducers";
import { Commodities } from "@dtn/api-lib";

export * from "./actions";
export * from "./epics";
export * from "./reducers";
export * from "./selectors";

export interface PremiumSixFactorsMarketStrategiesState extends I18nState {
  readonly premiumSixFactorsMarketStrategies: State;
}
export type PremiumSixFactorsMarketStrategiesActions = Actions | I18nActions;
export interface EpicDependencies {
  readonly api: ApiService;
  readonly publicApiCallbacks?: PublicApiCallbacks;
}
export interface PublicApiCallbacks {
  readonly onCommodityChange: (commodity: Commodities) => void;
}
export type PremiumSixFactorsMarketStrategiesEpic = Epic<
  PremiumSixFactorsMarketStrategiesActions,
  PremiumSixFactorsMarketStrategiesActions,
  PremiumSixFactorsMarketStrategiesState,
  EpicDependencies
>;
