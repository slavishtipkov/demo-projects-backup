import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
// import { Location, ThresholdSettings, View } from "../../../interfaces";
import {
  fetchZipCodeDataAction,
  selectZipCode,
  selectErrorState,
  ZipCodeActions,
  ZipCodeState,
  zipCodeInputErrorAction,
  getZipCode,
  removeZipCodeValue,
} from "../../../store";
import { IndexView } from "../../views";
import { Props as IndexViewProps } from "../../views/index-view";
import { CoordinatesForZipCode } from "../../../interfaces";

const mapStateToProps = (state: ZipCodeState): Partial<IndexViewProps> => ({
  zipCode: selectZipCode(state),
  error: selectErrorState(state),
});
const mapDispatchToProps = (dispatch: Dispatch<ZipCodeActions>): Partial<IndexViewProps> => ({
  fetchZipCode: (zipCode: string) => dispatch(fetchZipCodeDataAction({ zipCode })),
  handleInputZipCodeError: (errorMessage: string) =>
    dispatch(zipCodeInputErrorAction(errorMessage)),
  getZipCodeByCoordinates: (coordinates: CoordinatesForZipCode) =>
    dispatch(getZipCode(coordinates)),
  removeZipCodeValue: () => dispatch(removeZipCodeValue()),
});

export default connect<
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  ZipCodeState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
