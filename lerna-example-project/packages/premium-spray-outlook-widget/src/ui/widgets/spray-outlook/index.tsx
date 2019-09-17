import { SprayOutlookThresholds } from "@dtn/api-lib";
import { selectUnits } from "@dtn/i18n-lib";
import { Coordinates } from "@dtn/types-lib";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  fetchSprayOutlookForecast,
  NamespacedState,
  selectCoordinates,
  selectLoading,
  selectObservedAt,
  selectSprayOutlook,
  selectThresholds,
  SprayOutlookActions,
} from "../../../store";
import { default as IndexView, Props as IndexViewProps } from "../../views/index-view";

const mapStateToProps = (state: NamespacedState): Partial<IndexViewProps> => ({
  loading: selectLoading(state),
  units: selectUnits(state),
  coordinates: selectCoordinates(state),
  sprayOutlook: selectSprayOutlook(state),
  thresholds: selectThresholds(state),
  observedAt: selectObservedAt(state),
});
const mapDispatchToProps = (dispatch: Dispatch<SprayOutlookActions>): Partial<IndexViewProps> => ({
  fetchSprayOutlookForecast: (coordinates: Coordinates, thresholds: SprayOutlookThresholds) =>
    dispatch(fetchSprayOutlookForecast(coordinates, thresholds)),
});

export default connect<
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  Partial<IndexViewProps>,
  NamespacedState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(IndexView);
