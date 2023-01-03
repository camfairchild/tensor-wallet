import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
const container = document.getElementById("app");
const root = createRoot(container);
root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
