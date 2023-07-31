import {Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography} from "@mui/material";
import {useState} from "react";


const TrendRadioPicker = ({showFormLabel = false, onChange }) => {
  const [hasBeenClicked, setHasBeenClicked] = useState(false);

  const handleOnChange = (e) => {
    e.stopPropagation();
    setHasBeenClicked(true);
    onChange(e.target.value);
  }

  const commonRadioSx = {
    '& .MuiSvgIcon-root': {
      fontSize: 14,
    }
  }

  const notSelectedBorder = "1.5px solid #ffaeae";

  return (
    <Box display="flex" alignItems={"center"} justifyContent={"center"} backgroundColor={hasBeenClicked ? "white" : "#fff7f7"} px={0.5} borderRadius={2} border={hasBeenClicked ? undefined : notSelectedBorder}>
      <FormControl>
        {showFormLabel && (
          <Typography align={"center"}>
            <FormLabel required id="demo-row-radio-buttons-group-label">
              Pick a trend
            </FormLabel>
          </Typography>
        )
        }
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          onChange={(e) => handleOnChange(e)}
          onClick={(e) => e.stopPropagation()}
        >
          <FormControlLabel value="down" sx={{color: theme => theme.palette.error.main}} control={
            <Radio sx={{
              ...commonRadioSx,
              color: theme => theme.palette.error.main,
              '&.Mui-checked': {
                color: theme => theme.palette.error.main,
              }
            }
            }/>
          } label="↓"/>
          <FormControlLabel value="notrend" control={
            <Radio color={"default"}/>
          } label="—" sx={{...commonRadioSx}}/>
          <FormControlLabel value="up" sx={{color: theme => theme.palette.success.main}} control={
            <Radio size={"small"} sx={{
              ...commonRadioSx,
              color: theme => theme.palette.success.main,
              '&.Mui-checked': {
                color: theme => theme.palette.success.main,
              }
            }
            }/>
          } label="↑"/>
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

export default TrendRadioPicker;