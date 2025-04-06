import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          welcome: 'Welcome',
          dashboard: 'Dashboard',
          // Add more translations here
        }
      },
      ar: {
        translation: {
          welcome: 'مرحبا',
          dashboard: 'لوحة التحكم',
          // Add more translations here
        }
      }
    }
  });

export default i18n;