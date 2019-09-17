# @dtn/api-lib

A package for accessing DTN's HTTP-Based JSON API

## Install

```sh
npm install --dev @dtn/api-lib
```

## Key Concepts

1.  [RxJS](https://rxjs-dev.firebaseapp.com/guide/overview) - Rather than rely on jQuery's AJAX, or `window.fetch`, the `HttpApi` class is built upon RxJS's `Observable`

## API

The package is separated into two modules, HTTP and WebSockets. WebSockets API is currently not implemented.

### HTTP

`interface ApiResponse`

All of DTN's APIs will response with this structure.

```TypeScript
interface ApiResponse {
  readonly data: {} | ReadonlyArray<any>;
  readonly meta: {
    readonly name: string;
    readonly type: string;
    readonly executionTime: number;
    readonly eventUUID: string;
    readonly updateTime: string;
  };
}
```

#### `class HttpApi`

The HTTP Api class is intended to be extended to provide domain specific API calls while deferring the actual requests and response handling the `HttpApi` class.

##### `new HttpApi(config)`

The `HttpApi` class constructor takes a single config argument

```TypeScript
type config = Readonly<{
  // The access token to the DTN API's
  readonly token: string;
  // The Base Url for DTN's API's
  // e.g. https://dtn.com/apis
  readonly baseUrl: string;
  // Units - see http://npmjs.com/package/@dtn/i81n-lib
  readonly units?: Units;
  // Locale - see http://npmjs.com/package/@dtn/i81n-lib
  readonly locale?: Locales;
}
```

##### `getJson`

GET JSON from DTN's APIs

```TypeScript
getJson(url: string): Observable<ApiResponse>
```

##### `postJson`

POST JSON to DTN's APIs

```TypeScript
postJson(url: string, body: any): Observable<ApiResponse>
```

##### `patchJson`

PATCH JSON to DTN's APIs

```TypeScript
patchJson(url: string, body: any): Observable<ApiResponse>
```

##### `putJson`

PUT JSON to DTN's APIs

```TypeScript
putJson(url: string, body: any): Observable<ApiResponse>
```

## Recipes

### Basic Usage Example

Here is an example taken from the [@dtn/spray-outlook-widget](https://www.npmjs.com/package/@dtn/spray-outlook-widget)

```TypeScript
import { HttpApi } from "@dtn/api-lib";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
// Import interfaces that represent the response payloads
import { Location, StationOutlook } from "../interfaces";

// Extends the HttPApi class to implement an ApiService
export class ApiService extends HttpApi {
  // Add methods to fetch data from DTN's APIs, typing the responses
  fetchSprayOutlook(locations: ReadonlyArray<Location>): Observable<ReadonlyArray<StationOutlook>> {
    // Use the `baseUrl` property to build up the request url
    let url = `${this.baseUrl}/sprayoutlook/forecasts`;
    let stationIds = locations.map(l => l.stationId).join(",");
    // Build up whatever endpoint specific query params are needed
    let queryParams = `?stationIds=${stationIds}&numDays=7&includeHours=true`;
    // Defer the ajax call to the methods provided by the `HttpApi` class
    return this.getJson(`${url}${queryParams}`).pipe(
      // Map the data appropriately, expliciting casting the response type if necessary to maintain stong typings
      map(response => response.data as ReadonlyArray<StationOutlook>),
      // Normalize the response for passing along to redux, components, etc
      map(sprayOutlook => normalizeSprayOutlook(sprayOutlook, locations)),
    );
  }
}
```
