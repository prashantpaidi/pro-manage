import { useEffect, useState } from 'react';

import { createTask, updateTask } from '../../apis/tasks';

import { useLocation, useNavigate } from 'react-router-dom';
import { isLogin } from '../../utils/helpers';

import deleteIcon from '../../assets/icons/delete.svg';

import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

import styles from './TaskForm.module.css';
import toast from 'react-hot-toast';

const TaskForm = () => {
  let navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { state } = useLocation();
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(null);

  const [taskData, setTaskData] = useState({
    title: '',
    priority: '',
    checklist: [],
    taskType: 'To do',
    due_date: '',
    user: '',
  });

  useEffect(() => {
    // Call the isLogin function to check if user is logged in
    const loggedInUser = isLogin();

    if (loggedInUser) {
      setUser(loggedInUser);
      setTaskData((prevState) => ({
        ...prevState,
        user: loggedInUser.id,
      }));
    } else {
      navigate('/auth/login');
    }

    if (state && state.task) {
      const { _id, title, priority, checklist, taskType, due_date } =
        state.task;
      setTaskData({
        title,
        priority,
        checklist,
        taskType,
        due_date,
        user: loggedInUser.id,
      });
      setEdit(true);
      setId(_id);
    }
  }, []); // Empty dependency array to run the effect only once on component mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChecklistChange = (e, index) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === 'checkbox' ? checked : value;

    setTaskData((prevState) => ({
      ...prevState,
      checklist: prevState.checklist.map((item, i) => {
        if (i === index) {
          return { ...item, [name]: newValue };
        }
        return item;
      }),
    }));
  };

  const handleChecklistCheckBoxChange = (e, index) => {
    console.log('Checklist Checkbox Change:', e.target.checked);
    // const { name, checked } = e.target;
    setTaskData((prevState) => ({
      ...prevState,
      checklist: prevState.checklist.map((item, i) => {
        if (i === index) {
          return { ...item, done: !item.done };
        }
        return item;
      }),
    }));
  };

  const handleDeleteChecklistItem = (index) => {
    setTaskData((prevState) => ({
      ...prevState,
      checklist: prevState.checklist.filter((_, i) => i !== index),
    }));
  };

  const addChecklistItem = () => {
    setTaskData((prevState) => ({
      ...prevState,
      checklist: [...prevState.checklist, { text: '', done: false }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskData.title) {
      toast.error('Please fill in the title');
      return;
    }

    if (!taskData.priority) {
      toast.error('Please select a priority');
      return;
    }

    if (taskData.checklist.length === 0) {
      toast.error('Please add at least one checklist item');
      return;
    }

    // Check if all checklist items are filled
    const isChecklistValid = taskData.checklist.every((item) => item.text);
    if (!isChecklistValid) {
      toast.error('Please fill in all checklist items.');
      return;
    }

    let newTaskData;
    try {
      if (edit) {
        newTaskData = await updateTask(id, taskData);
        console.log('Task updated successfully:', taskData);
        navigate('/', { state: { replace: true, task: newTaskData } });
      } else {
        newTaskData = await createTask(taskData, user.token);
        console.log('Task created successfully:', taskData);

        navigate('/', { state: { newTask: true, task: newTaskData } });
      }
      toast.success('Task saved successfully.');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Internal Server Error. Please try again later.');
    }
  };

  useEffect(() => {
    console.log('Task Data:', taskData);
  }, [taskData]);

  return (
    <div className={styles.backGround}>
      <form onSubmit={handleSubmit} className={styles.taskFormContainer}>
        <label className={styles.label} htmlFor='title'>
          Title <span className={styles.redText}>*</span>
        </label>
        <input
          type='text'
          id='title'
          name='title'
          value={taskData.title}
          onChange={handleChange}
          required
          className={styles.taskNameInput}
          placeholder='Enter Task Title'
        />

        <div className={styles.taskSelectButtonContainer}>
          <label className={styles.label}>
            Select Priority <span className={styles.redText}>*</span>
          </label>
          <div>
            <input
              type='radio'
              id='highPriority'
              name='priority'
              value='HIGH PRIORITY'
              checked={taskData.priority === 'HIGH PRIORITY'}
              onChange={handleChange}
              className={styles.taskRadio}
            />
            <label
              htmlFor='highPriority'
              className={`${styles.taskSelectButton} ${
                taskData.priority === 'HIGH PRIORITY'
                  ? styles.activeTaskSelectButton
                  : ''
              }`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='8'
                height='9'
                viewBox='0 0 8 9'
                fill='none'
              >
                <circle cx='4' cy='4.5' r='4' fill='#FF2473' />
              </svg>
              HIGH PRIORITY
            </label>
          </div>
          <div>
            <input
              type='radio'
              id='moderatePriority'
              name='priority'
              value='MODERATE PRIORITY'
              checked={taskData.priority === 'MODERATE PRIORITY'}
              onChange={handleChange}
              className={styles.taskRadio}
            />
            <label
              htmlFor='moderatePriority'
              className={`${styles.taskSelectButton} ${
                taskData.priority === 'MODERATE PRIORITY'
                  ? styles.activeTaskSelectButton
                  : ''
              }`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='8'
                height='9'
                viewBox='0 0 8 9'
                fill='none'
              >
                <circle cx='4' cy='4.5' r='4' fill='#18B0FF' />
              </svg>
              MODERATE PRIORITY
            </label>
          </div>
          <div>
            <input
              type='radio'
              id='lowPriority'
              name='priority'
              value='LOW PRIORITY'
              checked={taskData.priority === 'LOW PRIORITY'}
              onChange={handleChange}
              className={styles.taskRadio}
            />
            <label
              htmlFor='lowPriority'
              className={`${styles.taskSelectButton} ${
                taskData.priority === 'LOW PRIORITY'
                  ? styles.activeTaskSelectButton
                  : ''
              }`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='8'
                height='9'
                viewBox='0 0 8 9'
                fill='none'
              >
                <circle cx='4' cy='4.5' r='4' fill='#63C05B' />
              </svg>
              LOW PRIORITY
            </label>
          </div>
        </div>
        <label className={styles.label}>
          Checklist: {taskData.checklist.filter((item) => item.done).length}/
          {taskData.checklist.length} <span className={styles.redText}>*</span>
        </label>
        <div className={styles.checklistContainer}>
          {taskData.checklist.map((item, index) => (
            <div key={index} className={styles.checklistItem}>
              <input
                type='checkbox'
                name='done'
                checked={item.done}
                onChange={(e) => handleChecklistChange(e, index)}
                className={styles.checkbox}
                style={{ display: 'none' }}
              />
              <div
                className={`${styles.customCheckbox} ${
                  item.done ? `${styles.checked}` : ''
                }`}
                onClick={(e) => handleChecklistCheckBoxChange(e, index)}
              />

              <input
                type='text'
                name='text'
                value={item.text}
                onChange={(e) => handleChecklistChange(e, index)}
                className={styles.checklistItemTextInput}
                placeholder='Enter Checklist'
              />

              <img
                onClick={() => handleDeleteChecklistItem(index)}
                src={deleteIcon}
                className={styles.deleteButton}
                alt='Delete'
              />
            </div>
          ))}
        </div>
        <div style={{ flexGrow: 1 }}>
          <button
            type='button'
            onClick={addChecklistItem}
            className={styles.addButton}
          >
            + Add Item
          </button>
        </div>

        <div className={styles.buttonContainer}>
          <DatePicker
            caretAs={null}
            placeholder='Select Due Date'
            format='dd/MM/yyyy'
            value={taskData.due_date}
            onChange={(value) => {
              setTaskData((prevState) => ({
                ...prevState,
                due_date: value,
              }));
            }}
          />

          <button
            className={styles.cancelButton}
            onClick={() => {
              navigate('/');
            }}
          >
            Cancel
          </button>
          <button type='submit' className={styles.submitButton}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
