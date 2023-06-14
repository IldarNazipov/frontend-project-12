import { Nav, Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import cn from 'classnames';
import { useContext, useState } from 'react';
import { I18nContext } from 'react-i18next';

const Channels = ({
  channels,
  activeChannel,
  setActiveChannel,
  messages,
  setMessagesCount,
  inputRef,
  showModal,
}) => {
  const { i18n } = useContext(I18nContext);
  const isActive = (id) => activeChannel.id === id;
  const handleClick = (id) => {
    const currentChannel = channels.find((channel) => id === channel.id);
    const activeMessages = messages.filter(
      (message) => message.channelId === currentChannel.id
    );
    setActiveChannel(currentChannel);
    setMessagesCount(activeMessages.length);
    inputRef.current.focus();
  };

  return channels.map((item) => (
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
              {i18n.t('chatPage.remove')}
            </Dropdown.Item>
            <Dropdown.Item>{i18n.t('chatPage.rename')}</Dropdown.Item>
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
  ));
};

export default Channels;
