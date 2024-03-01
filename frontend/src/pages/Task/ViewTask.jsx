import logo from '../../assets/icons/logo.svg';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTask } from '../../apis/tasks';
import Priority from '../../components/UI/Priority';
import { formatDateMonD } from '../../utils/helpers';

import styles from './ViewTask.module.css';

export default function ViewTask() {
  const { taskId } = useParams();
  const [error, setError] = useState(null);

  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    setLoading(true);
    try {
      // Fetch task from the API
      const taskData = await getTask(taskId);
      setTask(taskData);
      setLoading(false);
    } catch (error) {
      setError('An error occurred while fetching the task.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  if (error) {
    return <p>Task not Found</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={logo} />
        Pro Manage
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p className={styles.priority}>
              <Priority priority={task.priority} />
            </p>
            <h2 className={styles.title}>{task.title}</h2>
            <p className={styles.checklistText}>
              Checklist:{' '}
              {'(' + task.checklist.filter((item) => item.done).length}/
              {task.checklist.length + ')'}
            </p>
            <div className={styles.checklistContainer}>
              {task.checklist.map((item, index) => (
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

            {task.due_date && (
              <div className={styles.dueDateContainer}>
                <span className={styles.dueDateText}>Due Date: </span>
                <span className={styles.dueDate}>
                  {formatDateMonD(task.due_date)}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
