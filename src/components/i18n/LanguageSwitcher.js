'use client';

import { useI18n } from './I18nContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, changeLocale } = useI18n();

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    changeLocale(newLocale);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700"
      aria-label="Toggle language"
    >
      <Globe size={18} />
      <span className="text-sm font-medium">{locale === 'en' ? 'EN' : 'AR'}</span>
    </button>
  );
}