import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/auth' element={<Auth />}>
            <Route path='/auth/register' element={<RegisterForm />} />
            <Route path='/auth/login' element={<LoginForm />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
