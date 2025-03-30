import enTranslations from "@/locales/en/translations.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translations: enTranslations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  defaultNS: "translations",
});

export default i18n;
