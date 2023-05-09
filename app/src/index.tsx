import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./views/App";
import Sweeper from "./views/Sweeper";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/sweeper", element: <Sweeper /> },
]);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
