import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { isLogin } from '../../utils/helpers';
import CardList from './CardList';
import styles from './KanbanBoard.module.css';
import { listofTypes } from '../../utils/constants';
import { fetchTasksAsync } from '../../store/slices/tasksSlice';

export default function KanbanBoard({ startDate }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch tasks when the component mounts
  useEffect(() => {
    const loggedInUser = isLogin();
    if (loggedInUser) {
      dispatch(fetchTasksAsync({
        userId: loggedInUser.id,
        token: loggedInUser.token,
        startDate
      }));
    } else {
      navigate('/auth/login');
    }
  }, [startDate, dispatch, navigate]);

  return (
    <div className={styles.kanbanBoard}>
      {/* loop  */}
      {listofTypes.map((type) => (
        <CardList key={type} type={type} />
      ))}
    </div>
  );
}

KanbanBoard.propTypes = {
  startDate: PropTypes.instanceOf(Date).isRequired,
};
