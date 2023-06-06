import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const Layout = ({ children }) => {
  return (
    <div className='d-flex flex-column h-100'>
      <Navbar bg='white' expand='lg' className='shadow-sm'>
        <Container>
          <Navbar.Brand href='/'>Hexlet Chat</Navbar.Brand>
        </Container>
      </Navbar>
      {children}
    </div>
  );
};

export default Layout;
