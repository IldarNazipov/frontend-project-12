import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { createContext, useState } from 'react';
import ErrorPage from './ErrorPage.jsx';
import LoginPage from './LoginPage.jsx';
import Layout from './Layout.jsx';
import ChatPage from './ChatPage.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const checkAuth = () => {
  const lsItem = JSON.parse(localStorage.getItem('user'));
  if (lsItem && lsItem.token) {
    return true;
  }
  return false;
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(checkAuth);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  return (
    <AppContext.Provider value={{ loggedIn, logOut, logIn }}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='*' element={<ErrorPage />} />
            <Route
              path='/'
              element={loggedIn ? <ChatPage /> : <Navigate to='/login' />}
            />
          </Routes>
        </Layout>
        <ToastContainer />
      </BrowserRouter>
    </AppContext.Provider>
  );
};
export const AppContext = createContext({});
export default App;
