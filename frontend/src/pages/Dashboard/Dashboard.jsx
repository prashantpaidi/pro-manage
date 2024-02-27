import { Outlet } from 'react-router-dom';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import { formatDate } from '../../utils/helpers';
import { useState } from 'react';

import styles from './Dashboard.module.css';

export default function Dashboard() {
  const name = localStorage.getItem('name');
  const today = new Date().toLocaleDateString();
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Week');

  const handleTimeframeChange = (e) => {
    setSelectedTimeframe(e.target.value);
  };

  let startDate;
  if (selectedTimeframe === 'This Week') {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
  } else if (selectedTimeframe === 'This Month') {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
  } else {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
  }

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <p className={styles.userName}>Welcome! {name}</p>
        <p className={styles.userName}>{formatDate(today)}</p>
      </div>
      <div className={styles.infoContainer}>
        <p className={styles.userName}>Board</p>
        <select
          className={styles.dropdown}
          value={selectedTimeframe}
          onChange={handleTimeframeChange}
        >
          <option value='Today'>Today</option>
          <option value='This Week'>This Week</option>
          <option value='This Month'>This Month</option>
        </select>
      </div>
      <KanbanBoard startDate={startDate} />

      <Outlet />
    </div>
  );
}
