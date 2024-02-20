import styles from './Auth.module.css';
// impor the image
import astronautImage from '../../assets/astronaut.png';

import { Outlet } from 'react-router-dom';

const Auth = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src={astronautImage}
          alt='Astronaut sitting on a laptop'
          className={styles.astronautImage}
        />
        <h1 className={styles.title}>Welcome aboard my friend </h1>
        <p className={styles.subtitle}>just a couple of clicks and we start</p>
      </div>
      <Outlet />
    </div>
  );
};

export default Auth;
