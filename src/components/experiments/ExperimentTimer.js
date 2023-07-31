import {Box, IconButton, Typography} from "@mui/material";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const ExperimentTimer = ({ seconds, minutes, hours, isRunning, start, pause }) => {

  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedHours = hours < 10 ? `0${hours}` : hours;

  return (
    <Box bgcolor={isRunning ? "info.main" : "text.disabled"} px={1} alignItems={"center"} sx={{display: 'inline-flex'}}>
      <Typography color={isRunning ? "text.primary" : "text.disabled"} component={"div"} variant={"h6"}>
        {formattedHours}:{formattedMinutes}:{formattedSeconds}
      </Typography>
      <IconButton onClick={isRunning ? pause : start}>
        {isRunning ?
          <PauseIcon/> :
          <PlayArrowIcon/>
        }
      </IconButton>
    </Box>
  )
}

export default ExperimentTimer;