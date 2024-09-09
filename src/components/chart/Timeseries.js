import * as React from 'react';
import BaseChart from "./BaseChart";

const Timeseries = ({ data, options, onHoverPoint }) => {
  const defaultOptions = {
    chart: {
      type: 'line',
    },
    xAxis: {
      type: 'datetime',
    },
    plotOptions: {
      series: {
        point: {
          events: {
            mouseOver: function () {
              if (onHoverPoint) {
                onHoverPoint(this); // Pass the hovered point to the parent
              }
            }
          }
        }
      }
    }
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
  };

  return (
    <BaseChart options={finalOptions} data={data} />
  );
};

export default Timeseries;
