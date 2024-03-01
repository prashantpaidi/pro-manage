import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  Backlog: [],
  'To do': [],
  'In progress': [],
  Done: [],
};

const TaskContext = createContext(initialState);

// Step 3: Create provider
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialState);

  const updateTasks = (newTasks) => {
    setTasks(newTasks);
  };

  return (
    <TaskContext.Provider value={{ tasks, updateTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  return useContext(TaskContext);
};

TaskProvider.propTypes = {
  children: PropTypes.any,
};
