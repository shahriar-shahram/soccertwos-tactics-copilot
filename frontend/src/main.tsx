import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage";
import ReplayPage from "./pages/ReplayPage";
import CopilotPage from "./pages/CopilotPage";
import ComparePage from "./pages/ComparePage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/replay" element={<ReplayPage />} />
        <Route path="/copilot" element={<CopilotPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
