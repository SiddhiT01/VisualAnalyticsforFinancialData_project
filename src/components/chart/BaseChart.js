import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsBoost from 'highcharts/modules/boost';

HighchartsBoost(Highcharts);

const BaseChart = ({ options, data }) => {
  const defaultOptions = {
    title: {
      text: '',
    },
    series: [
      {
        data,
        showInLegend: false,
      }
    ],
    plotOptions: {
      series: {
        animation: false,
        marker: {
          enabled: false,
        },
        boost: true,
      }
    },
    yAxis: {
      title: {
        text: ""
      }
    },
    xAxis: {
      title: {
        text: ""
      }
    },
    credits: {
      enabled: false
    }
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
  }

  return (
    <HighchartsReact highcharts={Highcharts} options={finalOptions} />
  )
}

export default BaseChart;