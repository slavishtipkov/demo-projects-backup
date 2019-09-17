declare module "react-stockcharts" {
  import * as React from "react";

  interface ChartCanvasProps {
    readonly height: number;
    readonly width: number;
    readonly ratio: number;
    readonly margin: {
      readonly top: number;
      readonly right: number;
      readonly bottom: number;
      readonly left: number;
    };
    readonly type: string;
    readonly seriesName: string;
    readonly data: ReadonlyArray<Object>;
    readonly xScale: Function;
    readonly xAccessor: Function;
    readonly displayXAccessor: Function;
    readonly panEvent: boolean;
    readonly zoomEvent: boolean;
    readonly maintainPointsPerPixelOnResize: boolean;
    readonly padding?: number;
  }

  interface ChartProps {
    readonly id: string;
    readonly yExtents: Function | ReadonlyArray<Object>;
    readonly height?: number;
    readonly padding?: {
      readonly top?: number;
      readonly right?: number;
      readonly bottom?: number;
      readonly left?: number;
    };
    readonly origin?: Function | ReadonlyArray<number>;
  }

  class ChartCanvas extends React.Component<ChartCanvasProps> {}
  class Chart extends React.Component<ChartProps> {}
}

declare module "react-stockcharts/lib/series" {
  import * as React from "react";

  interface LineSeriesProps {
    readonly yAccessor: Function | ReadonlyArray<number>;
    readonly stroke: string;
    readonly strokeWidth: number;
  }

  interface CandlestickSeriesProps {
    readonly fill: Function | string;
    readonly stroke: Function | string;
    readonly wickStroke: Function | string;
    readonly opacity: number;
  }

  interface OHLCSeriesProps {
    readonly fill: Function | string;
    readonly stroke: Function | string;
    readonly strokeWidth: number;
  }

  interface RsiProps {
    readonly yAccessor: Function;
    readonly stroke: {
      readonly top: string;
      readonly middle: string;
      readonly bottom: string;
      readonly outsideThreshold: string;
      readonly insideThreshold: string;
      readonly line: string;
    };
    readonly strokeWidth: {
      readonly top: number;
      readonly middle: number;
      readonly bottom: number;
      readonly outsideThreshold: number;
      readonly insideThreshold: number;
      readonly line: number;
    };
  }

  interface StochasticSeriesProps {
    readonly yAccessor: Function;
    readonly stroke: {
      readonly top: string;
      readonly middle: string;
      readonly bottom: string;
      readonly dLine: string;
      readonly kLine: string;
    };
  }

  interface MACDSeriesProps {
    readonly yAccessor: Function;
    readonly stroke: {
      readonly macd: string;
      readonly signal: string;
    };
    readonly fill: {
      readonly divergence: string;
    };
  }

  interface BarSeriesProps {
    readonly yAccessor: Function;
    readonly fill: string;
  }

  interface BollingerSeriesProps {
    readonly yAccessor: Function;
    readonly fill: string;
    readonly stroke: {
      readonly top: string;
      readonly middle: string;
      readonly bottom: string;
    };
  }

  class LineSeries extends React.Component<LineSeriesProps> {}
  class CandlestickSeries extends React.Component<CandlestickSeriesProps> {}
  class OHLCSeries extends React.Component<OHLCSeriesProps> {}
  class RSISeries extends React.Component<RsiProps> {}
  class StochasticSeries extends React.Component<StochasticSeriesProps> {}
  class MACDSeries extends React.Component<MACDSeriesProps> {}
  class BarSeries extends React.Component<BarSeriesProps> {}
  class BollingerSeries extends React.Component<BollingerSeriesProps> {}
}

declare module "react-stockcharts/lib/axes" {
  import * as React from "react";

  interface XAxisProps {
    readonly axisAt: string;
    readonly orient: string;
    readonly tickStroke: string;
    readonly stroke: string;
    readonly tickStrokeOpacity: number;
    readonly ticks: number;
    readonly ref: Function;
  }

  interface YAxisProps {
    readonly ref: Function;
    readonly ticks: number;
    readonly axisAt: string;
    readonly orient: string;
    readonly tickStroke: string;
    readonly stroke: string;
    readonly tickFormat: Function;
    readonly tickValues?: ReadonlyArray<number>;
    readonly innerTickSize?: number;
    readonly tickStrokeDasharray?: string;
    readonly tickStrokeOpacity?: number;
    readonly tickStrokeWidth?: number;
  }

  class XAxis extends React.Component<XAxisProps> {}
  class YAxis extends React.Component<YAxisProps> {}
}

declare module "react-stockcharts/lib/coordinates" {
  import * as React from "react";

  interface CrossHairCursorProps {}

  interface EdgeIndicatorProps {
    readonly itemType: string;
    readonly orient: string;
    readonly edgeAt: string;
    readonly displayFormat: Function;
    readonly yAccessor: Function | number;
    readonly fill: Function | string;
    readonly fontSize: number;
    readonly yAxisPad: number;
  }

  interface CurrentCoordinateProps {
    readonly yAccessor: Function | number;
    readonly fill: string;
    readonly r: number;
  }

  interface MouseCoordinateYProps {
    readonly at: string;
    readonly orient: string;
    readonly displayFormat: Function | number;
    readonly fontSize: number;
  }

  class CrossHairCursor extends React.Component<CrossHairCursorProps> {}
  class EdgeIndicator extends React.Component<EdgeIndicatorProps> {}
  class CurrentCoordinate extends React.Component<CurrentCoordinateProps> {}
  class MouseCoordinateY extends React.Component<MouseCoordinateYProps> {}
}

declare module "react-stockcharts/lib/tooltip" {
  import * as React from "react";

  interface HoverTooltipProps {
    readonly yAccessor: Function | number;
    readonly fill: string;
    readonly bgFill: string;
    readonly opacity: number;
    readonly stroke: string;
    readonly fontFill: string;
    readonly fontFamily: string;
    readonly backgroundShapeSVG: Function;
    readonly tooltipSVG: Function;
    readonly tooltipContent: Function;
    readonly fontSize: number;
  }

  interface BollingerBandTooltipProps {
    readonly origin: ReadonlyArray<number>;
    readonly yAccessor: Function;
    readonly options: {
      readonly sourcePath: string;
      readonly windowSize: number;
      readonly multiplier: number;
      readonly movingAverageType: string;
    };
    readonly textFill: string;
  }

  interface OptionProps {
    readonly yAccessor: Function;
    readonly type: string;
    readonly stroke: string;
    readonly windowSize: number;
  }

  interface MovingAverageTooltipProps {
    readonly onClick: Function;
    readonly origin: ReadonlyArray<number>;
    readonly textFill: string;
    readonly options: ReadonlyArray<OptionProps>;
  }

  class HoverTooltip extends React.Component<HoverTooltipProps> {}
  class BollingerBandTooltip extends React.Component<BollingerBandTooltipProps> {}
  class MovingAverageTooltip extends React.Component<MovingAverageTooltipProps> {}
}

declare module "react-stockcharts/lib/indicator" {
  const bollingerBand: Function;
  const rsi: Function;
  const sma: Function;
  const stochasticOscillator: Function;
  const macd: Function;
}

declare module "react-stockcharts/lib/scale" {
  interface DiscontinuousTimeScaleProviderI {
    readonly inputDateAccessor: Function;
  }

  const discontinuousTimeScaleProvider: DiscontinuousTimeScaleProviderI;
}

declare module "react-stockcharts/lib/helper" {
  const fitWidth: Function;
}
