import BaseChart from "./BaseChart";
import PropTypes from "prop-types";
import Color from "colorjs.io";

const Scatterplot = ({ data, options }) => {
  const defaultOptions = {
    chart: {
      type: 'scatter',
    },
    plotOptions: {
      series: {
        color: 'lightgrey',
      },
      scatter: {
        lineWidth: 2,
        marker: {
          enabled: false,
        },
      },
    },
    tooltip: {
      enabled: false,
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
  }

  const finalData = data.map(([x, y]) => {
    return {
      x,
      y,
    }
  });

  let beginningColor = new Color("p3", [1, 0, 0]);
  let endColor = new Color("p3", [0, 1, 0]);

  let gradient = beginningColor.range(endColor, {
    space: "lch",
    outputSpace: "srgb"
  });

  for (let i = 1; i < finalData.length - 1; i++) {
    if (i % 3 === 0) {
      const color = gradient(i / (finalData.length - 1)).toString();

      finalData[i].marker = {
        symbol: 'circle',
        fillColor: color.toString(),
        enabled: true,
        radius: 1.75,
      }
    }
  }

  const sharedFinalAndBeginMarker = {
    symbol: 'circle',
    enabled: true,
    radius: 3,
  }

  finalData[0].marker = {
    fillColor: beginningColor.toString(),
    ...sharedFinalAndBeginMarker,
  }
  finalData[finalData.length - 1].marker = {
    fillColor: endColor.toString(),
    ...sharedFinalAndBeginMarker,
  }

  return (
    <BaseChart options={finalOptions} data={finalData} />
  )
}

Scatterplot.propTypes = {
  data: PropTypes.array.isRequired
}

export default Scatterplot;