import { DailyForecast, DailyObservation } from "@dtn/api-lib";
import { Units } from "@dtn/i18n-lib";
import * as React from "react";
import { Coordinates, WeatherFields, WEATHER_FIELDS_MAP } from "../../interfaces";
import Chart from "../chart";
import { ChartContainer } from "../container";
import Header from "../header";
import LoadingIndicator from "../loader";
import NoDataErrorContainer from "../no-data";

export interface Props {
  readonly units: Units;
  readonly location: Coordinates;
  readonly weatherField: WeatherFields;
  readonly observations?: ReadonlyArray<DailyObservation>;
  readonly forecast?: ReadonlyArray<DailyForecast>;
  readonly isLoading: boolean;
  readonly fetchWeatherData: (location: Coordinates) => void;
}

export interface State {
  readonly containerWidth?: number;
  readonly weatherField: WeatherFields;
}

export default class MainView extends React.Component<Props, State> {
  container = React.createRef<HTMLElement>();

  constructor(props: Props) {
    super(props);

    this.state = {
      weatherField: props.weatherField,
    };
  }

  componentDidMount(): void {
    this.props.fetchWeatherData(this.props.location);

    window.addEventListener("resize", this.handleWidgetResize);
    if (!(this.container.current instanceof HTMLElement)) {
      return;
    }
    this.setState({
      containerWidth: this.container.current.clientWidth,
    });
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.weatherField !== this.props.weatherField) {
      this.setState({ weatherField: nextProps.weatherField });
    }
  }

  handleWidgetResize = () => {
    if (!(this.container.current instanceof HTMLElement)) {
      return;
    }
    this.setState({ containerWidth: this.container.current.clientWidth });
  };

  handleSetNewWeatherField = (weatherField: WeatherFields) => {
    let { props } = this;
    let { observations, forecast } = props;
    if (
      !observations ||
      !forecast ||
      !getKeysForWeatherField(weatherField, normalizeWeatherData(observations, forecast))
    ) {
      return;
    }
    this.setState({
      weatherField,
    });
  };

  render(): JSX.Element {
    let { props, state } = this;
    let { isLoading, observations, forecast } = props;
    let { weatherField } = state;

    if (isLoading || !observations || !forecast || !weatherField) {
      return <LoadingIndicator />;
    }

    let normalizedWeatherData = normalizeWeatherData(observations, forecast);
    let weatherFieldKeys = getKeysForWeatherField(weatherField, normalizedWeatherData);

    let showNoData = weatherFieldKeys === undefined || weatherFieldKeys.length === 0;

    return (
      <ChartContainer>
        <Header
          weatherField={weatherField}
          dateRange={[observations[0].date, forecast[forecast.length - 1].date]}
          updatedAt={new Date()}
        />
        {showNoData ? (
          <NoDataErrorContainer />
        ) : (
          <Chart
            units={this.props.units}
            weatherField={this.props.weatherField}
            weatherFieldKeys={weatherFieldKeys}
            weatherData={normalizedWeatherData}
          />
        )}
      </ChartContainer>
    );
  }
}

function normalizeWeatherData(
  observations: ReadonlyArray<DailyObservation>,
  forecast: ReadonlyArray<DailyForecast>,
): ReadonlyArray<DailyObservation | DailyForecast> {
  let obsWithoutToday = observations.slice();
  // tslint:disable-next-line:no-array-mutation
  obsWithoutToday.pop();
  let combined: ReadonlyArray<DailyObservation | DailyForecast> = [
    ...obsWithoutToday,
    ...forecast,
  ].map(d => {
    if (d.soil === null) {
      return { ...d, soil: [] };
    } else {
      return d;
    }
  });
  return combined.map(d => ({
    ...d,
    ...d
      .soil!.map(s => ({
        [`${s.depth}SoilDepthAvgTemperature`]: s.avgTemperature,
        [`${s.depth}SoilDepthAvgMoisture`]: s.avgMoisture,
      }))
      .reduce(
        (s, s2) => ({
          ...s,
          ...s2,
        }),
        {},
      ),
  }));
}

function getKeysForWeatherField(
  weatherField: WeatherFields,
  weatherData: ReadonlyArray<DailyObservation | DailyForecast>,
): ReadonlyArray<string> | undefined {
  let field = WEATHER_FIELDS_MAP[weatherField];
  if (!field) {
    return undefined;
  }
  let keys: ReadonlyArray<string> = [];
  if (field.indexOf("[]") > -1) {
    if (field === WEATHER_FIELDS_MAP.SOIL_DEPTH_AVERAGE_MOISTURE) {
      keys = Object.keys(weatherData[0])
        .filter(k => k.indexOf("SoilDepthAvgMoisture") > -1)
        .slice(0, 3);
    } else if (field === WEATHER_FIELDS_MAP.SOIL_DEPTH_AVERAGE_TEMPERATURE) {
      keys = Object.keys(weatherData[0])
        .filter(k => k.indexOf("SoilDepthAvgTemperature") > -1)
        .slice(0, 3);
    } else {
      return undefined;
    }
  } else {
    keys = [field];
  }

  return keys;
}
