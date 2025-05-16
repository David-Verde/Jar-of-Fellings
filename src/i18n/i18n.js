import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language files
import en from './translations/en';
import es from './translations/es';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;