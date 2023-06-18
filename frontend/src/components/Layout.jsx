import { useContext } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AppContext } from './App.jsx';
import { useTranslation } from 'react-i18next';

const Layout = ({ children }) => {
  const { loggedIn, logOut } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <div className='d-flex flex-column h-100'>
      <Navbar bg='white' expand='lg' className='shadow-sm'>
        <Container>
          <Link to='/' className='navbar-brand'>
            Hexlet Chat
          </Link>
          {loggedIn && <Button onClick={logOut}>{t('logOut')}</Button>}
        </Container>
      </Navbar>
      {children}
    </div>
  );
};

export default Layout;
