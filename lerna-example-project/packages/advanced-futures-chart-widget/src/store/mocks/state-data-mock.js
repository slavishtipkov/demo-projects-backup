import * as ResponseMock from "./response-data-mock";

export const stateAfterQuoteRequestSend = {
  symbol: "@C@1",
  loading: true,
  error: undefined,
};

export const stateAfterQuoteRequestSuccess = {
  ...stateAfterQuoteRequestSend,
  error: undefined,
  loading: false,
  quote: ResponseMock.quotesResponse,
};

export const stateAfterQuoteRequestError = {
  ...stateAfterQuoteRequestSend,
  error: "Some server error.",
  loading: false,
  quote: undefined,
  symbol: undefined,
};

export const stateAfterHistoryPriceRequestSend = {
  ...stateAfterQuoteRequestSuccess,
  symbol: "@C@1",
  interval: "60-Mi",
  duration: "1-M",
  loading: true,
  error: undefined,
};

export const stateAfterHistoryPriceRequestSuccess = {
  ...stateAfterHistoryPriceRequestSend,
  loading: false,
  error: undefined,
  symbolPriceHistory: ResponseMock.historyPriceResponse,
};

export const stateAfterHistoryPriceRequestError = {
  ...stateAfterHistoryPriceRequestSend,
  loading: false,
  error: "Some server error.",
  symbolPriceHistory: undefined,
};

export const oneYAxisDrawn = {
  ...stateAfterHistoryPriceRequestSuccess,
  yAxisState: [
    { study: "volume", isDrawn: true },
    { study: "rsi", isDrawn: false },
    { study: "slowStochastic", isDrawn: false },
    { study: "fastStochastic", isDrawn: false },
    { study: "macd", isDrawn: false },
  ],
};

export const twoYAxisDrawn = {
  ...oneYAxisDrawn,
  yAxisState: [
    { study: "volume", isDrawn: true },
    { study: "rsi", isDrawn: true },
    { study: "slowStochastic", isDrawn: false },
    { study: "fastStochastic", isDrawn: false },
    { study: "macd", isDrawn: false },
  ],
};

export const threeYAxisDrawn = {
  ...twoYAxisDrawn,
  yAxisState: [
    { study: "volume", isDrawn: true },
    { study: "rsi", isDrawn: true },
    { study: "slowStochastic", isDrawn: true },
    { study: "fastStochastic", isDrawn: false },
    { study: "macd", isDrawn: false },
  ],
};

export const fourYAxisDrawn = {
  ...threeYAxisDrawn,
  yAxisState: [
    { study: "volume", isDrawn: true },
    { study: "rsi", isDrawn: true },
    { study: "slowStochastic", isDrawn: true },
    { study: "fastStochastic", isDrawn: true },
    { study: "macd", isDrawn: false },
  ],
};

export const allYAxisDrawn = {
  ...fourYAxisDrawn,
  yAxisState: [
    { study: "volume", isDrawn: true },
    { study: "rsi", isDrawn: true },
    { study: "slowStochastic", isDrawn: true },
    { study: "fastStochastic", isDrawn: true },
    { study: "macd", isDrawn: true },
  ],
};
