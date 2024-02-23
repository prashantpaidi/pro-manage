import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Layout from './pages/Home/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import TaskForm from './components/Task/TaskForm';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/auth' element={<Auth />}>
            <Route path='/auth/register' element={<RegisterForm />} />
            <Route path='/auth/login' element={<LoginForm />} />
          </Route>
          <Route path='/' element={<Layout />}>
            <Route path='/' element={<Dashboard />}>
              <Route path='/add-task' element={<TaskForm />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
