import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Onboarding from "./components/Onboarding";
import TodoPage from "./components/TodoPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/todo" element={<TodoPage />} />
      </Routes>
    </Router>
  );
};

export default App;
