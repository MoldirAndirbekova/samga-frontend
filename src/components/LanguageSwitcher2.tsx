"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useLocale } from 'next-intl';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(currentLocale.toUpperCase());

  const handleLanguageChange = (lang: string) => {
    const newPath = `/${lang.toLowerCase()}${pathname.slice(3)}`;
    router.push(newPath);
    setSelectedLang(lang);
    setIsLangOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsLangOpen(!isLangOpen)}
        className="flex items-center border px-2 py-1 rounded-md bg-white hover:bg-gray-100 transition"
      >
        {selectedLang}
        <ChevronDown className="ml-1 w-3 h-3" />
      </button>
      {isLangOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border rounded shadow-md w-16 z-50">
          {["KZ", "RU", "EN"].map((lang) => (
            <div
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className="px-2 py-1 cursor-pointer hover:bg-gray-200 text-sm"
            >
              {lang}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
