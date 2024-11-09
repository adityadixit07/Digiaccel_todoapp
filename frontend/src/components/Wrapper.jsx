import React, { useState } from "react";
import TodoMain from "../pages/TodoMain";
import Onboarding from "./Onboarding";

const Wrapper = () => {
  const [showTodo, setShowTodo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setLoading(true);
    setTimeout(() => {
      setShowTodo(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen justify-center items-center">
      {loading ? (
        <p className="text-blue-500">Loading...</p>
      ) : showTodo ? (
        <TodoMain />
      ) : (
        <Onboarding onGetStarted={handleGetStarted} />
      )}
    </div>
  );
};

export default Wrapper;
