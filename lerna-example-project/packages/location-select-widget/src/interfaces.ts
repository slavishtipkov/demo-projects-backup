export interface Station {
  readonly stationId: string;
  readonly displayName: string;
}

export interface Coordinates {
  readonly lat?: number;
  readonly lon?: number;
  readonly stationId?: string;
}
