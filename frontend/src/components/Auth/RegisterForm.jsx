import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { BsEyeSlash, BsEye } from 'react-icons/bs';
import passwordIcon from '../../assets/icons/passwordIcon.svg';
import { register } from '../../apis/users';

import styles from './RegisterForm.module.css';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      errors.name = 'Name is required';
    }
    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Invalid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      // minimum password length is 8
      errors.password = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const response = await register(formData);
      console.log(response);
      if (response) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('name', response.name);
        navigate('/auth/login');
      }
    } catch (error) {
      console.error(error);
      // Handle server-side errors
      if (error.error === 'email') {
        setErrors({ email: error.message });
      } else {
        setErrors({ server: 'Internal Server Error' });
      }
    }
  };

  return (
    <div className={styles.registerForm}>
      <h1 className={styles.registerTitle}>Register</h1>
      <input
        type='text'
        name='name'
        required
        placeholder='Name'
        className={`${styles.nameInput} ${
          errors?.name ? styles.errorInput : ''
        }`}
        onChange={handleChange}
      />
      {errors.name && <p className={styles.errorText}>{errors.name}</p>}
      <input
        type='email'
        name='email'
        required
        placeholder='Email'
        className={`${styles.emailInput} ${
          errors?.email ? styles.errorInput : ''
        }`}
        onChange={handleChange}
      />
      {errors.email && <p className={styles.errorText}>{errors.email}</p>}

      <div
        className={`${styles.passwordContainer} ${
          errors?.password ? styles.errorInput : ''
        }`}
      >
        <img src={passwordIcon} alt='lock' />
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          id='password'
          name='password'
          required
          placeholder='Password'
          onChange={handleChange}
          className={styles.passwordInput}
        />
        {isPasswordVisible ? (
          <BsEyeSlash
            style={{ fontSize: '35px' }}
            onClick={() => togglePasswordVisibility()}
          />
        ) : (
          <BsEye
            style={{ fontSize: '35px' }}
            onClick={() => togglePasswordVisibility()}
          />
        )}
      </div>
      {errors.password && <p className={styles.errorText}>{errors.password}</p>}

      <div
        className={`${styles.passwordContainer} ${
          errors?.confirmPassword ? styles.errorInput : ''
        }`}
      >
        <img src={passwordIcon} alt='lock' />
        <input
          type={isConfirmPasswordVisible ? 'text' : 'password'}
          id='confirmPassword '
          name='confirmPassword'
          required
          placeholder='Confirm Password'
          className={styles.passwordInput}
          onChange={handleChange}
        />
        {isConfirmPasswordVisible ? (
          <BsEyeSlash
            style={{ fontSize: '35px' }}
            onClick={() => toggleConfirmPasswordVisibility()}
          />
        ) : (
          <BsEye
            style={{ fontSize: '35px' }}
            onClick={() => toggleConfirmPasswordVisibility()}
          />
        )}
      </div>
      {errors.confirmPassword && (
        <p className={styles.errorText}>{errors.confirmPassword}</p>
      )}

      {errors.server && <p className={styles.errorText}>{errors.server}</p>}
      <button
        type='submit'
        onClick={handleSubmit}
        className={styles.registerSubmit}
      >
        Register
      </button>
      <p className={styles.registerText}>Already have an account? </p>
      <Link to='/auth/login' className={styles.loginLink}>
        Log in
      </Link>
    </div>
  );
}
