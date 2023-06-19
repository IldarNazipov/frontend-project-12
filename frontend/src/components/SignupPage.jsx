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
import { Formik, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import { AppContext } from './App.jsx';
import Img from '../assets/avatar_1.jpg';

const SignupPage = () => {
  const { logIn } = useContext(AppContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const signupSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required(t('errors.required'))
      .min(3, t('errors.minMax'))
      .max(20, t('errors.minMax')),
    password: yup
      .string()
      .required(t('errors.required'))
      .min(6, t('errors.lessThanSix')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], t('errors.mustMatch')),
  });

  const notifyConnectionError = () => {
    toast.error(t('errors.connection'));
  };

  const notifyServerError = () => {
    toast.error(t('errors.server'));
  };

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <Image roundedCircle src={Img} alt={t('signupPage.signUp')} />
              </div>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  passwordConfirmation: '',
                }}
                validationSchema={signupSchema}
                onSubmit={async (values, { setErrors }) => {
                  try {
                    const response = await axios.post(routes.signupPath(), {
                      username: values.username,
                      password: values.password,
                    });
                    const data = JSON.stringify(response.data);
                    localStorage.setItem('user', data);
                    logIn();
                    navigate('/');
                  } catch (error) {
                    if (error.message === 'Network Error') {
                      notifyConnectionError();
                      return;
                    }
                    if (error.isAxiosError && error.response.status === 409) {
                      setErrors({
                        username: '',
                        password: '',
                        confirmPassword: t('errors.alreadyExists'),
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
                  const {
                    touched, errors, isSubmitting, handleSubmit,
                  } = props;
                  return (
                    <Form onSubmit={handleSubmit} className="w-50">
                      <h1 className="text-center mb-4">
                        {t('signupPage.signUp')}
                      </h1>
                      <FloatingLabel
                        controlId="username"
                        label={t('signupPage.usernameInput')}
                        className="mb-3"
                      >
                        <Field
                          autoFocus
                          name="username"
                          id="username"
                          placeholder={t('signupPage.usernameInput')}
                          className={`form-control ${
                            (touched.username && errors.username)
                            || errors.username === ''
                              ? 'is-invalid'
                              : ''
                          }`}
                        />
                        <ErrorMessage
                          component="div"
                          name="username"
                          className="invalid-tooltip"
                        />
                      </FloatingLabel>
                      <FloatingLabel
                        controlId="password"
                        label={t('signupPage.passwordInput')}
                        className="mb-3"
                      >
                        <Field
                          type="password"
                          name="password"
                          id="password"
                          placeholder={t('signupPage.passwordInput')}
                          className={`form-control ${
                            (touched.password && errors.password)
                            || errors.password === ''
                              ? 'is-invalid'
                              : ''
                          }`}
                        />
                        <ErrorMessage
                          component="div"
                          name="password"
                          className="invalid-tooltip"
                        />
                      </FloatingLabel>
                      <FloatingLabel
                        controlId="confirmPassword"
                        label={t('signupPage.passwordConfirmationInput')}
                        className="mb-4"
                      >
                        <Field
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          placeholder={t(
                            'signupPage.passwordConfirmationInput',
                          )}
                          className={`form-control ${
                            touched.password && errors.confirmPassword
                              ? 'is-invalid'
                              : ''
                          }`}
                        />
                        <ErrorMessage
                          component="div"
                          name="confirmPassword"
                          className="invalid-tooltip"
                        />
                      </FloatingLabel>
                      <Button
                        disabled={isSubmitting}
                        variant="outline-primary"
                        type="submit"
                        className="w-100 mb-3"
                      >
                        {t('signupPage.signUpButton')}
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
