import {Box} from "@mui/material";

const ExperimentInfoBox = ({ children }) => {
  return (
    <Box p={1} my={2} border={"4px solid lightblue"} bgcolor={"#dee8f6"} textAlign={"center"}>
      {children}
    </Box>
  )
}

export default ExperimentInfoBox;