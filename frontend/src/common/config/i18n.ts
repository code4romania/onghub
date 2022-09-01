import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import translationRo from '../../assets/locales/ro/translation.json';

// const backend = new Backend({
//   loadPath: 'src/assets/locales/ro/translation.json',
// });

i18n.use(initReactI18next).init({
  resources: { ro: translationRo },
  lng: 'ro',
  fallbackLng: 'en',
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
