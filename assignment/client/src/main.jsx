/**
 * @fileoverview Application entry point.
 * Mounts the root React component into the DOM and imports global styles.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

/**
 * Create a React root on the #root DOM element and render the App.
 * StrictMode enables additional development warnings for common mistakes.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
