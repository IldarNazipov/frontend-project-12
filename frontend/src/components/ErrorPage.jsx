import Image from 'react-bootstrap/Image';
import ErrorImg from '../assets/error.svg';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className='text-center'>
      <Image alt='Страница не найдена' fluid className='h-25' src={ErrorImg} />
      <h1 className='h4 text-muted'>Страница не найдена</h1>
      <p className='text-muted'>
        Но вы можете перейти <Link to='/'>на главную страницу</Link>
      </p>
    </div>
  );
};

export default ErrorPage;
