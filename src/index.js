// index.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { sendToVercelAnalytics } from './vitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Experiment from "./routes/Experiment";
import Login from "./routes/Login";
import LoggedInRoute from "./components/auth/LoggedInRoute";
import Home from "./routes/Home";
import Sample from "./routes/Sample";
import SyncedVisualization from "./routes/SyncedVisualization"; // Import the new route component

// Define your routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/mockup',
        element: <Sample />,
      },
      {
        path: '/experiment',
        element: <LoggedInRoute><Experiment /></LoggedInRoute>,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/Synced-Visualization', // Add the new route
        element: <SyncedVisualization />,
      }
    ]
  }
]);

// Use createRoot instead of ReactDOM.render
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Report web vitals (optional)
reportWebVitals(sendToVercelAnalytics);
