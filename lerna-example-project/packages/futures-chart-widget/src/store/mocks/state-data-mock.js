import * as ResponseMock from "./response-data-mock";

export const stateAfterGetQuoteForSymbolSend = {
  loading: true,
  widgetName: "futures-chart-widget",
  chartData: [],
  chartType: "line",
  symbolConfig: {
    symbol: "",
    isSymbolVisible: true,
    isDescriptionVisible: true,
  },
  interval: "M",
  duration: "12-M",
  symbol: "@C@1",
  error: undefined,
};

export const stateAfterGetQuoteForSymbolSuccess = {
  ...stateAfterGetQuoteForSymbolSend,
  loading: false,
  quote: ResponseMock.quotesResponse,
};

export const stateAfterGetQuoteForSymbolError = {
  ...stateAfterGetQuoteForSymbolSend,
  symbol: undefined,
  quote: undefined,
  loading: false,
  error: "Some server error.",
};

export const stateAfterGetPriceHistoryForSymbolSend = {
  ...stateAfterGetQuoteForSymbolSuccess,
  loading: true,
  symbol: "@C@1",
  interval: "7-D",
  duration: "D",
};

export const stateAfterGetPriceHistoryForSymbolSuccess = {
  ...stateAfterGetPriceHistoryForSymbolSend,
  loading: false,
  symbolPriceHistory: ResponseMock.historyPriceResponse,
};

export const stateAfterGetPriceHistoryForSymbolError = {
  widgetName: "futures-chart-widget",
  chartData: [],
  chartType: "line",
  symbolConfig: {
    symbol: "",
    isSymbolVisible: true,
    isDescriptionVisible: true,
  },
  interval: "M",
  duration: "12-M",
  loading: false,
  symbolPriceHistory: undefined,
  error: "Some server error.",
};
