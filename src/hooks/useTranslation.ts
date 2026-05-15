import { useCallback } from 'react';
import { useAppStore } from '../store';
import zhCN from '../i18n/locales/zh-CN';
import enUS from '../i18n/locales/en-US';
import jaJP from '../i18n/locales/ja-JP';
import koKR from '../i18n/locales/ko-KR';
import frFR from '../i18n/locales/fr-FR';
import deDE from '../i18n/locales/de-DE';

const locales: Record<string, any> = {
  zh: zhCN,
  en: enUS,
  ja: jaJP,
  ko: koKR,
  fr: frFR,
  de: deDE,
};

export function useTranslation() {
  const { language, setLanguage } = useAppStore();
  const currentLocale = locales[language] || locales.zh;

  const t = useCallback(
    (key: string) => {
      const keys = key.split('.');
      let value: any = currentLocale;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) return key;
      }
      return value || key;
    },
    [currentLocale]
  );

  return { t, language, setLanguage };
}
