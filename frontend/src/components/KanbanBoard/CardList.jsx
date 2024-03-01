import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../Task/TaskCard';

import CollapseAll from '../../assets/icons/collapseAll.svg';
import Add from '../../assets/icons/add.svg';

import { useTaskContext } from '../../context/taskContext';

import styles from './CardList.module.css';

export default function CardList({ type }) {
  const navigate = useNavigate();

  const { tasks, updateTasks } = useTaskContext();
  
  const handleCollapseAll = () => {
    updateTasks((prevState) => {
      const updatedState = { ...prevState };
      for (const taskType in updatedState) {
        if (taskType === type) {
          updatedState[taskType] = updatedState[taskType].map((item) => ({
            ...item,
            isCollapsed: true,
          }));
        }
      }
      return updatedState;
    });
  };

  const handleAddTask = () => {
    navigate('/add-task');
  };

  return (
    <div className={styles.cardList}>
      <div className={styles.titleContainer}>
        <h2 className={styles.titleText}>{type}</h2>
        {type === 'To do' && <img src={Add} onClick={handleAddTask} />}
        <img src={CollapseAll} onClick={handleCollapseAll} />
      </div>

      {tasks[type].map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}

CardList.propTypes = {
  type: PropTypes.string.isRequired,
};
