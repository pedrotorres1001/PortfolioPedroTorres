import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./index.css";
import App from "./App.jsx";
import { AppStateProvider } from "./state/AppState";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </MotionConfig>
  </StrictMode>
);
