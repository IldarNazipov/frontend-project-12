import { useContext, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import { I18nContext } from 'react-i18next';
import * as yup from 'yup';
import { socket } from '../../socket.js';
import { toast } from 'react-toastify';

const Add = ({ modalInfo, onHide }) => {
  const { i18n } = useContext(I18nContext);
  const inputRef = useRef(null);
  const { items } = modalInfo;
  const channelNames = items.map((item) => item.name);

  const addSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .min(3, i18n.t('errors.minMax'))
      .max(20, i18n.t('errors.minMax'))
      .required(i18n.t('errors.required'))
      .notOneOf(channelNames, i18n.t('errors.unique')),
  });

  const notifyError = () => {
    toast.error(i18n.t('errors.connection'));
  };
  const notifySuccess = () => {
    toast.success(i18n.t('channelAdded'));
  };

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{i18n.t('chatPage.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={addSchema}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            socket
              .timeout(3000)
              .emit('newChannel', { name: values.name }, (err, response) => {
                if (response?.status === 'ok') {
                  console.log(channelNames);
                  setSubmitting(false);
                  notifySuccess();
                  resetForm({ body: '' });
                  onHide();
                } else {
                  setSubmitting(false);
                  setTimeout(() => {
                    inputRef.current.select();
                  }, 0);
                  notifyError();
                  console.error(err);
                }
              });
          }}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(props) => {
            const { errors, isSubmitting, handleSubmit } = props;
            return (
              <Form onSubmit={handleSubmit}>
                <div>
                  <Field
                    innerRef={(f) => (inputRef.current = f)}
                    autoFocus
                    disabled={isSubmitting}
                    name='name'
                    id='name'
                    className={`form-control mb-2${
                      errors.name ? ' is-invalid' : ''
                    }`}
                  />
                  <Form.Label className='visually-hidden' htmlFor='name'>
                    {i18n.t('chatPage.channelName')}
                  </Form.Label>
                  <ErrorMessage
                    component='div'
                    name='name'
                    className='invalid-feedback'
                  />
                  <div className='d-flex justify-content-end'>
                    <Button
                      onClick={onHide}
                      type='button'
                      variant='secondary'
                      className='me-2'
                    >
                      {i18n.t('chatPage.cancel')}
                    </Button>
                    <Button
                      disabled={isSubmitting}
                      type='submit'
                      variant='primary'
                    >
                      {i18n.t('chatPage.send')}
                    </Button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
