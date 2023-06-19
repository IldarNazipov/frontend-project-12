import { useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { SocketContext } from '../../contexts';

const Remove = ({ modalInfo, onHide }) => {
  const { t } = useTranslation();
  const [isSubmitting, setSubmitting] = useState(false);
  const { removeChannel } = useContext(SocketContext);
  const { item } = modalInfo;

  const notifyError = () => {
    toast.error(t('errors.connection'));
  };
  const notifySuccess = () => {
    toast.success(t('channelRemoved'));
  };

  const handleClick = async () => {
    setSubmitting(true);
    try {
      await removeChannel(item.id);
      notifySuccess();
      onHide();
    } catch {
      notifyError();
    }
    setSubmitting(false);
  };

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chatPage.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('chatPage.sure')}</p>
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
            type="button"
            variant="danger"
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
