import i18n from "i18next";
import enUsTrans from "./en.json";
import zhCnTrans from "./zh.json";
import jaCnTrans from "./ja.json";
import koCnTrans from "./ko.json";
import frCnTrans from "./fr.json";
import { initReactI18next } from "react-i18next";
import { LOCAL_KEY } from "../config";
export const zh = "zh";
export const en = "en";
export const ja = "ja";
export const ko = "ko";
export const fr = "fr";

i18n
  .use(initReactI18next) //init i18next
  .init({
    //-
    resources: {
      zh: {
        translation: zhCnTrans,
      },
      en: {
        translation: enUsTrans,
      },
      ja: {
        translation: jaCnTrans,
      },
      ko: {
        translation: koCnTrans,
      },
      fr: {
        translation: frCnTrans,
      },
    },
    //--ey，-n/zh
    // fallbackLng: "en",
    fallbackLng: window.localStorage.getItem(LOCAL_KEY) || "en",
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
