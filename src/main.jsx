import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TimeOutProvider } from "./contexts/timeOutContext.jsx";
import { AlertProvider } from "./contexts/alertContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <TimeOutProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </TimeOutProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
