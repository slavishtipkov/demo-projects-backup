import { HttpApi } from "./http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

export type Commodities =
  | "CANOLA"
  | "CATTLE"
  | "CORN"
  | "COTTON"
  | "CRUDE_OIL"
  | "DAIRY"
  | "DIESEL"
  | "FEED_CORN"
  | "GASOLINE"
  | "HRS_WHEAT"
  | "NATURAL_GAS"
  | "RICE"
  | "SOYBEAN_MEAL"
  | "SOYBEANS"
  | "SRW_WHEAT"
  | "SWINE";

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
  readonly averagePrice: string;
  readonly averagePriceDate: string;
  readonly details: ReadonlyArray<PositionsDetails>;
  readonly footerNote: string;
  readonly lastUpdatedString: string;
  readonly newRecommendationDateString: string;
}

export interface Charts {
  readonly chartId: string;
  readonly title: string;
}

export interface SixFactorsMarketsStrategies {
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

export class SixFactorsMarketsStrategiesApi extends HttpApi {
  getSixFactorsMarketStrategies(commodity: Commodities): Observable<SixFactorsMarketsStrategies> {
    const baseUrl = `${this.baseUrl}/uiwidget/market-strategies/${getApiCommodityId(commodity)}`;

    return this.getJson(`${baseUrl}`).pipe(
      map(response => response as SixFactorsMarketsStrategies),
    );
  }

  premiumSixFactorsMarketStrategies(
    user: string,
    widgetName: string = "premium-six-factors-market-strategies",
    id: string,
    type: string,
    host: string,
  ): Observable<unknown> {
    let baseUrl = `${this.baseUrl}/uiwidget/widgets/`;
    let queryParams = `${widgetName}/user`;
    const requestBody = {
      widgetId: widgetName,
      userId: user,
      source: {
        id,
        type,
        host,
      },
    };
    return this.postJson(`${baseUrl}${queryParams}`, requestBody).pipe(
      map(response => response as unknown),
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getChartById(
    commodity: Commodities,
    chartId: string,
  ): Observable<{ readonly url: string; readonly id: string }> {
    const baseUrl = `${this.baseUrl}/uiwidget/market-strategies/${getApiCommodityId(
      commodity,
    )}/charts/${chartId}`;

    return this.getArrayBuffer(`${baseUrl}`).pipe(
      map(response => ({ url: response, id: chartId })),
    );
  }

  getMarketStrategiesText(
    commodity: Commodities,
    textTypeId: string,
  ): Observable<SixFactorsMarketsText> {
    const baseUrl = `${this.baseUrl}/uiwidget/market-strategies/${getApiCommodityId(
      commodity,
    )}/text/${textTypeId}`;

    return this.getJson(`${baseUrl}`).pipe(
      map(response => {
        const result = { ...response, textTypeId };
        return result as SixFactorsMarketsText;
      }),
    );
  }
}

function getApiCommodityId(commodity: Commodities): string {
  if (commodity === "HRS_WHEAT") {
    return "HRS";
  } else if (commodity === "SRW_WHEAT") {
    return "SRW";
  } else {
    return commodity.toUpperCase().replace("_", "");
  }
}
