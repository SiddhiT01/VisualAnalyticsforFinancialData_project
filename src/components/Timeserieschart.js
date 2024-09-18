import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Timeserieschart = ({ data, highlightedPoint }) => {
  const seriesData = data.map(d => ({
    x: new Date(d.date).getTime(),
    y: d.close,
  }));

  const options = {
    chart: {
      height: 400,  // Adjust height to give more space
      width: 800,   // Adjust width for better distribution
      spacingRight: 100, // Add spacing between the chart and glyph
    },
    title: {
      text: 'Timeline Visualization',
      align: 'left',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
      },
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
    },
    series: [
      {
        name: 'Price',
        data: seriesData,
        type: 'line',
        color: '#7cb5ec',
        marker: {
          enabled: true,
          radius: 2,  // Reduce marker size for less dominance
          symbol: 'circle',
        },
        lineWidth: 2,
        allowPointSelect: true, // Allow individual point selection
      },
      {
        name: 'SMA(50)',
        data: data.map(d => ({
          x: new Date(d.date).getTime(),
          y: d['sma(50)'],
        })),
        type: 'line',
        color: '#FFD580',
        marker: {
          enabled: true,
          radius: 2,  // Consistent marker size
          symbol: 'circle',
        },
        lineWidth: 2,
        allowPointSelect: true, // Allow individual point selection
      },
      {
        name: 'SMA(250)',
        data: data.map(d => ({
          x: new Date(d.date).getTime(),
          y: d['sma(250)'],
        })),
        type: 'line',
        color: '#90ed7d',
        marker: {
          enabled: true,
          radius: 2,  // Consistent marker size
          symbol: 'circle',
        },
        lineWidth: 2,
        allowPointSelect: true, // Allow individual point selection
      }
    ],
    xAxis: {
      type: 'datetime',
      labels: {
        format: '{value:%b %e}',  // More precise date formatting
      },
    },
    yAxis: {
      title: {
        text: 'Price',
      },
      gridLineDashStyle: 'Dash',
    },
    plotOptions: {
      series: {
        animation: false,
        marker: {
          enabled: true,
        },
        // Disable shared tooltips and prevent series cross-highlighting
        states: {
          hover: {
            enabled: true,
            halo: false // Disable outer glow for other series
          }
        },
      },
    },
    tooltip: {
      shared: false,  // Disable shared tooltip
      useHTML: true,
      formatter: function () {
        return `Date: ${Highcharts.dateFormat('%A, %b %e, %Y', this.x)} <br/> Price: ${this.y}`;
      },
    },
  };

  // Clear previous highlights
  options.series[0].data.forEach(point => {
    point.marker = { enabled: true, radius: 2, fillColor: null }; // Adjusted marker radius
  });

  // Highlight a specific point if needed
  if (highlightedPoint) {
    options.series[0].data.forEach(point => {
      if (new Date(point.x).getTime() === new Date(highlightedPoint.date).getTime()) {
        point.marker = { enabled: true, radius: 6, fillColor: 'red' }; // Highlight the current point
      }
    });
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Timeserieschart;
