import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// 支持的语言列表
export const locales = ['en', 'th', 'ru', 'vi', 'zh-CN', 'ja', 'ko', 'zh-TW'] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    onError: (error) => {
      if (error.code === 'INVALID_KEY') {
        console.error('Invalid i18n key:', error.message);
      }
    }
  };
});