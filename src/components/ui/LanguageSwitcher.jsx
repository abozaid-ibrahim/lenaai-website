"use client";

import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const toggleLanguage = () => {
    console.log("Language toggled");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-white-700"
      aria-label="Toggle language"
    >
      <Globe size={18} />
      <span className="text-sm font-medium">test</span>
    </button>
  );
}
