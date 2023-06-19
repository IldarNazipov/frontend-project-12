import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import { SocketContext } from '../../contexts/index.js';

const Rename = ({ modalInfo, onHide }) => {
  const { t } = useTranslation();
  const { renameChannel } = useContext(SocketContext);
  const channels = useSelector((state) => state.channelsInfo.channels);
  const channelNames = channels.map((item) => item.name);
  const { item } = modalInfo;
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.select();
  }, []);

  const renameSchema = yup.object().shape({
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
    toast.success(t('channelRenamed'));
  };

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: item.name }}
          validationSchema={renameSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await renameChannel(item.id, values.name);
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
                    autoFocus
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

export default Rename;
