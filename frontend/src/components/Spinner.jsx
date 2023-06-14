import { useContext } from 'react';
import { I18nContext } from 'react-i18next';

const Spinner = () => {
  const { i18n } = useContext(I18nContext);

  return (
    <div className='h-100 d-flex justify-content-center align-items-center'>
      <div role='status' className='spinner-border text-primary'>
        <span className='visually-hidden'>{i18n.t('loading')}</span>
      </div>
    </div>
  );
};

export default Spinner;
