import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from '../src/locales/index.js';

i18n.use(initReactI18next).init({
  fallbackLng: 'ru',
  debug: true,
  resources,
});

export default i18n;
