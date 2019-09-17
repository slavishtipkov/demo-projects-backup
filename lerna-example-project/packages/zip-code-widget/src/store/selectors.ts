import { createSelector, Selector } from "reselect";
import { ZipCodeState, State } from "./";
import { CoordinatesDataObject } from "../interfaces";

export const baseSelector: Selector<ZipCodeState, State> = ({ zipCodeState }) => zipCodeState;

export const selectCoordinates: Selector<
  ZipCodeState,
  CoordinatesDataObject | undefined
> = createSelector(
  baseSelector,
  zipCodeState => zipCodeState.coordinates,
);

export const selectLoadingState: Selector<ZipCodeState, boolean> = createSelector(
  baseSelector,
  zipCodeState => zipCodeState.loading,
);

export const selectZipCode: Selector<ZipCodeState, string | undefined> = createSelector(
  baseSelector,
  zipCodeState => zipCodeState.zipCode,
);

export const selectErrorState: Selector<ZipCodeState, string | undefined> = createSelector(
  baseSelector,
  zipCodeState => zipCodeState.error,
);
