'use client';

import { useState } from 'react';
import { I18nContext } from './I18nContext';
import enTranslations from '../../locals/en';
import arTranslations from '../../locals/ar';

// Static translations
const translations = {
  en: enTranslations,
  ar: arTranslations
};

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');

  const t = (key) => {
    return translations[locale]?.[key] || key;
  };

  const changeLocale = (newLocale) => {
    if (newLocale === 'en' || newLocale === 'ar') {
      setLocale(newLocale);
      // Update HTML dir attribute for RTL support
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
      // Update HTML lang attribute
      document.documentElement.lang = newLocale;
    }
  };

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale, isRTL: locale === 'ar' }}>
      {children}
    </I18nContext.Provider>
  );
};