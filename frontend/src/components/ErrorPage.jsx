import Image from 'react-bootstrap/Image';
import ErrorImg from '../assets/error.svg';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

const ErrorPage = () => {
  const { t } = useTranslation();
  return (
    <div className='text-center'>
      <Image alt={t('errors.404')} fluid className='h-25' src={ErrorImg} />
      <h1 className='h4 text-muted'>{t('errors.404')}</h1>
      <Trans
        components={{
          tx: <p className='text-muted' />,
          lnk: <Link to='/' />,
        }}
      >
        goToHomepage
      </Trans>
    </div>
  );
};

export default ErrorPage;
