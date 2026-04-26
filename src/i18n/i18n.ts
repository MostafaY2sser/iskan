

// src/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { languages, getLanguageByCode } from './languages';

import enCommon from '../locales/en/common.json';
import arCommon from '../locales/ar/common.json';

import en from '../locales/en/en';
import ar from '../locales/ar/ar';

const resources = {
  en: {
    common: { ...enCommon, ...en },
  },
  ar: {
    common: { ...arCommon, ...ar },
  },
};

const updateHTMLAttributes = (language: string) => {
  const html = document.documentElement;
  const lang = getLanguageByCode(language);

  if (lang) {
    html.setAttribute('lang', lang.code);
    html.setAttribute('dir', lang.dir);

    document.body.classList.toggle('rtl', lang.dir === 'rtl');
    document.body.classList.toggle('ltr', lang.dir === 'ltr');
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // lng: 'ar', 
    fallbackLng: 'ar',
    supportedLngs: languages.map(lang => lang.code),
    defaultNS: 'common',
    ns: ['common'],
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'htmlTag'],
      lookupLocalStorage: 'lang',
      caches: ['localStorage'],
    },
    react: {
      bindI18n: 'languageChanged loaded',
      useSuspense: true,
    },
    debug: process.env.NODE_ENV === 'development',
  });

i18n.on('languageChanged', (language) => {
  updateHTMLAttributes(language);
  localStorage.setItem('lang', language);
});

const initialLanguage = localStorage.getItem('lang') || 'ar';
i18n.changeLanguage(initialLanguage);
updateHTMLAttributes(initialLanguage);

export default i18n;
export { updateHTMLAttributes };
