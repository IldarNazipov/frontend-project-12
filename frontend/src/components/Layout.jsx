import { useContext } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { AppContext } from './App';

const Layout = ({ children }) => {
  const { loggedIn, logOut } = useContext(AppContext);

  return (
    <div className='d-flex flex-column h-100'>
      <Navbar bg='white' expand='lg' className='shadow-sm'>
        <Container>
          <Navbar.Brand href='/'>Hexlet Chat</Navbar.Brand>
          {loggedIn && <Button onClick={logOut}>Выйти</Button>}
        </Container>
      </Navbar>
      {children}
    </div>
  );
};

export default Layout;
