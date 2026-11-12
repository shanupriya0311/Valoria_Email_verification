import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import SupabaseConnectionStatus from "./SupabaseConnectionStatus.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <App />
      <SupabaseConnectionStatus />
    </>
  </React.StrictMode>,
);
