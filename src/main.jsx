import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./index.css";
import App from "./App.jsx";
import { AppStateProvider } from "./state/AppState";

// Mensagem para quem abre a consola do browser.
console.log(
  "%c[ PEDRO TORRES ]%c\n\nHello, curious one. You opened the devtools — my kind of visitor.\nPress ~ for the real terminal, or try the Konami code.\n\nsource: github.com/pedrotorres1001/PortfolioPedroTorres",
  "font: 14px monospace; letter-spacing: .3em; padding: 4px 0;",
  "font: 12px monospace; color: #8a8c91;"
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </MotionConfig>
  </StrictMode>
);
