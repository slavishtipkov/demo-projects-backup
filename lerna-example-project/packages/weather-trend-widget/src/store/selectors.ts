import { getWeatherTrendState, NamespacedState } from "./";

export const getWeatherData = (state: NamespacedState) => getWeatherTrendState(state).weatherData;
export const getIsLoading = (state: NamespacedState) => getWeatherData(state).isLoading;
export const getObservedData = (state: NamespacedState) => getWeatherData(state).observedData;
export const getForecastData = (state: NamespacedState) => getWeatherData(state).forecastData;
