import { useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { I18nContext } from 'react-i18next';
import { socket } from '../../socket.js';
import { toast } from 'react-toastify';

const Remove = ({ modalInfo, onHide }) => {
  const { i18n } = useContext(I18nContext);
  const [isSubmitting, setSubmitting] = useState(false);
  const { item } = modalInfo;

  const notifyError = () => {
    toast.error(i18n.t('errors.connection'));
  };
  const notifySuccess = () => {
    toast.success(i18n.t('channelRemoved'));
  };

  const handleClick = () => {
    setSubmitting(true);
    socket
      .timeout(3000)
      .emit('removeChannel', { id: item.id }, (err, response) => {
        if (response?.status === 'ok') {
          notifySuccess();
          onHide();
        } else {
          notifyError();
          setSubmitting(false);
          console.error(err);
        }
      });
  };

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{i18n.t('chatPage.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='lead'>{i18n.t('chatPage.sure')}</p>
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
            type='button'
            variant='danger'
            disabled={isSubmitting}
            onClick={handleClick}
          >
            {i18n.t('chatPage.remove')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
