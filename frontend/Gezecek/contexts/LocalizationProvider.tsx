import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';

export type Lang = 'tr' | 'en';
const STORAGE_KEY = 'appLanguage';

interface I18nCtx { lang: Lang; setLanguage: (l: Lang) => Promise<void>; toggleLanguage: () => Promise<void>; ready: boolean }

const I18nContext = createContext<I18nCtx | null>(null);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Lang>(i18n.language as Lang || 'en');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored === 'tr' || stored === 'en') {
                    if (stored !== i18n.language) await i18n.changeLanguage(stored);
                    setLang(stored);
                }
            } finally {
                setReady(true);
            }
        })();
    }, []);

    const setLanguage = useCallback(async (l: Lang) => {
        if (l !== i18n.language) await i18n.changeLanguage(l);
        setLang(l);
        await AsyncStorage.setItem(STORAGE_KEY, l);
    }, []);

    const toggleLanguage = useCallback(async () => {
        await setLanguage(lang === 'tr' ? 'en' : 'tr');
    }, [lang, setLanguage]);
    const value: I18nCtx = { lang, setLanguage, toggleLanguage, ready };

    if (!ready) return null;

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18nMeta() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18nMeta must be used inside LocalizationProvider');
    return ctx;
}
