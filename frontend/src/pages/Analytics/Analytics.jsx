import { useEffect, useState } from 'react';
import { isLogin } from '../../utils/helpers';
import { fetchAnalyticsData } from '../../apis/tasks';
import BlueDot from '../../assets/icons/blueDot.svg';

import styles from './Analytics.module.css';
export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const loggedInUser = isLogin();
      if (loggedInUser) {
        const tasksData = await fetchAnalyticsData(
          loggedInUser.id,
          loggedInUser.token
        );
        setAnalyticsData(tasksData);
      } else {
        navigator('/auth/login');
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Analytics</div>
      {analyticsData && (
        <div className={styles.cardContainer}>
          {/* Card for task type breakdown */}
          <div className={styles.card}>
            <div className={styles.taskGroup}>
              <img src={BlueDot} />
              <h4>Backlog Tasks</h4>
              <p className={styles.taskCount}>{analyticsData.backlogTasks}</p>
            </div>
            <div className={styles.taskGroup}>
              <img src={BlueDot} />

              <h4>To-do Tasks</h4>
              <p className={styles.taskCount}>{analyticsData.todoTasks}</p>
            </div>
            <div className={styles.taskGroup}>
              <img src={BlueDot} />
              <h4>In-Progress Tasks</h4>
              <p className={styles.taskCount}>
                {analyticsData.inProgressTasks}
              </p>
            </div>
            <div className={styles.taskGroup}>
              <img src={BlueDot} />
              <h4>Completed Tasks</h4>
              <p className={styles.taskCount}>{analyticsData.completedTasks}</p>
            </div>
          </div>

          {/* Card for priority breakdown */}
          <div className={styles.card}>
            <div className={styles.taskGroup}>
              <img src={BlueDot} />
              <h4>High Priority</h4>
              <p className={styles.taskCount}>
                {analyticsData.highPriorityTasks}
              </p>
            </div>
            <div className={styles.taskGroup}>
              <img src={BlueDot} />
              <h4>Moderate Priority</h4>
              <p className={styles.taskCount}>
                {analyticsData.moderatePriorityTasks}
              </p>
            </div>
            <div className={styles.taskGroup}>
              <img src={BlueDot} />
              <h4>Low Priority</h4>
              <p className={styles.taskCount}>
                {analyticsData.lowPriorityTasks}
              </p>
            </div>

            <div className={styles.taskGroup}>
              <img src={BlueDot} />
              <h4>Due Date Tasks</h4>
              <p className={styles.taskCount}>{analyticsData.dueDateTasks}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
