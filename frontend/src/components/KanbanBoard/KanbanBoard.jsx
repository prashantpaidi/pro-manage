import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getAllTasks } from '../../apis/tasks';
import { isLogin } from '../../utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import CardList from './CardList';
import styles from './KanbanBoard.module.css';
import { listofTypes } from '../../utils/constants';
import { useTaskContext } from '../../context/taskContext';

export default function KanbanBoard({ startDate }) {
  const navigate = useNavigate();

  const [tasksOld, setTasks] = useState([]);

  const { tasks, updateTasks } = useTaskContext();

  // useEffect(() => {
  //   console.log('state', state);
  //   if (state && state.replace) {
  //     // Replace the tasks with the new task
  //     setTasks((prevState) => {
  //       return prevState.map((item) => {
  //         if (item._id === state.task._id) {
  //           return {
  //             ...state.task,
  //             isCollapsed: true,
  //           };
  //         }
  //         return item;
  //       });
  //     });
  //   } else if (state && state.newTask) {
  //     // Add the new task to the tasks
  //     setTasks((prevState) => {
  //       return [
  //         ...prevState,
  //         {
  //           ...state.task,
  //           isCollapsed: true,
  //         },
  //       ];
  //     });
  //   }
  // }, [state]);

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
        listofTypes.forEach((type) => {
          tasksData[type].forEach((task) => {
            if (task.taskType === type) {
              task.isCollapsed = true;
            }
          });
        });
        // tasksData.forEach((task) => {
        //   task.isCollapsed = true;
        // });
        // setTasks(tasksData);
        updateTasks(tasksData);
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
        <CardList key={type} type={type} />
      ))}
    </div>
  );
}

KanbanBoard.propTypes = {
  startDate: PropTypes.instanceOf(Date).isRequired,
};
