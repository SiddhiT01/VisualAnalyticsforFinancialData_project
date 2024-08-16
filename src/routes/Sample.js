
import {Box, Container,Modal, Tooltip, Typography} from "@mui/material";
import EnchancedScatterplot from "../components/chart/EnchancedScatterplot";
//import TrendRadioPicker from "../experiments/TrendRadioPicker";
import enhancedCSPData from "../data/enhancedCSPData.json";
import experimentData from "../data/experimentData2.json";
import Timeseries from "../components/chart/Timeseries";
import Scatterplot from "../components/chart/Scatterplot";
import * as React from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {getFormattedTimeseriesForExtScatter,getFormattedTimeseriesForCompany} from "../util/util";
import TrendRadioPicker from "../components/experiments/TrendRadioPicker";


import {useState,useEffect } from "react";
const Sample = () => {
    const [open, setOpen] = useState(false);
    const [prediction, setpredictionResult] = useState({timeline:[],connected:[],enhanced:[]});
    const [value, setValue] = React.useState('1');
    const [modalData, setModalData] = useState(null);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
   
    const series = getFormattedTimeseriesForExtScatter(enhancedCSPData[0].data);
    const onTrendChange = (id,btnprediction, correct,chart_type) =>{
    if(correct===btnprediction){
        prediction[chart_type][id]={"result":"Correct","color":"green"}
    }else{
        prediction[chart_type][id]={"result":"Try Again","color":"red"}
    }
    setpredictionResult(prevState => ({...prevState,prediction}))
   
    }
  
    const onChartClick = (i, id, symbol) => {
        console.log(symbol)
        setOpen(true);
        const series = getFormattedTimeseriesForExtScatter(enhancedCSPData[i].data);
        setModalData({
          chartOptions: {
            series,
            showInLegend: true,
            
          }
        });
        
      }
      const sharedAxisOptions = {
        tickWidth: 0,
        labels: {
          enabled: false,
        }
      }
      const ScatterchartOptions = {
        chart: {
          height: 200,
          width: 200
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
    <Container maxWidth={"md"}>
     
      <h2>Welcome to the mockup!</h2>
      <Typography fontSize={20} paragraph>
        In this mockup, you can get to know <b>three small experiments</b> to predict the <b>trend</b>. A sample of each experiment in the actual study is given below.
      </Typography>

      <TabContext value={value}>
  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <TabList onChange={handleChange} aria-label="lab API tabs example">
      <Tab label="Timeline" value="1" />
      <Tab label="Connected Scatterplot" value="2" />
      <Tab label="Enchanced interface" value="3" />
    </TabList>
  </Box>
  <TabPanel value="1">
 
  {allChartInformation.map((info, i) => {
              return ( 
    <Box key={info.id}  p={2} border={"1px dashed lightgrey"}>
      <Timeseries options={info.chartOptions}/>
      <TrendRadioPicker onChange={(newPrediction) => onTrendChange(info.id, newPrediction, info.trend,"timeline")}  />
      <center><Typography component={"span"} align="center" color={prediction.timeline[info.id]?.color}>{prediction.timeline[info.id]?.result}</Typography></center>
      </Box> );
            })}
  </TabPanel>

  <TabPanel value="2"> 
  <Typography gutterBottom variant={"body1"} align={"center"}>
          A <Typography component={"span"} color={"red"}>red marker</Typography> means the start of the connected
          scatterplot, a <Typography component={"span"} color={"lightgreen"}>green marker</Typography> means the end of
          the
          connected scatterplot. (<Typography component={"span"} color={"lightgreen"}>Green</Typography> = most recent)
        </Typography>
  <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            p: 0,
          }}
         
        >
  {experimentData.data.map((obj, i) => {
    return (
    <Box p={2} key={i} sx={{p: 1, border: '1px dashed lightgrey', borderRadius: 1, margin: 0.5}}>
      <Scatterplot data={obj.data.scatterplot} options={ScatterchartOptions}/>
      <TrendRadioPicker onChange={(newPrediction) => onTrendChange(i,newPrediction,obj.trend,"connected")}/>
      <center><Typography component={"span"} align="center" color={prediction.connected[i]?.color}>{prediction.connected[i]?.result}</Typography></center>
    
      </Box>
     );
    })}
     </Box>
  </TabPanel>
  <TabPanel value="3">
  <Typography gutterBottom variant={"body1"} align={"center"}>
          A <Typography component={"span"} color={"red"}>red marker</Typography> means the start of the connected
          scatterplot, a <Typography component={"span"} color={"lightgreen"}>green marker</Typography> means the end of
          the
          connected scatterplot (<Typography component={"span"} color={"lightgreen"}>Green</Typography> = most recent).

          <Typography component={"span"} >
          Each scatterplot <Typography fontWeight={"bold"} component={"span"}>can be clicked</Typography> to open a modal with a timeseries chart of the same data. You should aim to use both charts to decide on the trend.
        </Typography>
        </Typography>
  <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            p: 0,
          }}
         
        >
           {enhancedCSPData.map((obj,i) => {
            return (
     <Box p={2} key={i} maxWidth={200} border={"1px dashed lightgrey"}  onClick={() => onChartClick(i, obj.id, obj.name)}>
            <EnchancedScatterplot data={obj} i={i} id={obj.id} />
            <TrendRadioPicker onChange={(newPrediction) => onTrendChange(i,newPrediction,obj.trend,"enhanced")} />
            <center><Typography component={"span"} align="center" color={prediction.enhanced[i]?.color}>{prediction.enhanced[i]?.result}</Typography></center>
    
      </Box>
    );
    })} 
      </Box>
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
    </TabPanel>
    </TabContext>



    
    </Container>
  );
}

export default Sample;