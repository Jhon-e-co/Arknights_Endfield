import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/request';

export default createMiddleware({
  // 支持的语言列表
  locales,
  
  // 默认语言
  defaultLocale,
  
  // 路径策略：总是添加语言前缀（避免重定向循环）
  localePrefix: 'always',
  
  // 排除的路径
  localeDetection: false,
  
  // 需要排除的路径（静态资源、API等）
  // 这些路径不会被添加locale前缀
  // 注意：next-intl会自动排除/_next, /api, /favicon.ico等
});

export const config = {
  // Match only internationalized pathnames
  // Skip all internal paths (_next)
  // Skip all API routes (api)
  // Skip all static files (images, favicon, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};