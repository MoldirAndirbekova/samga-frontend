"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";


export default function Navbar2() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Home");
  const segments = pathname.split("/");
  const locale = ["en", "ru", "kz"].includes(segments[1]) ? segments[1] : "en";
  const [language, setLanguage] = useState(locale.toUpperCase());

  const handleLangChange = (lang: string) => {
    const nextLocale = lang.toLowerCase();
    setLanguage(lang);
    setIsLangOpen(false);

    const newPath = `/${nextLocale}${pathname.replace(/^\/(en|ru|kz)/, "")}`;
    router.replace(newPath);
  };

  return (
    <div className="w-full bg-[#2959BF] text-white z-50">
      <div className="flex items-center justify-between px-2 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/svg/samga_bj.svg" alt="Logo" width={120} height={40} />
        </div>

        {/* Nav Links */}
        <ul className="hidden md:flex gap-6 items-center text-white font-medium text-lg">
  <li>
    <Link href="/#why-us">{t("navbar_about")}</Link>
  </li>
  <li>
    <Link href="/whowehelp">{t("navbar_whohelp")}</Link>
  </li>
  <li className="relative group">
    <span className="cursor-pointer">{t("skills_devolop")}</span>
    <ul className="absolute left-0 mt-2 w-56 bg-white text-black border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <li>
      <Link
              href="/skills/cognitive"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {t("skills_cognitive")}
            </Link>
          </li>
          <li>
            <Link
              href="/skills/motoric"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {t("skills_motoric")}
            </Link>
      </li>
    </ul>
  </li>
  <li>
    <Link href="/terms">{t("contact_us")}</Link>
  </li>
  <li>
    <Link href="/register">{t("signup")}</Link>
  </li>
  <li>
    <Link href="/login">{t("login")}</Link>
  </li>
</ul>


        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="border border-white rounded-full px-4 py-2 text-sm flex items-center gap-1 font-medium hover:bg-white hover:text-[#2959BF] transition"
          >
            <Globe className="w-4 h-4" />
            {language}
            <ChevronDown className="w-4 h-4" />
          </button>

          {isLangOpen && (
            <ul className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-24 z-50">
              {["EN", "RU", "KZ"].map((lang) => (
                <li
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {lang}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
