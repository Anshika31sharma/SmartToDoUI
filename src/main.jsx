import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { TaskProvider } from "./context/TaskContext";
import { worker } from "./lib/browser";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

worker.start();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TaskProvider>
        <App />
      </TaskProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
