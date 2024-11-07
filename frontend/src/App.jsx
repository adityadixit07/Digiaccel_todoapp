import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Onboarding from "./components/Onboarding";
import TodoMain from "./pages/TodoMain";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/todo" element={<TodoMain />} />
      </Routes>
    </Router>
  );
};

export default App;
