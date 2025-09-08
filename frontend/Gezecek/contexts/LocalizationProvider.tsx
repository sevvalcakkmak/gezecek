import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import enJson from '@/locales/en.json';
import trJson from '@/locales/tr.json';

export type Lang = 'tr' | 'en';
const STORAGE_KEY = 'appLanguage';

const staticDict: Record<Lang, Record<string, string>> = { en: enJson as any, tr: trJson as any };

interface I18nCtx {
    lang: Lang;
    t: (k: string) => string;
    setLanguage: (l: Lang) => Promise<void>;
    toggleLanguage: () => Promise<void>;
    ready: boolean;
}

const I18nContext = createContext<I18nCtx | null>(null);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Lang>('en');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored === 'tr' || stored === 'en') {
                    setLang(stored);
                } else {
                    const locales = Localization.getLocales();
                    const primary = locales?.[0];
                    if (primary?.languageCode?.toLowerCase() === 'tr') setLang('tr');
                    else setLang('en');
                }
            } catch {
                setLang('en');
            } finally {
                setReady(true);
            }
        })();
    }, []);

    const setLanguage = useCallback(async (l: Lang) => {
        setLang(l);
        await AsyncStorage.setItem(STORAGE_KEY, l);
    }, []);

    const toggleLanguage = useCallback(async () => {
        await setLanguage(lang === 'tr' ? 'en' : 'tr');
    }, [lang, setLanguage]);

    const t = useCallback((k: string) => staticDict[lang][k] ?? k, [lang]);

    const value: I18nCtx = { lang, t, setLanguage, toggleLanguage, ready };

    if (!ready) return null; // loading state; istersen splash gösterebilirsin

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used inside LocalizationProvider');
    return ctx;
}
