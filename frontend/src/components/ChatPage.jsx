import { Container, Row } from 'react-bootstrap';
import {
  useEffect, useState, useRef, createContext,
} from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import routes from '../routes.js';
import Spinner from './Spinner.jsx';
import getModal from './modals/index.js';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const getAuthToken = () => {
  const lsItem = JSON.parse(localStorage.getItem('user'));

  if (lsItem && lsItem.token) {
    return { Authorization: `Bearer ${lsItem.token}` };
  }

  return {};
};

const renderModal = ({ modalInfo, hideModal }) => {
  if (!modalInfo.type) {
    return null;
  }
  const Component = getModal(modalInfo.type);
  return <Component modalInfo={modalInfo} onHide={hideModal} />;
};

const ChatPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [messagesCount, setMessagesCount] = useState(0);
  const [modalInfo, setModalInfo] = useState({
    type: null,
    item: null,
  });
  const inputRef = useRef();
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(routes.dataPath(), {
        headers: getAuthToken(),
      });

      if (data) {
        setLoading(false);
        const { channels, messages, currentChannelId } = data;
        dispatch(channelsActions.addChannels(channels));
        dispatch(messagesActions.addMessages(messages));
        dispatch(channelsActions.setCurrentChannelId(currentChannelId));
        const defaultMessagesCount = data.messages.filter(
          (item) => item.channelId === currentChannelId,
        ).length;
        setMessagesCount(defaultMessagesCount);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {});

  return loading ? (
    <Spinner />
  ) : (
    <ChatContext.Provider
      value={{
        messagesCount,
        setMessagesCount,
        inputRef,
        getAuthToken,
      }}
    >
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Channels showModal={showModal} />
          <Messages />
        </Row>
        {renderModal({ modalInfo, hideModal })}
      </Container>
    </ChatContext.Provider>
  );
};
export const ChatContext = createContext({});
export default ChatPage;
