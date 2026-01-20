import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { I18nText } from "@/lib/database.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 获取多语言文本
 * @param data 多语言文本数据（字符串或对象）
 * @param locale 当前语言环境
 */
export function getI18nText(data: I18nText | null, locale: string): string {
  if (!data) return '';
  
  if (typeof data === 'string') return data;
  
  // 尝试匹配精确语言
  if (data[locale]) return data[locale];
  
  // 尝试匹配语言前缀（如 zh-CN -> zh）
  const localePrefix = locale.split('-')[0];
  if (data[localePrefix]) return data[localePrefix];
  
  // 默认返回英文
  return data['en'] || '';
}