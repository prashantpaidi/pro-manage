import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import logo from '../../assets/icons/logo.svg';
import boardIcon from '../../assets/icons/board.svg';
import analyticsIcon from '../../assets/icons/analytics.svg';
import settingsIcon from '../../assets/icons/settings.svg';
import logoutIcon from '../../assets/icons/logout.svg';

import style from './Layout.module.css';
export default function Layout() {
  let location = useLocation();

  console.log('location.pathname', location.pathname);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('token') !== null
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/auth/login');
  };

  return (
    <div className={style.mainContainer}>
      <div className={style.sideBar}>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <div className={style.logo}>
            <img src={logo} />
            Pro Manage
          </div>
        </Link>
        <div className={style.modesContainer}>
          <Link
            to='/'
            className={`${style.activeBtn} ${
              location.pathname === '/' ? style.activeScreen : ''
            }`}
          >
            <img src={boardIcon} />
            Board
          </Link>
          <Link
            to='/analytics'
            className={`${style.activeBtn} ${
              location.pathname.includes('/analytics') ? style.activeScreen : ''
            }`}
          >
            <img src={analyticsIcon} />
            Analytics
          </Link>
          <Link
            to='/add-quiz'
            className={`${style.activeBtn} ${
              location.pathname === '/create-quiz' ? style.activeScreen : ''
            }`}
          >
            <img src={settingsIcon} />
            Settings
          </Link>
        </div>
        <button
          className={style.logoutBtn}
          style={{ marginTop: '10px' }}
          onClick={isLoggedIn ? handleLogout : () => navigate('/')}
        >
          <img src={logoutIcon} alt='' />
          {isLoggedIn ? 'Log out' : 'LOG IN'}
        </button>
      </div>
      <Outlet />
    </div>
  );
}
