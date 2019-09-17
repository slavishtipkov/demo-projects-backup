import { Locales, Units } from "@dtn/i18n-lib";
import { Observable, throwError } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, retry, catchError } from "rxjs/operators";

export interface Headers {
  readonly Accept: string;
}

export type ApiResponse = ReadonlyArray<object> | {};

export interface ApiResponseWithHeaders {
  readonly response: ApiResponse;
  readonly headers: { readonly [key: string]: string };
}

export interface Api {
  readonly headers: Headers;
  readonly getJson: <R>(url: string) => Observable<R>;
  readonly postJson: <R>(url: string, body: any) => Observable<R>;
  readonly putJson: <R>(url: string, body: any) => Observable<R>;
  readonly patchJson: <R>(url: string, body: any) => Observable<R>;
  readonly getBlob: <R>(url: string) => Observable<R>;
  readonly getBlobWithHeaders: <R>(url: string) => Observable<R>;
}

export const REQUEST_TIMEOUT = 1000 * 30;

export class HttpApi implements Api {
  readonly token: string;
  readonly baseUrl: string;
  readonly units: Units = Units.IMPERIAL;
  readonly locale: Locales = Locales.ENGLISH;

  constructor(
    config: Readonly<{
      readonly token: string;
      readonly baseUrl: string;
      readonly units?: Units;
      readonly locale?: Locales;
    }>,
  ) {
    this.token = config.token;
    this.baseUrl = config.baseUrl;
    if (config.units) this.units = config.units;
    if (config.locale) this.locale = config.locale;
  }

  getJson<R>(url: string): Observable<R> {
    return ajax({
      headers: this.headers,
      crossDomain: true,
      method: "GET",
      responseType: "json",
      timeout: REQUEST_TIMEOUT,
      url: addApikey(url, this.token),
    }).pipe(
      retry(2),
      map(response => response.response),
      catchError(error => {
        return throwError(error.response.messages);
      }),
    );
  }

  postJson<R>(url: string, body: any): Observable<R> {
    return ajax({
      headers: this.headers,
      crossDomain: true,
      method: "POST",
      responseType: "json",
      timeout: REQUEST_TIMEOUT,
      url: addApikey(url, this.token),
      body: JSON.stringify(body),
    }).pipe(
      retry(2),
      map(response => response.response),
      catchError(error => {
        return throwError(error.response.messages);
      }),
    );
  }

  putJson<R>(url: string, body: any): Observable<R> {
    return ajax({
      headers: this.headers,
      crossDomain: true,
      method: "PUT",
      responseType: "json",
      timeout: REQUEST_TIMEOUT,
      url: addApikey(url, this.token),
      body: JSON.stringify(body),
    }).pipe(
      retry(2),
      map(response => response.response),
      catchError(error => {
        return throwError(error.response.messages);
      }),
    );
  }

  patchJson<R>(url: string, body: any): Observable<R> {
    return ajax({
      headers: this.headers,
      crossDomain: true,
      method: "PATCH",
      responseType: "json",
      timeout: REQUEST_TIMEOUT,
      url: addApikey(url, this.token),
      body: JSON.stringify(body),
    }).pipe(
      retry(2),
      map(response => response.response),
    );
  }

  getBlob<R>(url: string): Observable<R> {
    return ajax({
      headers: this.headers,
      crossDomain: true,
      method: "GET",
      responseType: "blob",
      timeout: REQUEST_TIMEOUT,
      url: addApikey(url, this.token),
    }).pipe(
      retry(2),
      map(response => response.response),
      catchError(error => {
        return throwError(error.response);
      }),
    );
  }

  getBlobWithHeaders<R>(url: string): Observable<any> {
    return ajax({
      headers: this.headers,
      crossDomain: true,
      method: "GET",
      responseType: "blob",
      timeout: REQUEST_TIMEOUT,
      url: addApikey(url, this.token),
    }).pipe(
      retry(2),
      map(response => ({
        response: response.response,
        headers: headersToObject(response.xhr.getAllResponseHeaders()),
      })),
      catchError(error => {
        return throwError(error.response);
      }),
    );
  }

  getArrayBuffer<R>(url: string): Observable<any> {
    return ajax({
      headers: { ...this.headers, Accept: "image/gif" },
      crossDomain: true,
      method: "GET",
      responseType: "arraybuffer",
      timeout: REQUEST_TIMEOUT,
      url: addApikey(url, this.token),
    }).pipe(
      retry(2),
      map(response => {
        const buffer = response.response;
        const blob = new Blob([buffer], { type: "image/gif" });
        const url = URL.createObjectURL(blob);
        return url;
      }),
      catchError(error => {
        return throwError(error.response);
      }),
    );
  }

  get headers(): Headers {
    return {
      Accept: "application/json",
    };
  }
}

function addApikey(url: string, apikey: string): string {
  if (url.indexOf("?") !== -1) {
    return `${url}&apikey=${apikey}`;
  } else {
    return `${url}?apikey=${apikey}`;
  }
}

function headersToObject(headers: string): { readonly [key: string]: string } {
  let arr = headers.trim().split(/[\r\n]+/);
  let headersObj: { readonly [key: string]: string } = {};
  arr.forEach(function(line: string): void {
    let parts = line.split(": ");
    // tslint:disable-next-line
    let header = parts.shift();
    let value = parts.join(": ");
    headersObj = { ...headersObj, [header!]: value };
  });
  return headersObj;
}
