import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { TodoProvider } from "./context/TodoContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <TodoProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TodoProvider>
    </ThemeProvider>
  </React.StrictMode>
);
