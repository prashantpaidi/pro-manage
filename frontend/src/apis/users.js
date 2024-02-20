import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const register = async (userData) => {
  console.log('userData', userData);
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (userData) => {
  console.log('userData', userData);
  try {
    const response = await axios.post(`${API_URL}/users/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
