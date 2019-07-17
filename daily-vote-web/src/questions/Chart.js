import React from "react";
//import { Chart, Axis, Series, Tooltip, Cursor, Line } from "react-charts";
import './Chart.css';
import { LineChart } from 'react-chartkick'
import 'chart.js'

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
const stupidMap = ((result, data) => {
  result[data.x] = data.y; 
  return result; 
})

const lineChart = ({data}) => (
  <LineChart data={data.map((_)=> ({name: _.series, data: _.data.reduce(stupidMap, {})}))} />
);

export default lineChart;