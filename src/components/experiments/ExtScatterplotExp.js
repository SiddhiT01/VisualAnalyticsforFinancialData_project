import {Box, Modal, Typography} from "@mui/material";
import {useState} from "react";
import Scatterplot from "../chart/Scatterplot";
import TrendRadioPicker from "./TrendRadioPicker";
import Timeseries from "../chart/Timeseries";
import experimentData from "../../data/experimentData2.json";
import {getFormattedTimeseriesForCompany} from "../../util/util";
import ExperimentInfoBox from "./ExperimentInfoBox";

const ExtScatterplotExp = ({isPaused, onExperimentDataChange}) => {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

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

  const onTrendChange = (id, symbol, prediction, correct) => {
    const compositeKey = `${symbol}-${id}`;

    onExperimentDataChange({key: compositeKey, data: {prediction, correct}});
  }

  const onChartClick = (i, id, symbol) => {
    onExperimentDataChange({key: `${symbol}-${id}`, data: {clicked: true}});

    setOpen(true);

    const series = getFormattedTimeseriesForCompany(experimentData.data[i]);

    setModalData({
      chartOptions: {
        series,
        showInLegend: true,
      }
    });
  }

  return (
    <>
      <ExperimentInfoBox>
        <Typography gutterBottom variant={"h5"} align={"center"} fontWeight={"bold"}>Expandable Scatterplot
          Experiment</Typography>
        <Typography paragraph>
          This is a combination of the previous two experiments.
        </Typography>
        <Typography paragraph>
          Each scatterplot <Typography fontWeight={"bold"} component={"span"}>can be clicked</Typography> to open a modal with a timeseries chart of the same data. You should aim to use both charts to decide on the trend.
        </Typography>
        <Typography gutterBottom variant={"body1"} align={"center"}>
          A <Typography component={"span"} color={"red"}>red marker</Typography> means the start of the connected
          scatterplot, a <Typography component={"span"} color={"lightgreen"}>green marker</Typography> means the end of
          the
          connected scatterplot. (<Typography component={"span"} color={"lightgreen"}>Green</Typography> = most recent)
        </Typography>
      </ExperimentInfoBox>

      <Box bgcolor={isPaused ? "grey" : "white"}>
        <Box
          sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', p: 0}}
          visibility={isPaused ? "hidden" : "visible"}
        >
          {experimentData.data.map((obj, i) => {
            return (
              <Box
                sx={{
                  p: 1, border: '1px dashed lightgrey', borderRadius: 1, margin: 0.5, '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: theme => theme.palette.grey[100],
                  }
                }}
                key={i}
                onClick={() => onChartClick(i, obj.id, obj.symbol)}
              >
                <Scatterplot data={obj.data.scatterplot} options={chartOptions}/>
                <TrendRadioPicker
                  onChange={(newPrediction) => onTrendChange(obj.id, obj.symbol, newPrediction, obj.trend)}/>
                {/*<p style={{fontSize: 13}}>*/}
                {/*  {obj.trend} - {i} - {obj.symbol}*/}
                {/*</p>*/}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/*<Grid container spacing={1} rowSpacing={5}>*/}
      {/*  {Array.from({length: 20}).map((_, i) => (*/}
      {/*    // eslint-disable-next-line react/jsx-key*/}
      {/*    <Grid item xs={6} md={4} lg={3} onClick={() => setOpen(true)} key={i}>*/}
      {/*      <Scatterplot data={data} key={i}/>*/}
      {/*      <TrendRadioPicker/>*/}
      {/*    </Grid>*/}
      {/*  ))}*/}
      {/*</Grid>*/}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        keepMounted
      >
        <Box
          p={2}
          backgroundColor={"white"}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
          <Timeseries options={modalData?.chartOptions}/>
        </Box>
      </Modal>
    </>
  );
}

export default ExtScatterplotExp;