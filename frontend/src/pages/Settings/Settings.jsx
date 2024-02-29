import { useState } from 'react';
import styles from './Settings.module.css';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import passwordIcon from '../../assets/icons/passwordIcon.svg';
import toast from 'react-hot-toast';
import { updateNamePassword } from '../../apis/users';

export default function Settings() {
  const [isOldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);

  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  // console.log('token', token);
  const [formData, setFormData] = useState({
    name: localStorage.getItem('name'),

    oldPassword: '',
    newPassword: '',
  });

  const toggleOldPasswordVisibility = () => {
    setOldPasswordVisible(!isOldPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!isNewPasswordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword.length < 8) {
      toast.error('New Password must be at least 8 characters long');
      return;
    }
    if (formData.name === '') {
      toast.error('Name is required');
      return;
    }
    if (formData.oldPassword === '') {
      toast.error('Old Password is required');
      return;
    }
    if (formData.newPassword === '') {
      toast.error('New Password is required');
      return;
    }
    if (formData.oldPassword === formData.newPassword) {
      toast.error('Old and New Password cannot be same');
      return;
    }

    try {
      // call the API to update the user updateNamePassword
      await updateNamePassword(id, token, formData);

      console.log(formData);
      toast.success('Form submitted successfully');
    } catch (error) {
      console.log('error', error);
      toast.error('Error updating user');
    }
  };

  return (
    <div>
      <h1 className={styles.heading}>Settings</h1>
      <form className={styles.settingsForm} onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          required
          placeholder='Name'
          className={`${styles.nameInput}`}
          onChange={handleChange}
          value={formData.name}
        />
        <br />
        <div className={`${styles.passwordContainer}`}>
          <img src={passwordIcon} alt='lock' />
          <input
            type={isOldPasswordVisible ? 'text' : 'password'}
            id='oldPassword'
            name='oldPassword'
            required
            placeholder='Old Password'
            onChange={handleChange}
            className={styles.passwordInput}
            value={formData.oldPassword}
          />
          {isOldPasswordVisible ? (
            <BsEyeSlash
              style={{ fontSize: '35px' }}
              onClick={toggleOldPasswordVisibility}
            />
          ) : (
            <BsEye
              style={{ fontSize: '35px' }}
              onClick={toggleOldPasswordVisibility}
            />
          )}
        </div>

        <div className={`${styles.passwordContainer}`}>
          <img src={passwordIcon} alt='lock' />
          <input
            type={isNewPasswordVisible ? 'text' : 'password'}
            id='newPassword'
            name='newPassword'
            required
            placeholder='New Password'
            className={styles.passwordInput}
            onChange={handleChange}
            value={formData.newPassword}
          />
          {isNewPasswordVisible ? (
            <BsEyeSlash
              style={{ fontSize: '35px' }}
              onClick={toggleNewPasswordVisibility}
            />
          ) : (
            <BsEye
              style={{ fontSize: '35px' }}
              onClick={toggleNewPasswordVisibility}
            />
          )}
        </div>

        <button type='submit' className={styles.submitButton}>
          Update
        </button>
      </form>
    </div>
  );
}
