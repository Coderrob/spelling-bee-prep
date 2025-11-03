import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './en/common.json';

const resources = {
  en: {
    common: enCommon,
  },
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
