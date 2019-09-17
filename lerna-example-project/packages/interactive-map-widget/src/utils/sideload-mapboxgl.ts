import { Observable } from "rxjs";
import loadScript from "scriptjs";

export const sideloadMapboxgl = () => {
  return new Observable<void>(observer => {
    loadScript("https://content-services.dtn.com/third-party/map-box/mapbox-gl-latest.js", () => {
      observer.next();
      observer.complete();
    });
  });
};
