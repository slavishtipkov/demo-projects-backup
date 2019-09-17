import { HttpApi } from "./http";
import { Observable, throwError, from } from "rxjs";
import { map, catchError } from "rxjs/operators";

export class LocationSelectApi extends HttpApi {
  fetchStations(
    stationId: string,
  ): Observable<ReadonlyArray<{ readonly id: string; readonly displayName: string }>> {
    return from([]);
  }
}
