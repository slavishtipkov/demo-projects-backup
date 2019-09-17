export interface ContentTexts {
  readonly createdDate: string;
  readonly name: string;
  readonly text: string;
}

export interface Indicators {
  readonly description: string;
  readonly id: string;
  readonly type: string;
}

export interface PositionsDetails {
  readonly dateString: string;
  readonly percentage: number;
  readonly price: string;
  readonly type: string;
}

export interface Positions {
  readonly periodTitle: string;
  readonly description: string;
  readonly averagePrice: string | number;
  readonly averagePriceDate: string | null;
  readonly details: ReadonlyArray<PositionsDetails>;
  readonly footerNote: string;
  readonly lastUpdatedString: string;
  readonly newRecommendationDateString: string;
}

export interface Charts {
  readonly chartId: string;
  readonly title: string;
  readonly description: string;
}

export interface SixFactorsMarketStrategies {
  readonly commodityName: string;
  readonly latestPublishDate: string;
  readonly contentTexts: ReadonlyArray<ContentTexts>;
  readonly indicators: ReadonlyArray<Indicators>;
  readonly positions: ReadonlyArray<Positions>;
  readonly charts: ReadonlyArray<Charts>;
}

export interface SixFactorsMarketsText {
  readonly createdDate: string;
  readonly name: string;
  readonly text: string;
  readonly textTypeId: string;
}
