declare module "react-stockcharts" {
  import * as React from "react";

  interface ChartCanvasProps<D> {
    readonly height: number;
    readonly width: number;
    readonly ratio: number;
    readonly margin?: {
      readonly top?: number;
      readonly right?: number;
      readonly bottom?: number;
      readonly left?: number;
    };
    readonly type: string;
    readonly seriesName: string;
    readonly data: ReadonlyArray<D>;
    readonly xScale: Function;
    readonly xAccessor: Function;
    readonly displayXAccessor: Function;
    readonly panEvent: boolean;
    readonly zoomEvent: boolean;
    readonly pointsPerPxThreshold: number;
    readonly maintainPointsPerPixelOnResize: boolean;
  }

  class ChartCanvas<D> extends React.Component<ChartCanvasProps<D>> {}

  interface ChartProps {
    readonly id: string;
    readonly yExtents: Function | ReadonlyArray<Object>;
    readonly padding?: {
      readonly top?: number;
      readonly right?: number;
      readonly bottom?: number;
      readonly left?: number;
    };
  }

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

  class LineSeries extends React.Component<LineSeriesProps> {}
  class CandlestickSeries extends React.Component<CandlestickSeriesProps> {}
  class OHLCSeries extends React.Component<OHLCSeriesProps> {}
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
    readonly zoomEnabled?: boolean;
  }

  interface YAxisProps {
    readonly ticks: number;
    readonly axisAt: "left" | "right" | "middle";
    readonly orient: "left" | "right";
    readonly tickStroke?: string;
    readonly stroke?: string;
    readonly tickFormat?: Function;
    readonly innerTickSize?: number;
    readonly tickStrokeDasharray?: string;
    readonly tickStrokeOpacity?: number;
    readonly tickStrokeWidth?: number;
    readonly zoomEnabled?: boolean;
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
    readonly tooltipSVG?: Function;
    readonly tooltipContent: Function;
    readonly fontSize: number;
  }

  class HoverTooltip extends React.Component<HoverTooltipProps> {}
}

declare module "react-stockcharts/lib/scale" {
  interface DiscontinuousTimeScaleProvider<D = any> {
    readonly inputDateAccessor: (
      callback: (d: D) => Date,
    ) => {
      (d: D): {
        readonly data: D;
        readonly xScale: Function;
        readonly xAccessor: Function;
        readonly displayXAccessor: Function;
      };
    };
  }

  const discontinuousTimeScaleProvider: DiscontinuousTimeScaleProvider;
}

declare module "react-stockcharts/lib/helper" {
  const fitWidth: Function;
}

declare module "react-stockcharts/lib/annotation" {
  import * as React from "react";

  interface AnnotateProps {
    readonly with: React.ComponentClass;
    readonly when: Function;
    readonly usingProps: object;
    readonly className: string;
  }

  class Annotate extends React.Component<AnnotateProps> {}

  class SvgPathAnnotation extends React.Component<any> {}
}
