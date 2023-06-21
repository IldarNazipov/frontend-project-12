import {
  Route, Routes, BrowserRouter, Navigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import ErrorPage from './ErrorPage.jsx';
import LoginPage from './LoginPage.jsx';
import Layout from './Layout.jsx';
import 'react-toastify/dist/ReactToastify.css';
import SignupPage from './SignupPage.jsx';
import { AuthContext } from '../contexts/index.js';
import ChatPage from './ChatPage.jsx';

const checkAuth = () => {
  const lsItem = JSON.parse(localStorage.getItem('user'));
  if (lsItem && lsItem.token) {
    return true;
  }
  return false;
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(checkAuth);
  const [authorizedUser, setAuthorizedUser] = useState('');

  useEffect(() => {
    if (loggedIn) {
      setAuthorizedUser(JSON.parse(localStorage.getItem('user')).username);
    }
  }, [loggedIn]);

  const logIn = (data) => {
    localStorage.setItem('user', data);
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{
      loggedIn, logOut, logIn, authorizedUser,
    }}
    >
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<ErrorPage />} />
            <Route
              path="/"
              element={loggedIn ? <ChatPage /> : <Navigate to="/login" />}
            />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </Layout>
        <ToastContainer />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
