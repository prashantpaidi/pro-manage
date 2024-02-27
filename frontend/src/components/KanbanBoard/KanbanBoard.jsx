import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getAllTasks } from '../../apis/tasks';
import { isLogin } from '../../utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import CardList from './CardList';
import styles from './KanbanBoard.module.css';
import { listofTypes } from '../../utils/constants';

export default function KanbanBoard({ startDate }) {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    console.log('state', state);
    if (state && state.replace) {
      // Replace the tasks with the new task
      setTasks((prevState) => {
        return prevState.map((item) => {
          if (item._id === state.task._id) {
            return state.task;
          }
          return item;
        });
      });
    } else if (state && state.newTask) {
      // Add the new task to the tasks
      setTasks((prevState) => {
        return [...prevState, state.task._id];
      });
    }
  }, [state]);

  // Function to fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const loggedInUser = isLogin();
      if (loggedInUser) {
        const tasksData = await getAllTasks(
          loggedInUser.id,
          loggedInUser.token,
          startDate
        );
        console.log('tasksData', tasksData);
        tasksData.forEach((task) => {
          task.isCollapsed = true;
        });
        setTasks(tasksData);
      } else {
        navigate('/auth/login');
      }
    } catch (error) {
      alert('Error fetching tasks:', error);
      console.error('Error fetching tasks:', error);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, [startDate]);

  return (
    <div className={styles.kanbanBoard}>
      {/* loop  */}
      {listofTypes.map((type) => (
        <CardList key={type} taskData={tasks} type={type} setTasks={setTasks} />
      ))}
      {/* {tasks ? <CardList taskData={tasks} type='Todo' /> : null}

      <CardList taskData={tasks} type='todo' />
      <CardList taskData={tasks} type='In Progress' />
      <CardList taskData={tasks} type='Done' />
      <CardList taskData={tasks} type='Backlog' /> */}
    </div>
  );
}

KanbanBoard.propTypes = {
  startDate: PropTypes.string.isRequired,
};
