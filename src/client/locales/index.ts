import { use } from "i18next";
import { initReactI18next } from "react-i18next";

import loginPage from "./en/pages/login.json";
import registerPage from "./en/pages/register.json";
import resetPasswordPage from "./en/pages/resetPassword.json";
import requestPasswordResetPage from "./en/pages/requestPasswordReset.json";

export const resources = {
  en: {
    translation: {
      pages: {
        login: loginPage,
        register: registerPage,
        resetPassword: resetPasswordPage,
        requestPasswordReset: requestPasswordResetPage,
      },
    },
  },
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
