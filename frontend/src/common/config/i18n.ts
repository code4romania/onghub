import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationMenuRo from '../../assets/locales/ro/translationMenu.json';
import translationEn from '../../assets/locales/en/translation.json';

const resources = {
  ro: {
    menu: translationMenuRo,
  },
  en: {
    translation: translationEn,
  },
};

i18n.use(initReactI18next).init({
  lng: 'ro',
  fallbackLng: 'en',

  defaultNS: 'common',
  resources,
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
