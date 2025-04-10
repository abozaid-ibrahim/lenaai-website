'use client";';

import { useI18n } from "@/app/context/translate-api";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { changeLanguage, locale } = useI18n();

  return (
    <button
      onClick={() => changeLanguage(locale === "en" ? "ar" : "en")}
      className="flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-white-700"
      aria-label="Toggle language"
    >
      <Globe size={18} />
      <span className="text-sm font-medium">
        {locale === "en" ? "العربية" : "English"}
      </span>
    </button>
  );
}
