import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import {Link} from "react-router-dom";

const StudyNavbar = () => {
  return (
    <Box sx={{flexGrow: 1}} marginBottom={"1rem"}>
      <AppBar position={"static"}>
        <Toolbar>
          <Link to={"/"}>
            <Typography variant={"h5"} sx={{color: "white", mr: 2}}>
              User Study
            </Typography>
          </Link>
          <Link to="mockup">
            <Typography variant={"h6"} sx={{color: "white", mr: 2}}>
              Mockup
            </Typography>
          </Link>
          <Link to="experiment">
            <Typography variant={"h6"} sx={{color: "white", mr: 2}}>
              Experiment
            </Typography>
          </Link>
          <Link to="login">
            <Typography variant={"h6"} sx={{color: "white"}}>
              Account
            </Typography>
          </Link>
        </Toolbar>
        
      </AppBar>
    </Box>
  )
}

export default StudyNavbar;