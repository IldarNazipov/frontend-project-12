import { Route, Routes } from 'react-router-dom';
import ErrorPage from './ErrorPage.jsx';
import LoginPage from './LoginPage.jsx';
import Layout from './Layout.jsx';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
