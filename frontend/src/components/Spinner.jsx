import { useTranslation } from 'react-i18next';

const Spinner = () => {
  const { t } = useTranslation();

  return (
    <div className='h-100 d-flex justify-content-center align-items-center'>
      <div role='status' className='spinner-border text-primary'>
        <span className='visually-hidden'>{t('loading')}</span>
      </div>
    </div>
  );
};

export default Spinner;
