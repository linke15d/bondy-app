import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import zh from './zh';
import en from './en';
import ja from './ja';

const resources = {
  zh: { translation: zh },
  en: { translation: en },
  ja: { translation: ja },
};

const getDeviceLanguage = (): string => {
  const locales = RNLocalize.getLocales();
  if (locales.length > 0) {
    const lang = locales[0].languageCode;
    if (lang in resources) return lang;
  }
  return 'zh'; // default
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
export type SupportedLanguage = 'zh' | 'en' | 'ja';