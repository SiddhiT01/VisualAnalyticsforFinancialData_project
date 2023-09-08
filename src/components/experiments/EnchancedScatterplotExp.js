import {Box, Modal,Typography} from "@mui/material";
import EnchancedScatterplot from "../chart/EnchancedScatterplot";
import TrendRadioPicker from "./TrendRadioPicker";
import outputs from "../../data/outputs.json";
import ExperimentInfoBox from "./ExperimentInfoBox";
import Timeseries from "../chart/Timeseries";
import {getFormattedTimeseriesForExtScatter} from "../../util/util";
import {useState} from "react";

const ScatterplotExp = ({ isPaused, onExperimentDataChange }) => {
 
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const onTrendChange = (i, symbol, prediction, correct) => {
    const compositeKey = `${symbol}-${i}`;

    onExperimentDataChange({key: compositeKey, data: {prediction, correct}});
  }
  const onChartClick = (i, id, symbol) => {
    onExperimentDataChange({key: `${symbol}-${id}`, data: {clicked: true}});

    setOpen(true);
   
    const series = getFormattedTimeseriesForExtScatter(outputs[i].data);

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
        <Typography gutterBottom variant={"h5"} align={"center"} fontWeight={"bold"}>Scatterplot Experiment
          ( Scatterplots)</Typography>
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
              
          {outputs.map((obj,i) => {
            return (
              <Box
                sx={{p: 1, border: '1px dashed lightgrey', borderRadius: 1, margin: 0.5}}
                key={i}
                
              >
                <EnchancedScatterplot data={obj} i={i} id={obj.id} onChartClick={onChartClick} />
                <TrendRadioPicker onChange={(newPrediction) => onTrendChange(obj.id, obj.name, newPrediction, obj.trend)}/>
               
              </Box>
            );
          })} 
      
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
        </Box>
      </Box>

    </>
  )
}

export default ScatterplotExp;