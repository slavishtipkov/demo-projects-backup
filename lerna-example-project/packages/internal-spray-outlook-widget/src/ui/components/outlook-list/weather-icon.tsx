import * as React from "react";
import { WeatherCondition } from "../../../interfaces";
import { ThemeProp } from "../../../styled-components";

export interface Props {
  readonly condition: WeatherCondition;
  readonly theme: ThemeProp;
}
export const weatherIcon: React.SFC<Props> = props => {
  if (props.condition.symbolic === null) {
    return null;
  }
  let baseUrl = props.theme.baseWeatherIconUrl;
  let src = baseUrl + props.condition.symbolic + "_32.png";
  return <img src={src} width={32} height={32} />;
};

export default weatherIcon;
