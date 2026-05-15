import { useMemo, ReactNode } from 'react';
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

interface TransProps {
  id: string;
  values?: Record<string, string | number>;
  children?: ReactNode;
}

export function useTranslation() {
  const { language } = useAppStore();
  const locale = locales[language] || locales.zh;

  const t = (id: string, values?: Record<string, string | number>) => {
    const keys = id.split('.');
    let text: any = locale;
    for (const key of keys) {
      text = text?.[key];
    }
    if (!text) return id;
    if (values) {
      return Object.entries(values).reduce((str, [key, val]) => {
        return str.replace(`{${key}}`, String(val));
      }, text);
    }
    return text;
  };

  return { t, language };
}

export default function Trans({ id, values, children }: TransProps) {
  const { t } = useTranslation();
  const text = useMemo(() => t(id, values), [id, values, t]);

  if (children) {
    return <span>{text}{children}</span>;
  }

  return <span>{text}</span>;
}

export function formatCurrency(amount: number, currency = 'CNY') {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date, locale = 'zh-CN') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
}
