import { SymbolPriceHistory, HistoricPrice, ChartRequestDataI } from "../interfaces";

export const getRandomLength = (): number => {
  const min = 32;
  const max = 42;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const dec2hex = (dec: any) => {
  return `0${dec.toString(16)}`.substr(-2);
};

export const generateId = (len?: number) => {
  const arr = new Uint8Array((len || 40) / 2);
  const cryptoObj = window.crypto || (window as any).msCrypto; // for IE 11
  cryptoObj.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
};

export const normalizeApiResponse = (data: {
  readonly description: string;
  readonly marketName: string;
  readonly symbol: string;
  readonly tickerSymbol: string;
  readonly vendor: string;
  readonly priceInterval: string;
  readonly historicPrices: ReadonlyArray<ChartRequestDataI>;
}): SymbolPriceHistory => {
  return {
    ...data,
    historicPrices: data.historicPrices.map((h: ChartRequestDataI) => {
      const tick: HistoricPrice = {
        date: h.startDateTime,
        open: h.open ? h.open.number : null,
        open_text: h.open ? h.open.text : "",
        high: h.high ? h.high.number : null,
        high_text: h.high ? h.high.text : "",
        low: h.low ? h.low.number : null,
        low_text: h.low ? h.low.text : "",
        close: h.close ? h.close.number : null,
        close_text: h.close ? h.close.text : "",
        oi: h.oi ? h.oi : null,
        volume: h.volume ? h.volume : null,
      };
      return tick;
    }),
  };
};
