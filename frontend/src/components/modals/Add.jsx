import { useRef, useContext, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { actions as channelsActions } from '../../slices/channelsSlice.js';
import { ChatContext, SocketContext } from '../../contexts/index.js';

const Add = ({ onHide }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setMessagesCount } = useContext(ChatContext);
  const { addChannel } = useContext(SocketContext);
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
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await addChannel(values.name);
              dispatch(channelsActions.setCurrentChannelId(response.data.id));
              setMessagesCount(0);
              notifySuccess();
              onHide();
            } catch {
              notifyError();
            }
            setSubmitting(false);
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
                    innerRef={(f) => { inputRef.current = f; }}
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
