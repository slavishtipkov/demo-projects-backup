import * as mapboxgl from "mapbox-gl";
import { Action, ActionCreator } from "redux";

export type UserInterfaceActions = ChangePointOfInterestAction;

export const enum UserInterfaceActionTypes {
  CHANGE_POINT_OF_INTEREST = "CHANGE_POINT_OF_INTEREST",
}

export interface ChangePointOfInterestAction extends Action<UserInterfaceActionTypes> {
  readonly type: UserInterfaceActionTypes.CHANGE_POINT_OF_INTEREST;
  readonly payload: {
    readonly coordinates: ReadonlyArray<number>;
    readonly point: {
      readonly x: number;
      readonly y: number;
    };
  };
}

export const changePointOfInterest: ActionCreator<ChangePointOfInterestAction> = (
  event: mapboxgl.MapMouseEvent,
) => ({
  type: UserInterfaceActionTypes.CHANGE_POINT_OF_INTEREST,
  payload: {
    coordinates: event.lngLat.toArray(),
    point: {
      x: event.originalEvent.offsetX,
      y: event.originalEvent.offsetY,
    },
  },
});
