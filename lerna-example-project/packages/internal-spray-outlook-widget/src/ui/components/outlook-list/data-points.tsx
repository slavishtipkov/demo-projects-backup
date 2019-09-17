import * as React from "react";
import { Risk } from "../../../interfaces";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import { getColorForRisk } from "../../../utils";

export interface OutlookRiskProps {
  readonly risk: Risk;
}

export const OutlookRisk = styled<OutlookRiskProps, "div">("div")`
  color: ${({ risk }) => getColorForRisk(risk)};
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
  text-align: center;

  > *:first-child {
    margin: 10px auto;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    align-items: center;

    > *:first-child {
      margin: 0 10px;
    }
  }
`;

export interface PrecipRiskProps {
  readonly risk: Risk;
}

export const PrecipRisk = styled<PrecipRiskProps, "div">("div")`
  color: ${({ risk }) => getColorForRisk(risk)};
`;

export const Wind = styled.div`
  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
    align-items: center;

    > * + * {
      margin-left: 10px;
    }
  }
`;

export interface WindDirection {
  readonly direction: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}
export const WindDirection = styled<WindDirection, "div">("div")`
  display: flex;
  align-items: center;
  font-size: 22px;
  font-family: LatoBold, Helvetica, sans-serif;
  text-transform: uppercase;

  > i {
    transform: rotate(
      ${({ direction }) => {
        if (direction === "NE") {
          return 45;
        } else if (direction === "E") {
          return 90;
        } else if (direction === "SE") {
          return 135;
        } else if (direction === "S") {
          return 180;
        } else if (direction === "SW") {
          return 225;
        } else if (direction === "W") {
          return 270;
        } else if (direction === "NW") {
          return 315;
        } else {
          // Default to direction === "N"
          return 0;
        }
      }}deg
    );
  }
`;

export interface WindSpeedRiskProps {
  readonly risk: Risk;
}
export const WindSpeedRisk = styled<WindSpeedRiskProps, "div">("div")`
  color: ${({ risk }) => getColorForRisk(risk)};
`;

export const WeatherCondition = styled("div")`
  display: flex;

  > * + * {
    padding-left: 10px;
  }
`;
