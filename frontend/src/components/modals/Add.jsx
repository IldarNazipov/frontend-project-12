import { useRef, useContext, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { actions as channelsActions } from '../../slices/channelsSlice.js';
import { socket } from '../../index.js';
import { ChatContext } from '../ChatPage.jsx';

const Add = ({ onHide }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setMessagesCount } = useContext(ChatContext);
  const channels = useSelector((state) => state.channelsInfo.channels);
  const channelNames = channels.map((item) => item.name);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const addSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .min(3, t('errors.minMax'))
      .max(20, t('errors.minMax'))
      .required(t('errors.required'))
      .notOneOf(channelNames, t('errors.unique')),
  });

  const notifyError = () => {
    toast.error(t('errors.connection'));
  };
  const notifySuccess = () => {
    toast.success(t('channelAdded'));
  };

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={addSchema}
          onSubmit={(values, { setSubmitting }) => {
            socket
              .timeout(5000)
              .emit('newChannel', { name: values.name }, (err, response) => {
                if (response?.status === 'ok') {
                  setSubmitting(false);
                  setMessagesCount(0);
                  dispatch(
                    channelsActions.setCurrentChannelId(response.data.id),
                  );
                  notifySuccess();
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
                    disabled={isSubmitting}
                    name="name"
                    id="name"
                    className={`form-control mb-2${
                      errors.name ? ' is-invalid' : ''
                    }`}
                  />
                  <Form.Label className="visually-hidden" htmlFor="name">
                    {t('chatPage.channelName')}
                  </Form.Label>
                  <ErrorMessage
                    component="div"
                    name="name"
                    className="invalid-feedback"
                  />
                  <div className="d-flex justify-content-end">
                    <Button
                      onClick={onHide}
                      type="button"
                      variant="secondary"
                      className="me-2"
                    >
                      {t('chatPage.cancel')}
                    </Button>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      variant="primary"
                    >
                      {t('chatPage.send')}
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
