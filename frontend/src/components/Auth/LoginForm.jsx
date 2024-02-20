import { BsEye, BsEyeSlash } from 'react-icons/bs';
import passwordIcon from '../../assets/icons/passwordIcon.svg';

import { useState } from 'react';
import { login } from '../../apis/users';
import { useNavigate, Link } from 'react-router-dom';

import styles from './LoginForm.module.css';

export default function LoginForm() {
  const navigate = useNavigate();

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Invalid email address';
      }

      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        // minimum password length is 8
        errors.password = 'Password must be at least 8 characters long';
      }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(1);
    if (!validateForm()) {
      return;
    }

    try {
      const response = await login(formData);
      console.log(response);
      if (response) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userName', response.name);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    }
  };

  return (
    <div className={styles.loginForm}>
      <h1 className={styles.loginTitle}>Login</h1>
      <input
        type='email'
        id='email'
        name='email'
        required
        placeholder='Email'
        className={`${styles.emailInput} ${
          errors?.email ? styles.errorInput : ''
        }`}
        onChange={handleChange}
      />
      {errors?.email && (
        <span className={styles.errorText}>{errors.email}</span>
      )}
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
          className={`${styles.passwordInput}`}
          onChange={handleChange}
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
      {errors.password && (
        <span className={styles.errorText}>{errors.password}</span>
      )}
      <button type='submit' onClick={handleSubmit}>
        Log in
      </button>
      <p className={styles.registerText}>Have no account yet? </p>
      <Link to='/auth/register' className={styles.registerLink}>
        Register
      </Link>
    </div>
  );
}
