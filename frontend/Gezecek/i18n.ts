import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import tr from "./locales/tr.json";

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
};

const supportedLanguages = ["en", "tr"] as const;
type SupportedLang = (typeof supportedLanguages)[number];
const isSupported = (lng: string): lng is SupportedLang => (supportedLanguages as readonly string[]).includes(lng);

const getDeviceLanguage = () => {
  const locales = getLocales();
  const languageCode = locales[0]?.languageCode || "en";
  return isSupported(languageCode) ? languageCode : "en";
};

const getStoredLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem("app-language");
    if (storedLanguage && isSupported(storedLanguage)) {
      return storedLanguage;
    }
  } catch (error) {
    console.log("Language error:", error);
  }
  return getDeviceLanguage();
};

export const changeLanguage = async (language: string) => {
  if (isSupported(language)) {
    try {
      await AsyncStorage.setItem("app-language", language);
      await i18n.changeLanguage(language);
    } catch (error) {
      console.log("Language saving error:", error);
    }
  }
};

// İlk başta synchronous olarak device language ile başlat
const deviceLanguage = (() => {
  const locales = getLocales();
  const languageCode = locales[0]?.languageCode || "en";
  return isSupported(languageCode) ? languageCode : "en";
})();

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: "en",
  defaultNS: "translation",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Sonra async olarak stored language'ı kontrol et ve güncelle
const loadStoredLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem("app-language");
    if (storedLanguage && isSupported(storedLanguage)) {
      await i18n.changeLanguage(storedLanguage);
    }
  } catch (error) {
    console.log("Language loading error:", error);
  }
};

// Expose a promise to await i18n being aligned with stored preference
export const i18nReady = loadStoredLanguage();

export default i18n;
