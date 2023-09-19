import {Box, Modal} from "@mui/material";
import EnchancedScatterplot from "../chart/EnchancedScatterplot";
import TrendRadioPicker from "./TrendRadioPicker";
import enhancedCSPData from "../../data/enhancedCSPData16.json";
import Timeseries from "../chart/Timeseries";
import {getFormattedTimeseriesForExtScatter} from "../../util/util";
import {useState} from "react";

const ScatterplotExp = ({ isPaused, onExperimentDataChange }) => {
 
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  const onTrendChange = (id, symbol, prediction, correct) => {
    const compositeKey = `${symbol}-${id}`;
    //console.log(symbol)
    console.log(compositeKey)
    onExperimentDataChange({key: compositeKey, data: {prediction, correct}});
  }
  const onChartClick = (i, id, symbol) => {
   
   onExperimentDataChange({key: `${symbol}-${id}`, data: {clicked: true}});

    setOpen(true);
   console.log( `${symbol}-${id}`)
    const series = getFormattedTimeseriesForExtScatter(enhancedCSPData[i].data);
    setModalData({
      chartOptions: {
        series,
        showInLegend: true,
        
      }
    });
  }
  return (
    <>
     
       
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
              
          {enhancedCSPData.map((obj,i) => {
            return (
              <Box
                sx={{p: 1, border: '1px dashed lightgrey', borderRadius: 1, margin: 0.5}}
                key={i}  onClick={() => onChartClick(i, obj.id, obj.name)}              
              >
                <EnchancedScatterplot data={obj} i={i} id={obj.id} />
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