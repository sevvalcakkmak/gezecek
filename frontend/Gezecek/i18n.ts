import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import en from "@/locales/en.json";
import tr from "@/locales/tr.json";

const device = Localization.getLocales()?.[0];
const initial = device?.languageCode?.toLowerCase() === "tr" ? "tr" : "en";

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        tr: { translation: tr },
      },
      lng: initial,
      fallbackLng: "en",
      supportedLngs: ["en", "tr"],
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      returnEmptyString: false,
    })
    .catch(() => {});
}

export default i18n;
