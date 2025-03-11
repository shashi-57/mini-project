import React, { useState } from 'react';

const Goal = ({ goal, setGoal }) => {
  const [inputGoal, setInputGoal] = useState(goal?.amount || '');
  const [goalName, setGoalName] = useState(goal?.name || '');

  const handleGoalChange = (e) => {
    setInputGoal(e.target.value);
  };

  const handleNameChange = (e) => {
    setGoalName(e.target.value);
  };

  const handleSaveGoal = () => {
    setGoal({ name: goalName, amount: inputGoal });
    // API call to save goal to the backend
  };

  return (
    <div>
      <h2>Set Your Financial Goal</h2>
      <input
        type="text"
        value={goalName}
        onChange={handleNameChange}
        placeholder="Goal Name (e.g., Vacation)"
      />
      <input
        type="number"
        value={inputGoal}
        onChange={handleGoalChange}
        placeholder="Goal Amount"
      />
      <button onClick={handleSaveGoal}>Save Goal</button>
      {goal && (
        <p>
          Goal: {goal.name} - ${goal.amount}
        </p>
      )}
    </div>
  );
};

export default Goal;
