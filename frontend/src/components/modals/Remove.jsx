import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as channelsActions } from '../../slices/channelsSlice.js';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { socket } from '../../index.js';
import { toast } from 'react-toastify';

const Remove = ({ modalInfo, onHide }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentChannelId = useSelector(
    (state) => state.channelsInfo.currentChannelId
  );
  const [isSubmitting, setSubmitting] = useState(false);
  const { item } = modalInfo;

  const notifyError = () => {
    toast.error(t('errors.connection'));
  };
  const notifySuccess = () => {
    toast.success(t('channelRemoved'));
  };

  const handleClick = () => {
    setSubmitting(true);
    socket
      .timeout(3000)
      .emit('removeChannel', { id: item.id }, (err, response) => {
        if (response?.status === 'ok') {
          currentChannelId === item.id &&
            dispatch(channelsActions.setCurrentChannelId(1));
          notifySuccess();
          onHide();
        } else {
          setSubmitting(false);
          notifyError();
          console.error(err);
        }
      });
  };

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='lead'>{t('chatPage.sure')}</p>
        <div className='d-flex justify-content-end'>
          <Button
            onClick={onHide}
            type='button'
            variant='secondary'
            className='me-2'
          >
            {t('chatPage.cancel')}
          </Button>
          <Button
            type='button'
            variant='danger'
            disabled={isSubmitting}
            onClick={handleClick}
          >
            {t('chatPage.remove')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
