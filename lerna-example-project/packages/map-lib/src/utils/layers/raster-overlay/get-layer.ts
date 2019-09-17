import { fromEvent, Observable } from "rxjs";
import { mapTo } from "rxjs/operators";

export function getImage(src: string): Observable<HTMLImageElement> {
  let image = new Image();
  image.crossOrigin = "anonymous";
  image.src = src;
  return fromEvent(image, "load").pipe(mapTo(image));
}
