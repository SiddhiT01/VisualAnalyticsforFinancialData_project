import React, {useEffect} from 'react';
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import StudyNavbar from "./components/StudyNavbar";

const App = () => {
  useEffect(() => {
    document.title = "Financial Visualization Study";
  }, []);

  return (
    <>
      <StudyNavbar/>
      <main>
        <Container maxWidth={false}>
          <Outlet/>
        </Container>
      </main>
    </>
  );
}

export default App;
