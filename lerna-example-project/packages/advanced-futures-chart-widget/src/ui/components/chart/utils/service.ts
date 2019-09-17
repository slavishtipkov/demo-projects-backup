import { BehaviorSubject } from "rxjs";

export const studiesDataSubject = new BehaviorSubject<{
  readonly sma: boolean;
  readonly rsi: boolean;
  readonly bollingerBands: boolean;
  readonly slowStochastic: boolean;
  readonly fastStochastic: boolean;
  readonly macd: boolean;
  readonly volume: boolean;

  readonly [key: string]: boolean;
}>({
  sma: true,
  rsi: true,
  bollingerBands: true,
  slowStochastic: true,
  fastStochastic: true,
  macd: true,
  volume: true,
});
