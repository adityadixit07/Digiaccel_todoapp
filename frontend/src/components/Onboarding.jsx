import React from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen justify-end items-center p-8 bg-blue-500 text-white">
      <div className="w-full text-center mb-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Manage What To Do</h1>
        <p className="text-base mb-6">
          The best way to manage what you have to do, don't forget your plans
        </p>
      </div>
      <button
        className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg w-full max-w-xs"
        onClick={() => navigate("/todo")}
      >
        Get Started
      </button>
    </div>
  );
};

export default Onboarding;
