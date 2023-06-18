import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from '../src/locales/index.js';

const initiateI18n = async () => {
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    fallbackLng: 'ru',
    debug: true,
    resources,
  });
};

export default initiateI18n;
