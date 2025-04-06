'use client';

import { useState, useEffect } from 'react';
import { I18nContext } from './I18nContext';
import enTranslations from '../../locales/en';
import arTranslations from '../../locales/ar';

const translations = {
  en: enTranslations,
  ar: arTranslations,
};

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('en');
  
  // Load saved language preference from localStorage if available
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      localStorage.setItem('locale', newLocale);
      // Update HTML dir attribute for RTL support
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLocale;
    }
  };

  const t = (key) => {
    return translations[locale][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </I18nContext.Provider>
  );
}