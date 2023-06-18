import { Nav, Button, ButtonGroup, Dropdown, Col } from 'react-bootstrap';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { animateScroll } from 'react-scroll';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { ChatContext } from './ChatPage.jsx';

const Channels = ({ showModal }) => {
  const { t } = useTranslation();
  const { setMessagesCount, inputRef } = useContext(ChatContext);
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector(
    (state) => state.channelsInfo
  );
  const messages = useSelector((state) => state.messagesInfo.messages);
  const lastChannelsItemId = channels.at(-1).id;
  const isActive = (id) => id === currentChannelId;

  useEffect(() => {
    if (currentChannelId === 1) {
      animateScroll.scrollToTop({
        containerId: 'channels-box',
        delay: 0,
        duration: 0,
      });
    }
    if (currentChannelId === lastChannelsItemId) {
      animateScroll.scrollToBottom({
        containerId: 'channels-box',
        delay: 0,
        duration: 0,
      });
    }
  }, [currentChannelId, lastChannelsItemId]);

  const handleClick = (id) => {
    const targetChannel = channels.find((channel) => id === channel.id);
    const activeMessages = messages.filter(
      (message) => message.channelId === targetChannel.id
    );
    dispatch(channelsActions.setCurrentChannelId(targetChannel.id));
    setMessagesCount(activeMessages.length);
    inputRef.current.focus();
  };

  return (
    <Col
      xs={4}
      md={2}
      className='border-end px-0 bg-light flex-column h-100 d-flex'
    >
      <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
        <b>{t('chatPage.channels')}</b>
        <button
          type='button'
          className='p-0 text-primary btn btn-group-vertical'
          onClick={() => showModal('adding')}
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
              {item.removable ? (
                <Dropdown as={ButtonGroup} className='d-flex'>
                  <Button
                    type='button'
                    variant=''
                    className={`w-100 rounded-0 text-start text-truncate${
                      isActive(item.id) ? ' btn-secondary' : ''
                    }`}
                    onClick={() => handleClick(item.id)}
                  >
                    <span className='me-1'>#</span>
                    {item.name}
                  </Button>
                  <Dropdown.Toggle
                    split
                    variant=''
                    className={`flex-grow-0${
                      isActive(item.id) ? ' btn-secondary' : ''
                    }`}
                  />
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => showModal('removing', item)}>
                      {t('chatPage.remove')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => showModal('renaming', item)}>
                      {t('chatPage.rename')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button
                  type='button'
                  variant=''
                  className={`w-100 rounded-0 text-start${
                    isActive(item.id) ? ' btn-secondary' : ''
                  }`}
                  onClick={() => handleClick(item.id)}
                >
                  <span className='me-1'>#</span>
                  {item.name}
                </Button>
              )}
            </Nav.Item>
          ))}
      </Nav>
    </Col>
  );
};

export default Channels;
