import {Box, Container, Typography} from "@mui/material";
import Timeseries from "../chart/Timeseries";
import TrendRadioPicker from "./TrendRadioPicker";
import experimentData from "../../data/experimentData.json";
import {getFormattedTimeseriesForCompany} from "../../util/util";
import ExperimentInfoBox from "./ExperimentInfoBox";

const TimelineExp = ({isPaused, onExperimentDataChange}) => {
  const onTrendChange = (i, symbol, prediction, correct) => {
    const compositeKey = `${symbol}-${i}`;

    onExperimentDataChange({key: compositeKey, data: {prediction, correct}});
  }

  const getAllSeries = () => {
    const allSeries = [];

    experimentData.data.forEach((companyInfo) => {
      allSeries.push(getFormattedTimeseriesForCompany(companyInfo))
    });

    return allSeries;
  }

  const allChartInformation = getAllSeries().map((series, i) => {
    return {
      chartOptions: {
        showInLegend: true,
        series,
      },
      symbol: experimentData.data[i].symbol,
      id: experimentData.data[i].id,
      trend: experimentData.data[i].trend,
    }
  });

  return (
    <>
      <ExperimentInfoBox>
        <Typography gutterBottom variant={"h5"} align={"center"} fontWeight={"bold"}>Timeline Experiment</Typography>
        <Typography variant={"body1"} paragraph>
          This experiment has regular time series graphs. There will be three lines:
          <ul>
            <li>Blue: The actual price of the stock</li>
            <li>Orange: SMA 25 (Short term trends)</li>
            <li>Purple: SMA 125 (General Trend)</li>
          </ul>
        </Typography>
      </ExperimentInfoBox>
      <Container maxWidth={"lg"} display={"flex"} flexDirection={"column"} bgcolor={isPaused ? "grey" : "white"}>
        <Box mt={3} visibility={isPaused ? "hidden" : "visible"}>
            {allChartInformation.map((info, i) => {
              return (
                <Box p={1} border={'1px dashed grey'} borderRadius={1} margin={1} key={i} xs={12}>
                  <Timeseries options={info.chartOptions}/>
                  <TrendRadioPicker
                    onChange={(newPrediction) => onTrendChange(info.id, info.symbol, newPrediction, info.trend)}/>
                  {/*<p style={{fontSize: 13}}>*/}
                  {/*  {info.trend} - {i} - {info.symbol}*/}
                  {/*</p>*/}
                </Box>
              );
            })}
        </Box>
      </Container>
    </>
  );
}

export default TimelineExp;