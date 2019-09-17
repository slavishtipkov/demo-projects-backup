import { HttpApi } from "./http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { throwError, from } from "rxjs";

export class StaticWeatherMapApi extends HttpApi {
  fetchMapImage(map_id: string): Observable<Blob> {
    let baseUrl = `${this.baseUrl}/weather/static-maps/${map_id}`;
    let queryParams = ``;

    return this.getBlob<Blob>(`${baseUrl}${queryParams}`).pipe(
      map(response => response),
      catchError(error => {
        return throwError(error);
      }),
    );
  }
}
