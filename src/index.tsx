import React from "react";
import App from "./App";
import {
  ThemeToggleProvider
} from "./components"

import { createRoot } from "react-dom/client";
const container = document.getElementById("app");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThemeToggleProvider>
      <App />
    </ThemeToggleProvider>
  </React.StrictMode>
);
