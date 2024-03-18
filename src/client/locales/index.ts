import { use } from "i18next";
import { initReactI18next } from "react-i18next";

import { resourcesEN } from "./resources-en";
import { resourcesRU } from "./resources-ru";

export const resources = {
  en: resourcesEN,
  ru: resourcesRU,
} as const;

export const initI18n = () => {
  use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      lng: "en", // if you're using a language detector, do not define the lng option
      fallbackLng: "en",

      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    });
};
