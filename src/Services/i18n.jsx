import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import des traductions
import translationEN from '../locales/en/translation.json';
import translationFR from '../locales/fr/translation.json';

// Configuration simple
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      fr: { translation: translationFR }
    },
    lng: 'fr',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;