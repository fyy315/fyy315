import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';
import jaJP from './locales/ja-JP';
import koKR from './locales/ko-KR';
import frFR from './locales/fr-FR';
import deDE from './locales/de-DE';

export type Locale = 'zh' | 'en' | 'ja' | 'ko' | 'fr' | 'de';

const translations = {
  zh: zhCN,
  en: enUS,
  ja: jaJP,
  ko: koKR,
  fr: frFR,
  de: deDE,
};

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.');
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
};

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'zh',
      setLocale: (locale) => set({ locale }),
      t: (key: string) => {
        const { locale } = get();
        return getNestedValue(translations[locale], key);
      },
    }),
    { name: 'i18n-storage' }
  )
);

export { translations };
export const languages = [
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];
