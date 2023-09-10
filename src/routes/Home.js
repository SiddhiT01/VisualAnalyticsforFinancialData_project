import {Box, Container, Tooltip, Typography} from "@mui/material";
import TrendRadioPicker from "../components/experiments/TrendRadioPicker";
import {useState} from "react";
import ExperimentTimer from "../components/experiments/ExperimentTimer";
import {useStopwatch} from "react-timer-hook";
import ExperimentInfoBox from "../components/experiments/ExperimentInfoBox";
const Home = () => {
  const [tooltipOpen, setTooltipOpen] = useState(true);
  const {
    minutes,
    seconds,
    hours,
    isRunning,
    start,
    pause,
  } = useStopwatch({autoStart: true});

  return (
    <Container maxWidth={"md"}>
      <h2>Welcome to the actual user study!</h2>
      <Typography fontSize={20} paragraph>
        In this study, you will complete <b>three small experiments</b>. Each experiment has twenty graphs. You will
        need to <b>predict a trend</b> for each graph. We recommend you full screen your browser window for the best
        experience.
      </Typography>
      <h2>Experiment interface:</h2>
      <Typography fontSize={20} paragraph>
        Predictions will be made with the following buttons:
      </Typography>
      <Typography paragraph>
        <Typography component={"span"} color={"red"}>↓ = Down Trend</Typography> /
        <Typography component={"span"} color={"grey"}> — = No Trend</Typography> /
        <Typography component={"span"} color={"green"}> ↑ = Up Trend</Typography>
      </Typography>
      <Tooltip title={"Click me!"} arrow open={tooltipOpen} mb={10}>
        <Box maxWidth={200} p={2} border={"1px dashed lightgrey"}>
          <TrendRadioPicker onChange={() => {
          }}/>
        </Box>
      </Tooltip>
      <Typography fontSize={20} paragraph>
        There will be a timer for each experiment. It will look like this:
      </Typography>
      <Tooltip title={"Click me!"} arrow open={tooltipOpen} mb={7}>
        <Box maxWidth={150} p={2} border={"1px dashed lightgrey"}>
          <ExperimentTimer hours={hours} minutes={minutes} seconds={seconds} pause={pause} start={start} isRunning={isRunning}/>
        </Box>
      </Tooltip>
      <Typography fontSize={20} paragraph>
        Each experiment begins paused. You should unpause the timer when you are ready to start. If you want to take a break you can pause at any time.
      </Typography>
       
      <Typography fontSize={20} paragraph>
        The experiment is not a race, take as much time as you need to make your predictions.
      </Typography>
      <h2>How to start</h2>
      <Typography fontSize={20} paragraph mb={50}>
        When you are ready to begin, go to the <b>"Account"</b> page and login with the account provided to you. Afterwards, go to the <b>"Experiment"</b> page.
      </Typography>
    </Container>
  );
}

export default Home;