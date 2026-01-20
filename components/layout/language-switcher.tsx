"use client";

import { useState } from "react";
import { Link, usePathname } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh-CN", name: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW", name: "繁體中文", flag: "🇹🇼" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ru", name: "Русский", flag: "🇷🇺" }
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors rounded-none"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-white border-2 border-zinc-200 shadow-lg rounded-none">
            {languages.map((language) => {
              return (
                <Link
                  key={language.code}
                  href={pathname}
                  locale={language.code}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    language.code === locale
                      ? "bg-[#FCEE21] text-black font-bold"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                  }`}
                >
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
