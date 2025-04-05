"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname, Locale } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const locale = useLocale();
  const [language, setLanguage] = useState(locale.toUpperCase()); 

  const router = useRouter();
  const pathname = usePathname();


  const handleLangChange = (lang: string) => {
    const nextLocale = lang.toLowerCase(); 
    setLanguage(lang);
    setIsLangOpen(false);

    router.replace(
      { pathname },
      { locale: nextLocale as Locale }
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsLangOpen(!isLangOpen)}
        className="flex items-center border-2 border-white px-3 py-1 rounded-full"
      >
        {language} <ChevronDown className="ml-1 w-4 h-4" />
      </button>
      {isLangOpen && (
        <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-24">
          {["KZ", "RU", "EN"].map((lang) => (
            <div
              key={lang}
              onClick={() => handleLangChange(lang)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              {lang}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
