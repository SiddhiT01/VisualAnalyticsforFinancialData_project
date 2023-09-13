import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {sendToVercelAnalytics} from './vitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Experiment from "./routes/Experiment";
import Login from "./routes/Login";
import LoggedInRoute from "./components/auth/LoggedInRoute";
import Home from "./routes/Home";
import Sample from "./routes/Sample";


const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Home/>,
      },
      {
        path: '/mockup',
        element: <Sample/>,
      },
      {
        path: '/experiment',
        element: <LoggedInRoute><Experiment/></LoggedInRoute>,
      },
      {
        path: '/login',
        element: <Login/>,
      }
    ]
  }
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals(sendToVercelAnalytics);
