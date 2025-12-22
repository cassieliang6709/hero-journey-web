import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译资源
import zhCommon from '../locales/zh/common.json';
import zhAuth from '../locales/zh/auth.json';
import zhChat from '../locales/zh/chat.json';
import zhTodo from '../locales/zh/todo.json';
import zhStarmap from '../locales/zh/starmap.json';
import zhTests from '../locales/zh/tests.json';
import zhOnboarding from '../locales/zh/onboarding.json';

import enCommon from '../locales/en/common.json';
import enAuth from '../locales/en/auth.json';
import enChat from '../locales/en/chat.json';
import enTodo from '../locales/en/todo.json';
import enStarmap from '../locales/en/starmap.json';
import enTests from '../locales/en/tests.json';
import enOnboarding from '../locales/en/onboarding.json';

const resources = {
  zh: {
    common: zhCommon,
    auth: zhAuth,
    chat: zhChat,
    todo: zhTodo,
    starmap: zhStarmap,
    tests: zhTests,
    onboarding: zhOnboarding,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    chat: enChat,
    todo: enTodo,
    starmap: enStarmap,
    tests: enTests,
    onboarding: enOnboarding,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    defaultNS: 'common',
    ns: ['common', 'auth', 'chat', 'todo', 'starmap', 'tests', 'onboarding'],
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
