import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import Login from './components/Login';
import AuthLayout from './AuthLayout';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AuthLayout/>}>
          <Route path='/' element={<Home/>}/>
        </Route>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </AuthProvider>
  );
}

export default App;
