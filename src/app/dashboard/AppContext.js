// AppContext.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [budget, setBudget] = useState(0);
  const [goals, setGoals] = useState([]);

  const addGoal = (newGoal) => setGoals((prevGoals) => [...prevGoals, newGoal]);

  return (
    <AppContext.Provider value={{ budget, setBudget, goals, addGoal }}>
      {children}
    </AppContext.Provider>
  );
};
