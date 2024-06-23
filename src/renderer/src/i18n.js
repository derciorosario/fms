import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';
// Add more translations as needed

const resources = {
  en: {
    translation: translationEN
  },
  pt: {
    translation: translationPT
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'pt',
    fallbackLng: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'pt',
    interpolation: {
      escapeValue: false 
    }
  });


export default i18n;
