"use client";

import { useLocale } from "next-intl";
import { getI18nText } from "@/lib/utils";
import type { I18nText } from "@/lib/database.types";

interface DBTextProps {
  data: I18nText | null;
  className?: string;
}

/**
 * 用于渲染数据库中的多语言文本
 * @param data 多语言文本数据（字符串或对象）
 * @param className 可选的CSS类名
 */
export function DBText({ data, className }: DBTextProps) {
  const locale = useLocale();
  
  if (!data) {
    return null;
  }
  
  const text = getI18nText(data, locale);
  
  return <span className={className}>{text}</span>;
}