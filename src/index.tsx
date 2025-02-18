import React from "react";
import App from "./App";
import {
  ThemeToggleProvider
} from "./components"
import {
  createTheme,
  ThemeProvider
} from "@mui/material";

import { createRoot } from "react-dom/client";
const container = document.getElementById("app");
const root = createRoot(container!);
const theme = createTheme();

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ThemeToggleProvider>
        <App />
      </ThemeToggleProvider>
    </ThemeProvider>
  </React.StrictMode>
);
