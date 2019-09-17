/* tslint:disable:jsx-no-lambda */
import { Units } from "@dtn/i18n-lib";
import * as moment from "moment";
import * as React from "react";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";
import { AccessorArg } from ".";
import { Consumer as I18nConsumer } from "../../i18n";
import { getUnitKeyForWeatherField } from "./utils";

interface BackgroundShapeSvgProps {}

const backgroundShapeSVG = (
  {
    fill,
    stroke,
    opacity,
  }: { readonly fill: string; readonly stroke: string; readonly opacity: number },
  { height, width }: { readonly height: string; readonly width: number },
) => {
  return (
    <rect
      height={parseFloat(height)}
      width={width < 170 ? 170 : width}
      fill={fill}
      opacity={opacity}
      stroke={stroke}
      rx="5"
      ry="5"
    />
  );
};

interface ChartTooltipProps {
  readonly weatherFieldKeys: ReadonlyArray<string>;
  readonly unitsLabel?: string;
  readonly units: Units;
}

export const ChartTooltip: React.SFC<ChartTooltipProps> = props => {
  return (
    <I18nConsumer>
      {({ t }) => (
        <HoverTooltip
          yAccessor={(d: AccessorArg) => d[props.weatherFieldKeys[0]]}
          backgroundShapeSVG={backgroundShapeSVG}
          fill="#f8f8f8"
          bgFill="#f8f8f8"
          opacity={0.9}
          stroke="rgba(90,90,90,0.3)"
          fontFill="#474747"
          fontFamily="inherit"
          fontSize={12}
          tooltipContent={({
            currentItem,
            xAccessor,
          }: {
            readonly currentItem: AccessorArg;
            readonly xAccessor: Function;
          }) => {
            return {
              x: moment(xAccessor(currentItem))
                .utc()
                .format("MMMM Do, YYYY"),
              y: props.weatherFieldKeys.map(k => {
                let unitTranslationKey = getUnitKeyForWeatherField(k);
                let label = "";
                if (k.indexOf("Depth") > -1) {
                  label = `${parseInt(k)} `;
                }
                let requiresRounding = props.unitsLabel && props.unitsLabel.indexOf("%") > -1;
                let val = currentItem[k];
                return {
                  label: `${label}${t(`units.${unitTranslationKey}`, {
                    context: props.units,
                  })} depth`,
                  value:
                    // tslint:disable-next-line:strict-type-predicates
                    val === null || val === undefined
                      ? t("noData")
                      : `${requiresRounding ? Math.round(val) : val}${props.unitsLabel}`,
                };
              }),
            };
          }}
        />
      )}
    </I18nConsumer>
  );
};

export default ChartTooltip;
