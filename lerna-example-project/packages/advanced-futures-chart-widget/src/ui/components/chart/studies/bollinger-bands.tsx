import * as React from "react";
import { BollingerSeries } from "react-stockcharts/lib/series";
import { colorPalette } from "../../../../constants";
import { HistoricPrice } from "../../../../interfaces";

export interface Props {}

export interface State {}

class StudyBollingerBands extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {};
  }

  render(): JSX.Element {
    const bbStroke = {
      top: colorPalette.studies.bollingerBands.upper,
      middle: colorPalette.studies.bollingerBands.middle,
      bottom: colorPalette.studies.bollingerBands.lower,
    };

    const bbFill = "#ffffff";

    return (
      <BollingerSeries
        // tslint:disable-next-line:jsx-no-lambda
        yAccessor={(d: HistoricPrice) => d.bb}
        stroke={bbStroke}
        fill={bbFill}
      />
    );
  }
}

export default StudyBollingerBands;
