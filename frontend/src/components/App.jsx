import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { createContext, useState } from 'react';
import ErrorPage from './ErrorPage.jsx';
import LoginPage from './LoginPage.jsx';
import Layout from './Layout.jsx';
import ChatPage from './ChatPage.jsx';

export const AppContext = createContext({});

const App = () => {
  const lsItem = JSON.parse(localStorage.getItem('user'));
  const [loggedIn, setLoggedIn] = useState(lsItem);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  return (
    <AppContext.Provider value={{ loggedIn, logOut, logIn, setLoggedIn }}>
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
      </BrowserRouter>
    </AppContext.Provider>
  );
};
export default App;
