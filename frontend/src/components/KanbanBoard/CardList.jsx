import PropTypes from 'prop-types';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import TaskCard from '../Task/TaskCard';

import CollapseAll from '../../assets/icons/collapseAll.svg';
import Add from '../../assets/icons/add.svg';

import { toggleTaskCollapse, selectTasksByType } from '../../store/slices/tasksSlice';

import styles from './CardList.module.css';

function CardList({ type }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tasks = useSelector(selectTasksByType(type), shallowEqual);

  const handleCollapseAll = () => {
    tasks.forEach((task) => {
      if (!task.isCollapsed) {
        dispatch(toggleTaskCollapse({ taskId: task._id, taskType: type }));
      }
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

      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}

CardList.propTypes = {
  type: PropTypes.string.isRequired,
};

// Memoize CardList to prevent re-renders when other columns change
export default memo(CardList);
