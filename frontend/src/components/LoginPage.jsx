import {
  Container,
  Row,
  Col,
  Card,
  Image,
  FloatingLabel,
  Form,
  Button,
} from 'react-bootstrap';
import Img from '../assets/avatar.jpg';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import routes from '../routes.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './App';

const LoginPage = () => {
  const { logIn } = useContext(AppContext);
  const navigate = useNavigate();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Не может быть пустым'),
    password: Yup.string().required('Не может быть пустым'),
  });

  return (
    <Container fluid className='h-100'>
      <Row className='justify-content-center align-content-center h-100'>
        <Col xs={12} md={8} xxl={6}>
          <Card className='shadow-sm'>
            <Card.Body className='row p-5'>
              <Col
                xs={12}
                md={6}
                className='d-flex align-items-center justify-content-center'
              >
                <Image roundedCircle src={Img} alt='Войти' />
              </Col>
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setErrors }) => {
                  try {
                    const response = await axios.post(
                      routes.loginPath(),
                      values
                    );
                    const data = JSON.stringify(response.data);
                    localStorage.setItem('user', data);
                    logIn();
                    navigate('/');
                  } catch (error) {
                    if (error.isAxiosError && error.response.status === 401) {
                      setErrors({
                        username: '',
                        password: 'Неверные имя пользователя или пароль',
                      });
                      inputRef.current.select();
                      return;
                    }
                    throw error;
                  }
                }}
              >
                {(props) => {
                  const { touched, errors, handleSubmit } = props;
                  return (
                    <Form
                      onSubmit={handleSubmit}
                      className='col-12 col-md-6 mt-3 mt-mb-0'
                    >
                      <h1 className='text-center mb-4'>Войти</h1>
                      <FloatingLabel
                        controlId='username'
                        label='Ваш ник'
                        className='mb-3'
                      >
                        <Field
                          innerRef={(f) => (inputRef.current = f)}
                          name='username'
                          id='username'
                          placeholder='Ваш ник'
                          className={`form-control ${
                            (touched.username && errors.username) ||
                            errors.username === ''
                              ? 'is-invalid'
                              : ''
                          }`}
                        />
                        <ErrorMessage
                          component='div'
                          name='username'
                          className='invalid-tooltip'
                        />
                      </FloatingLabel>
                      <FloatingLabel
                        controlId='password'
                        label='Пароль'
                        className='mb-4'
                      >
                        <Field
                          type='password'
                          name='password'
                          id='password'
                          placeholder='Пароль'
                          className={`form-control ${
                            touched.password && errors.password
                              ? 'is-invalid'
                              : ''
                          }`}
                        />
                        <ErrorMessage
                          component='div'
                          name='password'
                          className='invalid-tooltip'
                        />
                      </FloatingLabel>
                      <Button
                        variant='outline-primary'
                        type='submit'
                        className='w-100 mb-3'
                      >
                        Войти
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </Card.Body>
            <Card.Footer className='p-4'>
              <div className='text-center'>
                <span>Нет аккаунта? </span>
                <a href='/signup'>Регистрация</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
