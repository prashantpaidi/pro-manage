import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

let token;
const createTask = async (taskData, token) => {
  try {
    console.log('API_BASE_URL:', API_BASE_URL);
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
      headers: {
        authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Function to update an existing task
const updateTask = async (taskId, updatedTaskData) => {
  console.log('taskId', taskId);
  token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  try {
    const response = await axios.put(
      `${API_BASE_URL}/tasks/${taskId}`,
      updatedTaskData,
      {
        headers: {
          authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    throw error;
  }
};

// Function to delete a task
const deleteTask = async (taskId, token) => {
  console.log('taskId', taskId);
  token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
      headers: {
        authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};

// Function to get all tasks
const getAllTasks = async (id, token, startDate) => {
  console.log('startDate', startDate);
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/user/${id}`, {
      headers: {
        authorization: `${token}`,
      },
      params: {
        startDate: startDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting all tasks:', error);
    throw error;
  }
};

export { createTask, updateTask, deleteTask, getAllTasks };
