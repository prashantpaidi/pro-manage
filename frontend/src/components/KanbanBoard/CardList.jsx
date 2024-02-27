import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../Task/TaskCard';

import CollapseAll from '../../assets/icons/collapseAll.svg';
import Add from '../../assets/icons/add.svg';

import styles from './CardList.module.css';

export default function CardList({ taskData, type, setTasks }) {
  const navigate = useNavigate();
  const handleCollapseAll = () => {
    setTasks((prevState) => {
      return prevState.map((item) => {
        if (item.taskType === type) {
          return { ...item, isCollapsed: true };
        }
        return item;
      });
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

      {taskData
        .filter((task) => task.taskType === type)
        .map((task) => (
          <TaskCard key={task._id} task={task} setTasksData={setTasks} />
        ))}
    </div>
  );
}

CardList.propTypes = {
  taskData: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  setTasks: PropTypes.func.isRequired,
};
