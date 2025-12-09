import PropTypes from 'prop-types';
import { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import optionsIcon from '../../assets/icons/options.svg';

import { listofTypes } from '../../utils/constants';
import { formatDateMonD } from '../../utils/helpers';
import { deleteTask, updateTask } from '../../apis/tasks';
import {
  deleteTaskAsync,
  updateTaskTypeAsync,
  updateChecklistAsync,
  toggleTaskCollapse
} from '../../store/slices/tasksSlice';

import arrowDown from '../../assets/icons/arrowDown.svg';
import arrowUp from '../../assets/icons/arrowUp.svg';

import styles from './TaskCard.module.css';
import Modal from '../UI/Modal';
import Priority from '../UI/Priority';

function TaskCard({ task }) {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [isDueDateExpired, setIsDueDateExpired] = useState(false);

  useEffect(() => {
    // Check if due date is expired
    if (task.due_date) {
      const currentDate = new Date();
      const currentDateMinusOneDay = new Date(currentDate);
      currentDateMinusOneDay.setDate(currentDateMinusOneDay.getDate() - 1);
      const dueDate = new Date(task.due_date);
      // Set due date expired if due date is before current date
      setIsDueDateExpired(dueDate < currentDateMinusOneDay);
      console.log('isDueDateExpired', isDueDateExpired);
    }
  }, [task.due_date]);

  const handleToggleCollapse = () => {
    dispatch(toggleTaskCollapse({ taskId: task._id, taskType: task.taskType }));
  };

  const handleCurrentTypeChange = async (currentType) => {
    try {
      // Dispatch optimistic update
      await dispatch(updateTaskTypeAsync({
        taskId: task._id,
        newType: currentType,
        task: task
      })).unwrap();
    } catch (error) {
      console.error('Error updating task type:', error);
      // Error toast is already shown by the thunk
    }
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
      `${import.meta.env.VITE_APP_WEB_URL}/view-task/${task._id}`
    );
    toast.success('Copied to clipboard');
    setShowOptions(false);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTaskAsync({
        taskId: task._id,
        task: task
      })).unwrap();
    } catch (error) {
      console.error('Error deleting task:', error);
      // Error toast is already shown by the thunk
    }
    setShowOptions(false);
  };

  const handleModalOpen = () => {
    setShowModal(true);
    setShowOptions(false); // Close options when modal is opened
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalConfirm = () => {
    // Perform delete action when user confirms
    handleDelete();
    setShowModal(false);
  };

  const handleChecklistCheckBoxChange = async (index) => {
    try {
      // Deep clone the checklist to avoid mutating frozen Redux state
      const updatedChecklist = task.checklist.map((item, i) => ({
        ...item,
        done: i === index ? !item.done : item.done
      }));

      // Dispatch optimistic update
      await dispatch(updateChecklistAsync({
        taskId: task._id,
        checklist: updatedChecklist,
        task: task
      })).unwrap();
    } catch (error) {
      console.error('Error updating checklist item:', error);
      // Error toast is already shown by the thunk
    }
  };

  return (
    <div className={styles.taskCard} key={task._id}>
      <div className={styles.taskPriorityContainer}>
        <p className={styles.taskPriority}>
          <Priority priority={task.priority} />
          {/* {task.priority} */}
        </p>
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
              className={`${styles.optionsDropdownButton} `}
              onClick={handleModalOpen}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <h2
        className={styles.taskTitle}
        title={task.title.length > 45 ? task.title : null}
      >
        {task.title.length > 45
          ? `${task.title.substring(0, 45)}...`
          : task.title}
      </h2>
      {/* taskChecklist */}
      <div className={styles.taskChecklist}>
        <div className={styles.checklistTitleContainer}>
          Checklist{' ('}
          {task.checklist.filter((item) => item.done).length}/
          {task.checklist.length}
          {')'}
          <button
            onClick={handleToggleCollapse}
            style={{ borderRadius: '0.2rem' }}
          >
            {task.isCollapsed ? (
              <img
                src={arrowDown}
                alt='Collapse'
                className={styles.isCollapsedicon}
              />
            ) : (
              <img
                src={arrowUp}
                alt='Expand'
                className={styles.isCollapsedicon}
              />
            )}
          </button>
        </div>
        {!task.isCollapsed &&
          task.checklist.map((item, index) => (
            <div key={index} className={styles.checklistItem}>
              <div
                className={`${styles.customCheckbox} ${item.done ? `${styles.checked}` : ''
                  }`}
                onClick={(e) => handleChecklistCheckBoxChange(index)}
              />

              <p className={styles.checklistItemTextInput}>{item.text}</p>
            </div>
          ))}
      </div>
      {/* taskChecklist */}
      <div className={styles.taskDetailsContainer}>
        {task.due_date && (
          <p
            className={`${styles.taskDueDate} ${isDueDateExpired ? styles.redColorDate : ''
              } ${task.taskType === 'Done' ? styles.greenColorDate : ''}`}
          >
            {formatDateMonD(task.due_date)}
          </p>
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
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        heading='Are you sure you want to Delete?'
        confirmText='Yes, Delete'
      />
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
    due_date: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
  }).isRequired,
  // setTasksData: PropTypes.func.isRequired,
};

// Memoize TaskCard to prevent unnecessary re-renders
// Only re-render if the task object reference changes
export default memo(TaskCard);
