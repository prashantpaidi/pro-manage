import styles from './ViewTask.module.css';
import logo from '../../assets/icons/logo.svg';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTask } from '../../apis/tasks';
import Priority from '../../components/UI/Priority';

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
    <div>
      <div className={styles.logo}>
        <img src={logo} />
        Pro Manage
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2>{task.title}</h2>
            <p>
              <Priority priority={task.priority} />
            </p>
            <p>Checklist:</p>
            <ul>
              {task.checklist.map((item, index) => (
                <li key={index} className={item.done ? styles.checked : ''}>
                  {item.text}
                </li>
              ))}
            </ul>
            {task.due_date && <p>Due Date: {task.due_date}</p>}
          </>
        )}
      </div>
    </div>
  );
}
