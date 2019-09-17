import { HttpApi } from "./http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export interface ZipCodeDataObject {
  readonly address: string;
  readonly city: string;
  readonly country: string;
  readonly lat: number;
  readonly lon: number;
  readonly postalCode: string;
  readonly region: string;
  readonly bbox: BBox;
}

export interface BBox {
  readonly northLat: number;
  readonly westLon: number;
  readonly southLat: number;
  readonly eastLon: number;
}

export interface CoordinatesForZipCode {
  readonly lat: number;
  readonly lon: number;
}

export interface ZipCodeFromCoordinates {
  readonly postalCode: string;
}

export class ZipCodeApi extends HttpApi {
  fetchCoordinates(zipCode: string): Observable<ReadonlyArray<ZipCodeDataObject>> {
    let baseUrl = `${this.baseUrl}/geocode/locations`;
    let queryParams = `?postalcode=${zipCode}`;
    return this.getJson<ReadonlyArray<ZipCodeDataObject>>(`${baseUrl}${queryParams}`).pipe(
      catchError(error => {
        return throwError(error);
      }),
    );
  }

  getZipCode(coordinates: CoordinatesForZipCode): Observable<ZipCodeFromCoordinates> {
    let baseUrl = `${this.baseUrl}/geocode/locations`;
    let queryParams = `?lat=${coordinates.lat}&lon=${coordinates.lon}`;

    return this.getJson<ReadonlyArray<ZipCodeFromCoordinates>>(`${baseUrl}${queryParams}`).pipe(
      map(response => response[0]),
      catchError(error => {
        return throwError(error);
      }),
    );
  }
}
