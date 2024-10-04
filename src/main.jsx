import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/UserContext"; // Correctly importing UserProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider> {/* Wrapping the entire app with UserProvider */}
      <BrowserRouter> {/* Wrapping with BrowserRouter for routing */}
        <App />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
