/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col, Form, InputGroup, Nav } from 'react-bootstrap';
import { useEffect, useState, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserdata, addMessage } from '../slices/userdataSlice.js';
import { socket } from '../socket.js';
import axios from 'axios';
import routes from '../routes.js';
import { Formik, Field } from 'formik';
import * as yup from 'yup';
import cn from 'classnames';
import Spinner from './Spinner.jsx';
import { AppContext } from './App.jsx';

const getAuthHeader = () => {
  const lsItem = JSON.parse(localStorage.getItem('user'));

  if (lsItem && lsItem.token) {
    return { Authorization: `Bearer ${lsItem.token}` };
  }

  return {};
};

const ChatPage = () => {
  const { loggedIn } = useContext(AppContext);
  const userdata = useSelector((state) => state.userdata);
  const [messagesCount, setMessagesCount] = useState(0);
  const [activeChannel, setActiveChannel] = useState({});
  const [authorizedUser, setAuthorizedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const inputRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios({
        url: routes.dataPath(),
        method: 'get',
        headers: getAuthHeader(),
      });
      if (data) {
        setLoading(false);
        dispatch(getUserdata(data));
      }
    };
    fetchData();
  }, []);

  const { channels, currentChannelId, messages } = userdata.entities;

  useEffect(() => {
    if (channels && currentChannelId) {
      const currentChannel = channels.find(
        (item) => item.id === currentChannelId
      );
      setActiveChannel(currentChannel);
      setMessagesCount(messages.length);
      setAuthorizedUser(loggedIn.username);
    }
  }, [channels]);

  useEffect(() => {
    socket.on('newMessage', (payload) => {
      dispatch(addMessage(payload));
    });
  }, []);

  const getButtonClass = (id) => {
    const isActive = activeChannel.id === id;
    return cn('w-100 rounded-0 text-start btn', { 'btn-secondary': isActive });
  };

  const messageSchema = yup.object().shape({
    body: yup.string().trim().required(),
  });

  return loading ? (
    <Spinner />
  ) : (
    <Container className='h-100 my-4 overflow-hidden rounded shadow'>
      <Row className='h-100 bg-white flex-md-row'>
        <Col
          xs={4}
          md={2}
          className='border-end px-0 bg-light flex-column h-100 d-flex'
        >
          <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
            <b>Каналы</b>
            <button
              type='button'
              className='p-0 text-primary btn btn-group-vertical'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 16 16'
                width='20'
                height='20'
                fill='currentColor'
              >
                <path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z'></path>
                <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'></path>
              </svg>
              <span className='visually-hidden'>+</span>
            </button>
          </div>
          <Nav
            id='channels-box'
            variant='pills'
            fill
            className='flex-column px-2 mb-3 overflow-auto h-100 d-block'
          >
            {channels &&
              channels.map((item) => (
                <Nav.Item key={item.id} className='w-100'>
                  <button
                    onClick={() => {
                      const currentChannel = channels.find(
                        (channel) => item.id === channel.id
                      );
                      setActiveChannel(currentChannel);
                      inputRef.current.focus();
                    }}
                    type='button'
                    className={getButtonClass(item.id)}
                  >
                    <span className='me-1'>#</span>
                    {item.name}
                  </button>
                </Nav.Item>
              ))}
          </Nav>
        </Col>
        <Col className='p-0 h-100'>
          <div className='d-flex flex-column h-100'>
            <div className='bg-light mb-4 p-3 shadow-sm small'>
              <p className='m-0'>
                {activeChannel && <b># {activeChannel.name}</b>}
              </p>
              <span className='text-muted'>{messagesCount} сообщений</span>
            </div>
            <div id='messages-box' className='chat-messages overflow-auto px-5'>
              {messages &&
                messages.map((message) => (
                  <div key={message.id} className='text-break mb-2'>
                    <b>{message.username}</b>: {message.body}{' '}
                  </div>
                ))}
            </div>
            <div className='mt-auto px-5 py-3'>
              <Formik
                initialValues={{ body: '' }}
                validationSchema={messageSchema}
                onSubmit={(values, { resetForm }) => {
                  socket.emit('newMessage', {
                    body: values.body,
                    channelId: activeChannel.id,
                    username: authorizedUser,
                  });
                  setMessagesCount(messagesCount + 1);
                  resetForm({ body: '' });
                }}
              >
                {(props) => {
                  const { isValid, dirty, handleSubmit } = props;
                  return (
                    <Form
                      noValidate
                      onSubmit={handleSubmit}
                      className='py-1 border rounded-2'
                    >
                      <InputGroup hasValidation>
                        <Field
                          autoFocus
                          innerRef={(f) => {
                            inputRef.current = f;
                          }}
                          name='body'
                          placeholder='Введите сообщение...'
                          className='border-0 p-0 ps-2 form-control'
                        />
                        <button
                          type='submit'
                          className='btn btn-group-vertical'
                          style={{ borderColor: 'transparent' }}
                          disabled={!(isValid && dirty)}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 16 16'
                            width='20'
                            height='20'
                            fill='currentColor'
                          >
                            <path
                              fillRule='evenodd'
                              d='M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z'
                            ></path>
                          </svg>
                          <span className='visually-hidden'>Отправить</span>
                        </button>
                      </InputGroup>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
