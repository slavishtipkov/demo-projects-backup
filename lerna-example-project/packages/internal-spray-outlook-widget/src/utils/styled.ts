import { GREEN, NA, RED, YELLOW } from "../constants";
import { Risk } from "../interfaces";

export function getColorForRisk(risk: Risk): string {
  let { value } = risk;
  if (value === "low") {
    return GREEN;
  } else if (value === "medium") {
    return YELLOW;
  } else if (value === "high") {
    return RED;
  }
  return NA;
}
