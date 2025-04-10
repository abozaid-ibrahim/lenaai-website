'use client';

import { createContext, useContext, useMemo, useCallback, useState, useEffect } from "react";

import en from "../../../public/locales/en";
import ar from "../../../public/locales/ar";
import Cookies from "js-cookie";

const context = {
    locale: "ar",
    t: ar,
    changeLanguage: () => { },
};

const I18nContext = createContext(context);

export const I18nProvider = ({ initialLocal = "ar", children }) => {
    const [locale, setLocale] = useState(initialLocal);

    /**
     * INFO: Hydration error:
     *   The hydration error occurs because `I18nProvider` is a client-side component, 
     *   but it’s being used in a server-rendered context (the root layout) WITHOUT proper synchronization between server and client states.
    */

    // Sync with cookie on mount (client-side only)
    useEffect(() => {
        const cookieLang = Cookies.get('lang');
        if (cookieLang && cookieLang !== locale) {
            setLocale(cookieLang);
        }
    }, []);

    const changeLanguage = useCallback((lang) => {
        setLocale(lang);
        Cookies.set("lang", lang, { expires: 365 }); // Store in cookie (expires in 1 year)
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }, []);

    const t = useMemo(() => locale === "ar" ? ar : en, [locale]);

    return (
        <I18nContext.Provider value={{ locale, t, changeLanguage }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => useContext(I18nContext);