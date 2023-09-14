import experimentData from "../data/experimentData.json";

/**
 * Used for the timeseries charts in the experiment
 * @param companyInfo
 * @return {[{data: *[], name: string},{data: *[], name: string},{data: *[], name: string}]}
 */
export const getFormattedTimeseriesForCompany = (companyInfo) => {
  const priceData = [];
  const indicatorOneData = [];
  const indicatorTwoData = [];

  companyInfo.data.price.forEach((dataPoint) => {
    priceData.push({
      x: new Date(dataPoint[1]),
      y: dataPoint[0]
    });
  });
  
  companyInfo.data.indicatorOne.forEach((dataPoint) => {
    indicatorOneData.push({
      x: new Date(dataPoint[1]),
      y: dataPoint[0]
    });
  });

  companyInfo.data.indicatorTwo.forEach((dataPoint) => {
    indicatorTwoData.push({
      x: new Date(dataPoint[1]),
      y: dataPoint[0]
    });
  });

  return [
    {
      name: "Price",
      data: priceData,
      color: "#5db2ee",
      showInLegend: true,
    },
    {
      name: experimentData.axis.scatterplot.x.name.toUpperCase() + ` (${experimentData.axis.scatterplot.x.resolution})`,
      data: indicatorOneData,
      color: "#f68d3f",
      showInLegend: true,
    },
    {
      name: experimentData.axis.scatterplot.y.name.toUpperCase() + ` (${experimentData.axis.scatterplot.y.resolution})`,
      data: indicatorTwoData,
      color: "#7300ff",
      showInLegend: true,
    }];
}

export const getFormattedTimeseriesForExtScatter = (dataInfo) => {
  const priceData = [];
  const indicatorOneData = [];
  const indicatorTwoData = [];
  const indicatorThreeData=[]
  dataInfo.forEach((dataPoint) => {
    var dateString=dataPoint.date
    var dateParts = dateString.split("/"); 
    var date=new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
    priceData.push({
      x: date,
      y: dataPoint['close']
    });

    indicatorOneData.push({
      x: date,
      y: dataPoint['sma(250)']
    });
  
    indicatorTwoData.push({
      x: date,
      y: dataPoint['sma(50)']
    });
    indicatorThreeData.push({
      x: date,
      y: dataPoint['ema']
    });
  });

  return [
    {
      name: "Price",
      data: priceData,
      color: "#5db2ee",
      showInLegend: true ,     
     turboThreshold :0
    },
    {
      name: 'SMA(250)',
      data: indicatorOneData,
      color: "#f68d3f",
      showInLegend: true,
      turboThreshold :0
    },
    {
      name: 'SMA(50)',
      data: indicatorTwoData,
      color: "#7300ff",
      showInLegend: true,
      turboThreshold :0
    },
    {
      name: 'EMA',
      data: indicatorThreeData,
      color: "red",
      showInLegend: true,
      turboThreshold :0
    }];
}