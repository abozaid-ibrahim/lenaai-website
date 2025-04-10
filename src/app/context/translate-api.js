'use client';

import { createContext, useContext, useMemo, useCallback, useState } from "react";

import en from "../../../public/locales/en";
import ar from "../../../public/locales/ar";
import Cookies from "js-cookie";

const context = {
    locale: "ar",
    t: ar,
    changeLanguage: () => { },
};

const I18nContext = createContext(context);

export const I18nProvider = ({ children }) => {
    const [locale, setLocale] = useState(() => Cookies.get('lang') || "ar");

    const changeLanguage = useCallback((lang) => {
        setLocale(lang);
        Cookies.set("lang", lang, { expires: 365 }); // Store in cookie (expires in 1 year)
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }, []);

    const t = useMemo(() => locale === "en" ? en : ar, [locale]);

    return (
        <I18nContext.Provider value={{ locale, t, changeLanguage }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => useContext(I18nContext);