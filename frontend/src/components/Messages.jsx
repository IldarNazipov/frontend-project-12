/* eslint-disable react/jsx-one-expression-per-line */
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { animateScroll } from 'react-scroll';
import {
  Button, InputGroup, Form, Col,
} from 'react-bootstrap';
import { Formik, Field } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { ChatContext, SocketContext } from '../contexts/index.js';

const Messages = () => {
  const { t } = useTranslation();
  const { inputRef, messagesCount, setMessagesCount } = useContext(ChatContext);
  const { sendMessage } = useContext(SocketContext);
  const messages = useSelector((state) => state.messagesInfo.messages);
  const channels = useSelector((state) => state.channelsInfo.channels);
  const currentChannelId = useSelector(
    (state) => state.channelsInfo.currentChannelId,
  );
  const currentChannel = channels.find(
    (channel) => channel.id === currentChannelId,
  );
  const currentChannelMessages = messages.filter(
    (message) => message.channelId === currentChannelId,
  );
  const authorizedUser = JSON.parse(localStorage.getItem('user')).username;

  useEffect(() => {
    animateScroll.scrollToBottom({
      containerId: 'messages-box',
      delay: 0,
      duration: 300,
      smooth: true,
    });
    setMessagesCount(currentChannelMessages.length);
  }, [currentChannelMessages.length, currentChannel, setMessagesCount]);

  const notifyError = () => {
    toast.error(t('errors.connection'));
  };

  const messageSchema = yup.object().shape({
    body: yup.string().trim().required(),
  });

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {currentChannel?.name}</b>
          </p>
          <span className="text-muted">
            {t('chatPage.messages', { count: messagesCount })}
          </span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {messages
            && messages
              .filter((message) => currentChannel?.id === message.channelId)
              .map((message) => (
                <div key={message.id} className="text-break mb-2">
                  <b>{message.username}</b>: {message.body}
                </div>
              ))}
        </div>
        <div className="mt-auto px-5 py-3">
          <Formik
            initialValues={{ body: '' }}
            validationSchema={messageSchema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              try {
                await sendMessage(values.body, currentChannel.id, authorizedUser);
                resetForm({ body: '' });
              } catch {
                notifyError();
              }
              setSubmitting(false);
              setTimeout(() => {
                inputRef.current.focus();
              }, 0);
            }}
          >
            {(props) => {
              const {
                isValid, isSubmitting, dirty, handleSubmit,
              } = props;

              return (
                <Form
                  noValidate
                  onSubmit={handleSubmit}
                  className="py-1 border rounded-2"
                >
                  <InputGroup hasValidation>
                    <Field
                      disabled={isSubmitting}
                      autoFocus
                      innerRef={(f) => { inputRef.current = f; }}
                      name="body"
                      placeholder={t('chatPage.inputMessage')}
                      className="border-0 p-0 ps-2 form-control"
                      aria-label={t('chatPage.newMessage')}
                    />
                    <Button
                      type="submit"
                      variant=""
                      className="btn-group-vertical"
                      disabled={!(isValid && dirty)}
                      style={{ borderColor: 'transparent' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        width="20"
                        height="20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                        />
                      </svg>
                      <span className="visually-hidden">
                        {t('chatPage.send')}
                      </span>
                    </Button>
                  </InputGroup>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Col>
  );
};

export default Messages;
