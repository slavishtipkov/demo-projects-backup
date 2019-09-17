/* tslint:disable:jsx-no-lambda */
import { DailyForecast, DailyObservation } from "@dtn/api-lib";
import { Units } from "@dtn/i18n-lib";
import * as moment from "moment-timezone";
import * as React from "react";
import { Chart, ChartCanvas } from "react-stockcharts";
import { Annotate, SvgPathAnnotation } from "react-stockcharts/lib/annotation";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { LineSeries } from "react-stockcharts/lib/series";
import { Consumer as I18nConsumer, t as translate } from "../../i18n";
import { WeatherFields } from "../../interfaces";
import styled from "../../styled-components";
import ChartLegend from "./chart-legend";
import ChartTooltip from "./chart-tooltip";
import { getColorForWeatherFieldKey } from "./utils";

export type AccessorArg = (DailyObservation | DailyForecast) & {
  readonly [k: string]: number | null;
};

const CHART_HEIGHT = 270;

export interface Props {
  readonly width: number;
  readonly units: Units;
  readonly weatherField: WeatherFields;
  readonly weatherFieldKeys: ReadonlyArray<string>;
  readonly weatherData: ReadonlyArray<DailyObservation | DailyForecast>;
}

export class WeatherTrendChart extends React.Component<Props> {
  componentDidMount(): void {
    let todayLines = document.querySelectorAll(".today-line-annotation");
    toArray(todayLines).forEach(i => i.setAttribute("stroke-dasharray", "4, 4"));
  }

  render(): JSX.Element {
    let { props } = this;

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      (d: DailyObservation | DailyForecast) => d.date,
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(props.weatherData);

    const margin = { left: 50, right: 2, top: 20, bottom: 25 };
    let yAxisUnit: string | undefined;
    if (props.weatherFieldKeys[0].indexOf("oisture") > -1) {
      yAxisUnit = translate("units.moisture", { context: props.units });
    } else if (props.weatherFieldKeys[0].indexOf("emperature") > -1) {
      yAxisUnit = translate("units.temperature", { context: props.units });
    }

    const [yAxisLabelX, yAxisLabelY]: ReadonlyArray<number> = [
      0,
      (CHART_HEIGHT - margin.top - margin.bottom) / 2,
    ];

    return (
      <I18nConsumer>
        {({ t }) => (
          <>
            <ChartCanvas
              data={data}
              margin={margin}
              width={props.width - margin.left + margin.right - 1}
              height={CHART_HEIGHT}
              ratio={1}
              type={"svg"}
              seriesName={"foobar"}
              xAccessor={xAccessor}
              displayXAccessor={displayXAccessor}
              xScale={xScale}
              panEvent={false}
              zoomEvent={false}
              pointsPerPxThreshold={1}
              maintainPointsPerPixelOnResize={false}
            >
              <Chart
                id={`chart-${props.weatherFieldKeys.join("-")}`}
                yExtents={(d: AccessorArg) => this.props.weatherFieldKeys.map(s => d[s])}
              >
                <XAxis
                  axisAt="bottom"
                  orient="bottom"
                  zoomEnabled={false}
                  stroke="#E5E5E5"
                  tickStrokeOpacity={0.5}
                  tickStroke={"#59595B"}
                  ticks={getXAxisTickCount(props.width)}
                />

                <YAxis
                  axisAt="left"
                  orient="left"
                  ticks={6}
                  innerTickSize={-1 * props.width + (margin.left * 2 + margin.right * 2) - 3}
                  stroke="#E5E5E5"
                  tickStrokeOpacity={0.5}
                  tickStroke={"#59595B"}
                  zoomEnabled={false}
                  tickFormat={(x: number) => `${x}${yAxisUnit}`}
                />

                {this.props.weatherFieldKeys.map((s, i) => {
                  let color = getColorForWeatherFieldKey(s, i);
                  return (
                    <LineSeries
                      key={s}
                      yAccessor={(d: AccessorArg) => (d[s] === null ? undefined : d[s])}
                      stroke={color}
                      strokeWidth={3}
                    />
                  );
                })}

                <ChartTooltip
                  weatherFieldKeys={this.props.weatherFieldKeys}
                  units={props.units}
                  unitsLabel={yAxisUnit}
                />

                {getTodayAnnotation()}
              </Chart>
            </ChartCanvas>

            {props.weatherField === "SOIL_DEPTH_AVERAGE_MOISTURE" && getYAxisLabel()}

            <ChartLegend weatherFieldKeys={props.weatherFieldKeys} units={this.props.units} />
          </>
        )}
      </I18nConsumer>
    );
  }
}

let YAxisLabel = styled.div`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: -33px;
  color: #59595b;
  font-size: 12px;
  transform: rotate(-90deg);
`;

function getYAxisLabel(): JSX.Element {
  // tslint:disable-next-line
  return <YAxisLabel>Moisture Content</YAxisLabel>;
}

function getTodayAnnotation(): JSX.Element {
  let pathAnnotationProps = {
    stroke: "#59595B",
    opacity: 0.8,
    tooltip(): string {
      return "Today";
    },
    path({ x, y }: { readonly x: number; readonly y: number }): string {
      return `M${x},${y} v-${y}`;
    },
    y: ({ yScale }: { readonly yScale: { readonly range: () => ReadonlyArray<any> } }) =>
      yScale.range()[0],
  };

  let labelAnnotationProps = {
    fontFamily: "inherit",
    fill: "#59595B",
    fontSize: 12,
    opacity: 0.8,
    text: "Today",
    y: ({ yScale }: { readonly yScale: { readonly range: () => ReadonlyArray<any> } }) =>
      yScale.range()[0] - 3,
  };

  const isToday = (d: Date) =>
    moment(d)
      .utc()
      .isSame(moment().utc(), "day");

  return (
    <>
      <Annotate
        with={SvgPathAnnotation}
        when={(d: AccessorArg) => isToday(d.date)}
        usingProps={pathAnnotationProps}
        className="today-line-annotation"
      />
      {/* <Annotate
        with={LabelAnnotation}
        when={(d: AccessorArg) => isToday(d.date)}
        usingProps={labelAnnotationProps}
      /> */}
    </>
  );
}

function getXAxisTickCount(width: number): number {
  if (width < 400) {
    return 2;
  } else if (width < 600) {
    return 4;
  } else if (width < 800) {
    return 8;
  } else if (width < 1200) {
    return 12;
  } else {
    return 16;
  }
}

function toArray(obj: any): ReadonlyArray<any> {
  let array: ReadonlyArray<any> = [];
  // iterate backwards ensuring that length is an UInt32
  for (let i = obj.length >>> 0; i--; ) {
    // @ts-ignore
    array[i] = obj[i];
  }
  return array;
}

export default fitWidth(WeatherTrendChart);
