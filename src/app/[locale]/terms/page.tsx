"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter, usePathname, Locale } from "@/i18n/routing";
import { Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function TermsAndConditions() {
  const t = useTranslations("Terms");
  
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
    <div className="bg-[#FFF5E1] text-[#2F2F2F] py-20 px-4 sm:px-10 flex justify-center">
      <div className="bg-white rounded-[30px] max-w-6xl w-full px-8 sm:px-16 py-16 shadow-2xl border-4 border-[#2959BF]/20">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center text-[#2959BF] mb-12">
          {t("title")}
        </h1>

        <p className="text-lg leading-relaxed mb-8">
          {t("welcome_intro", { appName: <span className="font-bold text-[#2959BF]">Samga</span> })}
        </p>

        {[
          {
            titleKey: "section1_title",
            textKey: "section1_text",
          },
          {
            titleKey: "section2_title",
            textKey: "section2_text",
          },
          {
            titleKey: "section3_title",
            textKey: "section3_text",
          },
          {
            titleKey: "section4_title",
            textKey: "section4_text",
          },
          {
            titleKey: "section5_title",
            textKey: "section5_text",
          },
          {
            titleKey: "section6_title",
            textKey: "section6_text",
          },
          {
            titleKey: "section7_title",
            textKey: "section7_text",
          },
          {
            titleKey: "section8_title",
            textKey: "section8_text",
          },
          {
            titleKey: "section9_title",
            textKey: "section9_text",
          },
          {
            titleKey: "section10_title",
            textKey: "section10_text",
            isContactUs: true
          },
        ].map((section, idx) => (
          <section key={idx} className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2959BF] mb-3">
              {t(section.titleKey)}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[#333]">
              {section.isContactUs ? (
                <>
                  {t.rich("section10_text", {
                    email: (chunks) => (
                      <a
                        href="mailto:support@samga.com"
                        className="text-[#2959BF] underline font-semibold"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </>
              ) : (
                t(section.textKey)
              )}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}