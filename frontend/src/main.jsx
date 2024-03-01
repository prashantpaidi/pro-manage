import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { TaskProvider } from './context/taskContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TaskProvider>
      <App />
    </TaskProvider>
    <Toaster position='top-right' reverseOrder={false} />
  </React.StrictMode>
);
