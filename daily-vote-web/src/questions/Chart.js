import React from "react";
import { Chart, Axis, Series, Tooltip, Cursor, Line } from "react-charts";
import './Chart.css';

/**
 * 
 * @param {data, axisX} param0 
 * @example 
 *  [
      {
        label: "Series 1",
        data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
      },
      {
        label: "Series 2",
        data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
      }
    ]
 */
const lineChart = ({data}) => (
  <Chart data={data}>
    <Axis primary type="ordinal"  />
    <Axis type="linear" min={-1} max={1} />
    <Series type={Line} />
    <Tooltip />
    <Cursor />
  </Chart>
);

export default lineChart;