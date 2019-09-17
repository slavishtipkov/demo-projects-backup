export interface ZipCodeDataObject {
  readonly address: string;
  readonly city: string;
  readonly country: string;
  readonly lat: number;
  readonly lon: number;
  readonly postalCode: string;
  readonly region: string;
}

export interface CoordinatesDataObject {
  readonly lat: number;
  readonly lon: number;
  readonly address: string;
  readonly city: string;
  readonly postalCode: string;
  readonly region: string;
  readonly country: string;
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
