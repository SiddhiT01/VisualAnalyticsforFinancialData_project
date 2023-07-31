import {Box, Typography} from "@mui/material";
import EnchancedScatterplot from "../chart/EnchancedScatterplot";
import TrendRadioPicker from "./TrendRadioPicker";
import experimentData from "../../data/experimentData.json";
import ExperimentInfoBox from "./ExperimentInfoBox";

const ScatterplotExp = ({ isPaused, onExperimentDataChange }) => {
  const sharedAxisOptions = {
    tickWidth: 0,
    labels: {
      enabled: false,
    }
  }

  const chartOptions = {
    chart: {
      height: 125,
      width: 125
    },
    xAxis: {
      ...sharedAxisOptions,
      title: {
        text: experimentData.axis.scatterplot.x.name.toUpperCase() + ` (${experimentData.axis.scatterplot.x.resolution})`,
      }
    },
    yAxis: {
      ...sharedAxisOptions,
      title: {
        text: experimentData.axis.scatterplot.y.name.toUpperCase() + ` (${experimentData.axis.scatterplot.y.resolution})`,
      }
    }
  }

  const onTrendChange = (i, symbol, prediction, correct) => {
    const compositeKey = `${symbol}-${i}`;

    onExperimentDataChange({key: compositeKey, data: {prediction, correct}});
  }

  return (
    <>
      <ExperimentInfoBox>
        <Typography gutterBottom variant={"h5"} align={"center"} fontWeight={"bold"}>Scatterplot Experiment
          ({experimentData.dataAmount} Scatterplots)</Typography>
        <Typography gutterBottom variant={"body1"} align={"center"}>Please select the trend that you think is most likely
          to be present in the scatterplot.</Typography>
        <Typography gutterBottom variant={"body1"} align={"center"}>
          A <Typography component={"span"} color={"red"}>red marker</Typography> means the start of the connected
          scatterplot, a <Typography component={"span"} color={"lightgreen"}>green marker</Typography> means the end of
          the
          connected scatterplot. (<Typography component={"span"} color={"lightgreen"}>Green</Typography> = most recent)
        </Typography>
      </ExperimentInfoBox>

      <Box bgcolor={isPaused ? "grey" : "white"}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            p: 0,
          }}
          visibility={isPaused ? "hidden" : "visible"}
        >
        
              <Box
                sx={{p: 1, border: '1px dashed lightgrey', borderRadius: 1, margin: 0.5}}
               
              >
                <EnchancedScatterplot />
                
              
              </Box>
           
        </Box>
      </Box>

    </>
  )
}

export default ScatterplotExp;