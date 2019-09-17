export interface HistoricPrice {
  readonly oi: number | null;
  readonly date: string;
  readonly open: number | null;
  readonly close: number | null;
  readonly low: number | null;
  readonly high: number | null;
  readonly volume: number | null;
  readonly open_text: string | null;
  readonly high_text: string | null;
  readonly low_text: string | null;
  readonly close_text: string | null;
  readonly macd: {
    readonly macd?: number | string;
    readonly signal?: number | string;
    readonly divergence?: number | string;
  };
  readonly fastSTO: {
    readonly K?: number;
    readonly D?: number;
  };
  readonly slowSTO: {
    readonly K?: number;
    readonly D?: number;
  };
  readonly bb: {
    readonly top: number;
    readonly middle: number;
    readonly bottom: number;
  };
  readonly sma9: number;
  readonly sma4: number;
  readonly sma18: number;
  readonly rsi: number;
  readonly [key: string]:
    | null
    | string
    | number
    | {
        readonly macd?: number | string;
        readonly signal?: number | string;
        readonly divergence?: number | string;
      }
    | {
        readonly K?: number;
        readonly D?: number;
      }
    | {
        readonly top: number;
        readonly middle: number;
        readonly bottom: number;
      };
}

export interface Symbol {
  readonly description: string;
  readonly marketName: string;
  readonly symbol: string;
  readonly tickerSymbol: string;
  readonly vendor: string;
}

export interface Quote {
  readonly symbol: Symbol;
  readonly tradeDateTime: string;
  readonly close: number;
  readonly last: number;
  readonly previous: number;
  readonly low: number;
  readonly high: number;
  readonly cumVolume: number;
  readonly quoteDelay?: number;
}

export interface SymbolPriceHistory {
  readonly description: string;
  readonly historicPrices: ReadonlyArray<HistoricPrice>;
  readonly marketName: string;
  readonly priceInterval: string;
  readonly symbol: string;
  readonly tickerSymbol: string;
  readonly vendor: string;
}

export interface SymbolConfig {
  readonly symbol: string;
  readonly isDescriptionVisible: boolean;
  readonly isSymbolVisible: boolean;
}

export interface ChartStudies {
  readonly bollingerBands: boolean;
  readonly sma: boolean;
  readonly rsi: boolean;
  readonly slowStochastic: boolean;
  readonly fastStochastic: boolean;
}
