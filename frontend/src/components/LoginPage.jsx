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
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useContext } from 'react';
import axios from 'axios';
import routes from '../routes.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './App.jsx';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { logIn } = useContext(AppContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const loginSchema = yup.object().shape({
    username: yup.string().trim().required(t('errors.required')),
    password: yup.string().trim().required(t('errors.required')),
  });

  const notifyConnectionError = () => {
    toast.error(t('errors.connection'));
  };

  const notifyServerError = () => {
    toast.error(t('errors.server'));
  };

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
                <Image roundedCircle src={Img} alt={t('loginPage.logIn')} />
              </Col>
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={loginSchema}
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
                    if (error.message === 'Network Error') {
                      notifyConnectionError();
                      return;
                    }
                    if (error.isAxiosError && error.response.status === 401) {
                      setErrors({
                        username: '',
                        password: t('errors.invalid'),
                      });
                      return;
                    }
                    if (error.isAxiosError && error.response.status === 500) {
                      notifyServerError();
                    }
                    throw error;
                  }
                }}
              >
                {(props) => {
                  const { touched, errors, isSubmitting, handleSubmit } = props;
                  return (
                    <Form
                      onSubmit={handleSubmit}
                      className='col-12 col-md-6 mt-3 mt-mb-0'
                    >
                      <h1 className='text-center mb-4'>
                        {t('loginPage.logIn')}
                      </h1>
                      <FloatingLabel
                        controlId='username'
                        label={t('loginPage.usernameInput')}
                        className='mb-3'
                      >
                        <Field
                          autoFocus
                          name='username'
                          id='username'
                          placeholder={t('loginPage.usernameInput')}
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
                        label={t('loginPage.passwordInput')}
                        className='mb-4'
                      >
                        <Field
                          type='password'
                          name='password'
                          id='password'
                          placeholder={t('loginPage.passwordInput')}
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
                        disabled={isSubmitting}
                        variant='outline-primary'
                        type='submit'
                        className='w-100 mb-3'
                      >
                        {t('loginPage.logIn')}
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </Card.Body>
            <Card.Footer className='p-4'>
              <div className='text-center'>
                <span>{t('loginPage.noAccount')} </span>
                <a href='/signup'>{t('signupPage.signUp')}</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
