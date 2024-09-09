import * as React from 'react';
import BaseChart from "./BaseChart";

const Timeseries = ({ data, options }) => {
  const defaultOptions = {
    chart: {
      type: 'line',
    },
    xAxis: {
      type: 'datetime',
    }
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
  }

  return (
    <BaseChart options={finalOptions} data={data} />
  )
}

export default Timeseries;