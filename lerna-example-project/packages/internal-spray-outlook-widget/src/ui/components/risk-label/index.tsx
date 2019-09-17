import * as React from "react";
import { Risk } from "../../../interfaces";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";
import { getColorForRisk } from "../../../utils/index";

export interface RiskLabelProps {
  readonly risk: Risk;
  readonly className?: string;
}
export const riskLabel: React.SFC<RiskLabelProps> = props => (
  <span className={props.className} data-testid="risk-label">
    {props.children}
  </span>
);
export const RiskLabel = styled<RiskLabelProps>(riskLabel)`
  color: ${({ risk }) => getColorForRisk(risk)};
`;

export default RiskLabel;
