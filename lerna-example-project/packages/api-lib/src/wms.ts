import * as moment from "moment-timezone";
import { HttpApi, ApiResponse, ApiResponseWithHeaders } from "./http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

export interface MapboxAccessToken {
  readonly accessToken: string;
}

export type MapboxAccessTokenResponse = ReadonlyArray<MapboxAccessToken>;

export interface WmsLayerResponse {
  readonly layer: Blob;
  readonly validTime: moment.Moment;
}

export interface WmsLegendResponse {
  readonly legend: Blob;
}

export class WmsApi extends HttpApi {
  fetchWmsLayer = (
    layerIds: ReadonlyArray<string>,
    bbox: ReadonlyArray<ReadonlyArray<number>>,
    { width, height }: { readonly width: number; readonly height: number },
    time?: ReadonlyArray<moment.Moment> | moment.Moment,
  ): Observable<WmsLayerResponse> => {
    let baseUrl =
      `${this.baseUrl}/wms/maps` +
      "?SERVICE=WMS&VERSION=1.3.0" +
      "&REQUEST=GetMap" +
      "&CRS=EPSG:3857" +
      "&FORMAT=image/png" +
      "&MAP_RESOLUTION=72" +
      "&TRANSPARENT=TRUE";
    let queryParams =
      `&BBOX=${bbox}` + `&WIDTH=${width}` + `&HEIGHT=${height}` + `&LAYERS=${layerIds.join(",")}`;

    if (time) {
      queryParams += `&TIME=${
        Array.isArray(time)
          ? [time[0].toISOString(), time[1].toISOString()].join("/")
          : (time as moment.Moment).toISOString()
      }`;
    }

    return this.getBlobWithHeaders(`${baseUrl}${queryParams}`).pipe(
      map((response: ApiResponseWithHeaders) => {
        // Error responses come back in XML format, treat them all as a generic 500
        if (response.headers["content-type"] === "text/xml") {
          throw new Error("Server is down");
        }
        let validTime = response.headers[`dtn-${layerIds[0].toLocaleLowerCase()}-valid-ts`];
        return {
          layer: response.response as Blob,
          validTime: moment(validTime),
        };
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  };

  fetchWmsLegend = (legendId: string): Observable<WmsLegendResponse> => {
    let baseUrl =
      `${this.baseUrl}/wms/maps` +
      "?SERVICE=WMS&VERSION=1.3.0" +
      "&REQUEST=GetLegendGraphic" +
      "&FORMAT=image/png" +
      "&THEME=LIGHT" +
      "&SLD_VERSION=1.1.0";
    let queryParams = `&LAYER=${legendId}`;

    return this.getBlobWithHeaders(`${baseUrl}${queryParams}`).pipe(
      map((response: ApiResponseWithHeaders) => {
        return {
          legend: response.response as Blob,
        };
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  };

  fetchMapboxAccessToken = (): Observable<MapboxAccessTokenResponse> => {
    let baseUrl = `${this.baseUrl}/uiwidget/mapbox-tokens`;

    return this.getJson(baseUrl).pipe(
      map((response: ApiResponse) => {
        return response as MapboxAccessTokenResponse;
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  };

  // Need to shift this any to the map definition type, but who owns the type?
  // Hard-casting as MapDefinition in the map widget for now.
  fetchMapDefinition = (): Observable<any> => {
    let baseUrl = `${this.baseUrl}/uiwidget/widgets/interactive-map-widget/config`;

    return this.getJson(baseUrl).pipe(
      map((response: ApiResponse) => {
        return response;
      }),
      catchError(error => {
        return throwError(error);
      }),
    );
  };

  logMapLoad(
    user: string = "anonymous",
    widgetName: string = "interactive-map-widget",
    id: string = "",
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
}
