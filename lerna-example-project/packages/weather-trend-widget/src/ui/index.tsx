import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Coordinates } from "../interfaces";
import { fetchWeatherData, NamespacedState, WeatherTrendActions } from "../store";
import { getForecastData, getIsLoading, getObservedData } from "../store/selectors";
import MainView, { Props as MainViewProps } from "./main-view";
import { selectUnits } from "@dtn/i18n-lib";

const mapStateToProps = (state: NamespacedState): Partial<MainViewProps> => ({
  units: selectUnits(state),
  isLoading: getIsLoading(state),
  observations: getObservedData(state),
  forecast: getForecastData(state),
});

const mapDispatchToProps = (dispatch: Dispatch<WeatherTrendActions>): Partial<MainViewProps> => ({
  fetchWeatherData: (location: Coordinates) => dispatch(fetchWeatherData(location)),
});

export default connect<
  Partial<MainViewProps>,
  Partial<MainViewProps>,
  Partial<MainViewProps>,
  NamespacedState
>(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true },
)(MainView);
