import { Outlet } from 'react-router-dom';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import { formatDate } from '../../utils/helpers';
import { useState } from 'react';

import ArrowDown from '../../assets/icons/arrowDown.svg';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Week');

  const name = localStorage.getItem('name');
  const today = new Date().toLocaleDateString();

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    setShowOptions(false); // Close dropdown after selection
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

  const handleOptionsToggle = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.infoContainer} ${styles.firstContainer}`}>
        <p className={styles.userName}>Welcome! {name}</p>
        <p className={styles.todaysDate}>{formatDate(today)}</p>
      </div>
      <div className={styles.infoContainer}>
        <p className={styles.boardText}>Board</p>

        <div className={styles.dropDownBtnContainer}>
          <button
            onClick={handleOptionsToggle}
            className={styles.transparentButton}
          >
            {selectedTimeframe + ' '}
            <img src={ArrowDown} alt='Arrow' />
          </button>
          {showOptions && (
            <div className={styles.optionsDropdown}>
              <button
                className={styles.optionsDropdownButton}
                onClick={() => handleTimeframeChange('Today')}
              >
                Today
              </button>
              <button
                className={styles.optionsDropdownButton}
                onClick={() => handleTimeframeChange('This Week')}
              >
                This Week
              </button>
              <button
                className={styles.optionsDropdownButton}
                onClick={() => handleTimeframeChange('This Month')}
              >
                This Month
              </button>
            </div>
          )}
        </div>
      </div>
      <KanbanBoard startDate={startDate} />

      <Outlet />
    </div>
  );
}
