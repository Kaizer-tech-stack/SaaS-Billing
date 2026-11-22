import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import "./styles/variable.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/component.css";

import "./styles/dashboard.css";
import "./styles/reports.css";
import "./styles/algorithm-lab.css";

import "./styles/responsive.css";
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
