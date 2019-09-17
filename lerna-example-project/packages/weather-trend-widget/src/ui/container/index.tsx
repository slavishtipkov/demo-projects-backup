import styled from "../../styled-components";

export const ChartContainer = styled("div")`
  font-size: 16px;
  font-family: inherit, sans-serif;
  padding: 7px;
  border: 1px solid #bfbfbf;
  overflow-x: hidden;
  text-align: left;
  background-color: white;

  svg.react-stockchart {
    overflow: visible !important;
  }

  .react-stockcharts-enable-interaction {
    pointer-events: none;
  }

  .tooltip-text-wrapper {
    fill: #474747 !important;
  }

  .tooltip-date {
    font: 800 10.3px sans-serif !important;
    fill: #474747 !important;
  }

  .series-label {
    font: 800 10.5px sans-serif !important;
  }

  .tooltip-label {
    font: 800 10.3px sans-serif !important;
    fill: #474747 !important;
  }

  .tooltip-value {
    fill: #474747 !important;
  }

  .react-stockcharts-grabbing-cursor,
  .react-stockcharts-crosshair-cursor {
    overflow: hidden !important;
  }

  .react-stockcharts-crosshair-cursor {
    stroke-width: 1px;
    stroke: #bfbfbf;
    stroke-opacity: 0.8;
    opacity: 1 !important;
    fill: transparent;
  }
`;
