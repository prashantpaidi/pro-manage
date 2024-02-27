import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import optionsIcon from '../../assets/icons/options.svg';

import { listofTypes } from '../../utils/constants';
import { formatDateMonD } from '../../utils/helpers';
import { deleteTask, updateTask } from '../../apis/tasks';

import arrowDown from '../../assets/icons/arrowDown.svg';
import arrowUp from '../../assets/icons/arrowUp.svg';

import styles from './TaskCard.module.css';

export default function TaskCard({ task, setTasksData }) {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  const handleToggleCollapse = () => {
    setTasksData((prevState) => {
      return prevState.map((item) => {
        if (item._id === task._id) {
          return { ...item, isCollapsed: !item.isCollapsed };
        }
        return item;
      });
    });
  };

  const handleCurrentTypeChange = (currentType) => {
    // updae database
    try {
      updateTask(task._id, { taskType: currentType });
    } catch (error) {
      toast.error('Error updating task type');
    }

    setTasksData((prevState) => {
      return prevState.map((item) => {
        if (item._id === task._id) {
          return { ...item, taskType: currentType };
        }
        return item;
      });
    });
  };

  const handleOptionsToggle = () => {
    setShowOptions(!showOptions);
  };

  const handleEdit = () => {
    navigate(`/add-task/`, {
      state: { task, edit: true },
    });
    setShowOptions(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_APP_WEB_URL}/task/${task._id}`
    );
    toast.success('Copied to clipboard');
    setShowOptions(false);
  };

  const handleDelete = async () => {
    // Handle delete functionality
    try {
      await deleteTask(task._id);
      setTasksData((prevState) =>
        prevState.filter((item) => item._id !== task._id)
      );
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error deleting task');
    }
    setShowOptions(false);
  };

  return (
    <div className={styles.taskCard} key={task._id}>
      <div className={styles.taskPriorityContainer}>
        <p className={styles.taskPriority}>{task.priority}</p>
        <button
          onClick={handleOptionsToggle}
          className={styles.transparentButton}
        >
          <img src={optionsIcon} />
        </button>
        {showOptions && (
          <div className={styles.optionsDropdown}>
            <button
              className={styles.optionsDropdownButton}
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className={styles.optionsDropdownButton}
              onClick={handleShare}
            >
              Share
            </button>
            <button
              className={`${styles.optionsDropdownButton} ${styles.redColor}`}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <h2 className={styles.taskTitle}>{task.title}</h2>
      {/* taskChecklist */}
      <div className={styles.taskChecklist}>
        <div className={styles.checklistTitleContainer}>
          Checklist{' ('}
          {task.checklist.filter((item) => item.done).length}/
          {task.checklist.length}
          {')'}
          <button onClick={handleToggleCollapse}>
            {task.isCollapsed ? (
              <img src={arrowDown} alt='Collapse' />
            ) : (
              <img src={arrowUp} alt='Expand' />
            )}
          </button>
        </div>
        {!task.isCollapsed &&
          task.checklist.map((item, index) => (
            <div key={index} className={styles.checklistItem}>
              <div
                className={`${styles.customCheckbox} ${
                  item.done ? `${styles.checked}` : ''
                }`}
              />

              <p className={styles.checklistItemTextInput}>{item.text}</p>
            </div>
          ))}
      </div>
      {/* taskChecklist */}
      <div className={styles.taskDetailsContainer}>
        {task.due_date && (
          <p className={styles.taskDueDate}>{formatDateMonD(task.due_date)}</p>
        )}
        <div className={styles.listofTypes}>
          {listofTypes.map(
            (currType) =>
              currType !== task.taskType && (
                <span
                  className={styles.typesElement}
                  key={currType}
                  onClick={() => {
                    handleCurrentTypeChange(currType);
                  }}
                >
                  {currType}
                </span>
              )
          )}
        </div>
      </div>
    </div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    priority: PropTypes.oneOf([
      'HIGH PRIORITY',
      'MODERATE PRIORITY',
      'LOW PRIORITY',
    ]).isRequired,
    checklist: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        done: PropTypes.bool.isRequired,
      })
    ).isRequired,
    taskType: PropTypes.oneOf(['To do', 'Backlog', 'In progress', 'Done'])
      .isRequired,
    due_date: PropTypes.instanceOf(Date),
    createdAt: PropTypes.instanceOf(Date).isRequired,
    isCollapsed: PropTypes.bool.isRequired,
  }).isRequired,
  setTasksData: PropTypes.func.isRequired,
};