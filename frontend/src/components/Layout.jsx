import { useContext } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AppContext } from './App';

const Layout = ({ children }) => {
  const { loggedIn, logOut } = useContext(AppContext);

  return (
    <div className='d-flex flex-column h-100'>
      <Navbar bg='white' expand='lg' className='shadow-sm'>
        <Container>
          <Link to='/' className='navbar-brand'>
            Hexlet Chat
          </Link>
          {loggedIn && <Button onClick={logOut}>Выйти</Button>}
        </Container>
      </Navbar>
      {children}
    </div>
  );
};

export default Layout;
