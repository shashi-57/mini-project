import React, { useState } from 'react';

const Budget = ({ budget, setBudget }) => {
  const [inputBudget, setInputBudget] = useState(budget || '');

  const handleBudgetChange = (e) => {
    setInputBudget(e.target.value);
  };

  const handleSaveBudget = () => {
    setBudget(inputBudget);
    // You can make an API call to save the budget to the backend here
  };

  return (
    <div>
      <h2>Set Your Monthly Budget</h2>
      <input
        type="number"
        value={inputBudget}
        onChange={handleBudgetChange}
        placeholder="Enter your budget"
      />
      <button onClick={handleSaveBudget}>Save Budget</button>
      {budget && <p>Current Budget: ${budget}</p>}
    </div>
  );
};

export default Budget;
