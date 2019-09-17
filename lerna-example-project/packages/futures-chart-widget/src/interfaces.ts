export interface HistoricPrice {
  readonly oi: number | null;
  readonly date: string;
  readonly open: number | null;
  readonly close: number | null;
  readonly low: number | null;
  readonly high: number | null;
  readonly volume: number | null;
  readonly open_text: string;
  readonly high_text: string;
  readonly low_text: string;
  readonly close_text: string;

  readonly [key: string]: number | string | null;
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

export interface ChartRequestDataI {
  readonly close?: {
    readonly number: number;
    readonly text: string;
  };
  readonly startDateTime: string;
  readonly high?: {
    readonly number: number;
    readonly text: string;
  };
  readonly low?: {
    readonly number: number;
    readonly text: string;
  };
  readonly open?: {
    readonly number: number;
    readonly text: string;
  };
  readonly oi?: number;
  readonly volume?: number;
}
