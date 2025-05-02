"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname, Locale } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const [language, setLanguage] = useState(locale.toUpperCase());
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const handleLangChange = (lang: string) => {
    const nextLocale = lang.toLowerCase();
    setLanguage(lang);
    setIsOpen(false);

    router.replace(
      { pathname },
      { locale: nextLocale as Locale }
    );
  };

  // Закрытие по клику вне меню
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border border-white px-3 py-1 rounded-full text-white hover:bg-white hover:text-blue-600 transition"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {language} <ChevronDown className="ml-1 w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-24 z-50">
          {["KZ", "RU", "EN"].map((lang) => (
            <button
              key={lang}
              onClick={() => handleLangChange(lang)}
              className="w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              {lang}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
