import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {}, []);
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <p className={styles.userName}>Welcome! Kumar</p>
        <p className={styles.userName}>12th Jan, 2024</p>
      </div>
      <div className={styles.infoContainer}>
        <p className={styles.userName}>Board</p>
        <p className={styles.userName}>This weeks</p>
      </div>
      <div className='board'></div>
      <Outlet />
    </div>
  );
}
