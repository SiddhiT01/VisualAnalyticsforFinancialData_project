import ScatterplotExp from "../components/experiments/ScatterplotExp";
import TimelineExp from "../components/experiments/TimelineExp";
import ExtScatterplotExp from "../components/experiments/ExtScatterplotExp";
import EnchancedScatterplotExp from "../components/experiments/EnchancedScatterplotExp";

import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, updateUser} from "../util/firebase";
import {useDocument} from "react-firebase-hooks/firestore";
import {doc} from 'firebase/firestore';
import ExperimentTimer from "../components/experiments/ExperimentTimer";
import {Box, Button, CircularProgress, Container, Typography} from "@mui/material";
import {useState} from "react";
import Prompt from "../components/Prompt";
import experimentDataJson from "../data/experimentData.json";
import {useStopwatch} from "react-timer-hook";
import enhancedCSPData from "../data/enhancedCSPData.json";

const Experiment = () => {
  const [user] = useAuthState(auth);
  const [value, loading] = useDocument(doc(db, 'users',user.uid)) //user.uid
  const [submitting, setSubmitting] = useState(false);

  const [currentExperiment, setCurrentExperiment] = useState(0);
  const [finished, setFinished] = useState(false);
  const [firstChartClickTime, setFirstChartClickTime] = useState(null);
  const [experimentStartTime, setExperimentStartTime] = useState(new Date());
  const [experimentData, setExperimentData] = useState({});
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset
  } = useStopwatch({autoStart: false});
 
  const userReadyStatus = value?.data()?.ready;
  const userFinishStatus = value?.data()?.finished;
  const experimentOrder = value?.data()?.scatterplotExperimentOrder;

  const handleExperimentDataChange = ({key, data}) => {
    if (!firstChartClickTime) {
      setFirstChartClickTime({ hours, minutes, seconds });
    }
    //console.log(key)
    const newData = {...experimentData[key], ...data};
    console.log(newData)
    setExperimentData({
      ...experimentData,
      [key]: newData
    });
  }

  const handleExperimentSubmit = async () => {
    setSubmitting(true);

    const correctAmount = Object.values(experimentData).filter((data) => data.correct === data.prediction).length;
    const accuracy = parseFloat((correctAmount / Object.values(experimentData).length).toFixed(2));

    const totalMinutes = (hours * 60) + minutes + (seconds / 60);
    const avgCorrectPerMinute = parseFloat((correctAmount / totalMinutes).toFixed(2));

    const result = {
      timeTaken: {
        hours,
        minutes,
        seconds
      },
      timeTakenIsoDuration: `PT${hours}H${minutes}M${seconds}S`,
      startedAt: experimentStartTime.toISOString(),
      finishedAt: new Date().toISOString(),
      experimentData,
      accuracy,
      avgCorrectPerMinute,
      correctAmount,
      firstChartClickTime,
      firstChartClickTimeIso: `PT${firstChartClickTime.hours}H${firstChartClickTime.minutes}M${firstChartClickTime.seconds}S`
    }

    // Extended Scatterplot Experiment
    if (experimentOrder[currentExperiment] === "extended") {
      result.extendedAmount = Object.values(experimentData).filter((data) => data.clicked).length;
    }

    await updateUser({
      uid: user.uid,
      [`result.${experimentOrder[currentExperiment]}`]: result,
    });


    await goToNextExperiment();
  }

  const goToNextExperiment = async () => {
    if (currentExperiment === experimentOrder.length - 1) {
      await updateUser({uid: user.uid, finished: true});
      setFinished(true);
      setSubmitting(false);
    } else {
      setCurrentExperiment(currentExperiment + 1);
      setExperimentStartTime(new Date());
      setExperimentData({});
      reset(0, false);
      setSubmitting(false);
    }
  }

  const experiment = ({...props}) => {
    switch (experimentOrder[currentExperiment]) {
      case "scatterplot":
        return <ScatterplotExp {...props} />;
      case "timeline":
        return <TimelineExp {...props} />;
      case "extended":
        return <ExtScatterplotExp {...props} />;
      case "enchanced_scatterplot":
        return <EnchancedScatterplotExp {...props} />;
      default:
        return <Typography>Invalid experiment</Typography>;
    }
  }
  if (loading || submitting) {
    return (
      <CircularProgress/>
    );
  }

  if (!userReadyStatus) {
    return (
      <Typography my={5} variant={"h5"} align={"center"}>
        Your account has not been prepared, please contact the researcher.
      </Typography>
    );
  }

  const predictionsMade = Object.keys(experimentData).filter((key) => experimentData[key].prediction !== undefined).length;
  const submissionValid = predictionsMade === (experimentOrder[currentExperiment]!="enchanced_scatterplot"?experimentDataJson.dataAmount:enhancedCSPData.length);


  if (finished || userFinishStatus) {
    return (
      <Typography variant={"h5"} align={"center"}>
        Thank you for participating in this study! <br/><a href={"https://forms.gle/BPSf6UixrkA11gj37"}>Please give your final feedback in this form</a>
      </Typography>
    );
  }

  return (
    <Container maxWidth={"xl"}>
      <Prompt when={true} message={"WARNING: Are you sure you want to leave the experiment?\n\nYour data will not be saved!"}/>

      <ExperimentTimer hours={hours} minutes={minutes} seconds={seconds} pause={pause} start={start} isRunning={isRunning} />
      <Typography gutterBottom variant={"body1"} align={"center"} display={isRunning ? "inline-flex" : "none"} style={{ marginLeft: "70px" }}>
          A&nbsp;<Typography component={"span"} color={"red"}> red marker</Typography>&nbsp;means the start of the connected
          scatterplot, a <Typography component={"span"} color={"lightgreen"}>&nbsp;green marker</Typography>&nbsp;means the end of
          the
          connected scatterplot. (<Typography component={"span"} color={"lightgreen"}>Green</Typography> = most recent)
          
      </Typography>
      <center><Typography gutterBottom display={isRunning ? "inline-flex" : "none"}>
          Each scatterplot &nbsp;<Typography fontWeight={"bold"} component={"span"}>can be clicked</Typography>&nbsp; to open a modal with a timeseries chart of the same data. You should aim to use both charts to decide on the trend.
        </Typography>
        </center>
      <Typography variant={"caption"} display={!isRunning ? "block" : "none"}>
        <p>The experiment is currently paused. Press the play button to start/continue the experiment.</p>
      </Typography>



      {experiment({
        isPaused: !isRunning,
        onExperimentDataChange: handleExperimentDataChange
      })}
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} my={"2em"} sx={{ flexDirection: "column"}}>
        {!submissionValid &&
          <Typography variant={"caption"} color={"error"} paragraph>
            {predictionsMade} /  {(experimentOrder[currentExperiment]!="enchanced_scatterplot"?experimentDataJson.dataAmount:enhancedCSPData.length)} trends have been selected.
          </Typography>
        }
        <Button
          variant={"contained"}
          onClick={handleExperimentSubmit}
          disabled={!submissionValid || submitting}
        >
          Submit
        </Button>
      </Box>
    </Container>
  )
}

export default Experiment;