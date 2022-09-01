import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationRo from '../../assets/locales/ro/translation.json';
import translationEn from '../../assets/locales/en/translation.json';

const resources = {
  ro: {
    ...translationRo,
  },
  en: {
    ...translationEn,
  },
};

i18n.use(initReactI18next).init({
  lng: 'ro',
  fallbackLng: 'en',
  resources,
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
