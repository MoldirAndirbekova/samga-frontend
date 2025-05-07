"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Globe, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, usePathname, Locale } from "@/i18n/routing";

const disabilities = [
  {
    titleKey: "adhd_title",
    descriptionComponent: (t) => (
      <div className="space-y-4 bg-[#F5C400] p-6 rounded-none">
        <div className="flex justify-center">
          <Image
            src="/ADHD.png"
            alt={t("adhd_title")}
            width={800}
            height={300}
            className="rounded-none"
          />
        </div>
        <p className="text-black">{t("adhd_intro_text")}</p>
        <h3 className="font-bold text-lg text-black">{t("adhd_what")}</h3>
        <p className="text-black">{t("adhd_text")}</p>
        <h3 className="font-bold text-lg text-black">{t("adhd_symptoms")}</h3>
        <ul className="list-disc list-inside text-black">
          <li>{t("adhd_symptom_1")}</li>
          <li>{t("adhd_symptom_2")}</li>
          <li>{t("adhd_symptom_3")}</li>
          <li>{t("adhd_symptom_4")}</li>
          <li>{t("adhd_symptom_5")}</li>
          <li>{t("adhd_symptom_6")}</li>
          <li>{t("adhd_symptom_7")}</li>
          <li>{t("adhd_symptom_8")}</li>
          <li>{t("adhd_symptom_9")}</li>
          <li>{t("adhd_symptom_10")}</li>
        </ul>
      </div>
    ),
    color: "#F5C400"
  },
  {
    titleKey: "asd_title",
    descriptionComponent: (t) => (
      <div className="space-y-4 bg-[#4A90F6] p-6 rounded-none text-black">
        <div className="flex justify-center">
          <Image
            src="/ADHD.png"
            alt={t("asd_title")}
            width={800}
            height={300}
            className="rounded-none"
          />
        </div>
        <h3 className="font-bold text-lg">{t("asd_intro")}</h3>
        <p>{t("asd_intro_text_1")}</p>
        <p>{t("asd_intro_text_2")}</p>
        <h3 className="font-bold text-lg">{t("asd_support_title")}</h3>
        <p>{t("asd_support_text")}</p>
        <h3 className="font-bold text-lg">{t("asd_social_skills_title")}</h3>
        <p>{t("asd_social_skills_text")}</p>
        <h3 className="font-bold text-lg">{t("asd_teen_therapy_title")}</h3>
        <p>{t("asd_teen_therapy_text")}</p>
        <h3 className="font-bold text-lg">{t("asd_skills_developed_title")}</h3>
        <ul className="list-disc list-inside">
          <li>{t("asd_skill_1")}</li>
          <li>{t("asd_skill_2")}</li>
          <li>{t("asd_skill_3")}</li>
          <li>{t("asd_skill_4")}</li>
          <li>{t("asd_skill_5")}</li>
          <li>{t("asd_skill_6")}</li>
        </ul>
        <h3 className="font-bold text-lg">{t("asd_games_title")}</h3>
        <p>{t("asd_games_text")}</p>
      </div>
    ),
    color: "#4A90F6"
  },  
  {
    titleKey: "down_title",
    descriptionComponent: (t) => (
      <div className="space-y-4 bg-[#FF6B6B] p-6 rounded-none text-black">
        <div className="flex justify-center">
          <Image
            src="/ADHD.png" // You can replace this with a dedicated image for Down Syndrome if desired
            alt={t("down_title")}
            width={800}
            height={300}
            className="rounded-none"
          />
        </div>
        <h3 className="font-bold text-lg">{t("down_intro_title")}</h3>
        <p>{t("down_intro_text_1")}</p>
        <p>{t("down_intro_text_2")}</p>
  
        <h3 className="font-bold text-lg">{t("down_support_title")}</h3>
        <p>{t("down_support_text_1")}</p>
        <p>{t("down_support_text_2")}</p>
  
        <h3 className="font-bold text-lg">{t("down_skills_title")}</h3>
        <ul className="list-disc list-inside">
          <li>{t("down_skill_1")}</li>
          <li>{t("down_skill_2")}</li>
          <li>{t("down_skill_3")}</li>
          <li>{t("down_skill_4")}</li>
        </ul>
      </div>
    ),
    color: "#FF6B6B"
  },
  {
    titleKey: "dcd_title",
    descriptionComponent: (t) => (
      <div className="space-y-4 bg-[#6BCB77] p-6 rounded-none text-black">
        <h3 className="font-bold text-lg">{t("dcd_intro_title")}</h3>
        <p>{t("dcd_intro_text_1")}</p>
        <p>{t("dcd_intro_text_2")}</p>
        <h3 className="font-bold text-lg">{t("dcd_support_title")}</h3>
        <p>{t("dcd_support_text")}</p>
        <h3 className="font-bold text-lg">{t("dcd_skills_title")}</h3>
        <ul className="list-disc list-inside">
          <li>{t("dcd_skill_1")}</li>
          <li>{t("dcd_skill_2")}</li>
          <li>{t("dcd_skill_3")}</li>
          <li>{t("dcd_skill_4")}</li>
          <li>{t("dcd_skill_5")}</li>
        </ul>
      </div>
    ),
    color: "#6BCB77"
  },
  {
    titleKey: "cp_title",
    descriptionComponent: (t) => (
      <div className="space-y-4 bg-[#FFA600] p-6 rounded-none text-black">
        <h3 className="font-bold text-lg">{t("cp_intro_title")}</h3>
        <p>{t("cp_intro_text")}</p>
        <h3 className="font-bold text-lg">{t("cp_support_title")}</h3>
        <p>{t("cp_support_text")}</p>
        <h3 className="font-bold text-lg">{t("cp_skills_title")}</h3>
        <ul className="list-disc list-inside">
          <li>{t("cp_skill_1")}</li>
          <li>{t("cp_skill_2")}</li>
          <li>{t("cp_skill_3")}</li>
          <li>{t("cp_skill_4")}</li>
          <li>{t("cp_skill_5")}</li>
        </ul>
      </div>
    ),
    color: "#FFA600"
  },
  {
    titleKey: "ece_title",
    descriptionComponent: (t) => (
      <div className="space-y-4 bg-[#9B51E0] p-6 rounded-none text-black">
        <h3 className="font-bold text-lg">{t("ece_intro_title")}</h3>
        <p>{t("ece_intro_text")}</p>
        <h3 className="font-bold text-lg">{t("ece_definition_title")}</h3>
        <p>{t("ece_definition_text")}</p>
        <h3 className="font-bold text-lg">{t("ece_importance_title")}</h3>
        <p>{t("ece_importance_text")}</p>
        <h3 className="font-bold text-lg">{t("ece_benefits_title")}</h3>
        <ul className="list-disc list-inside">
          <li>{t("ece_benefit_1")}</li>
          <li>{t("ece_benefit_2")}</li>
          <li>{t("ece_benefit_3")}</li>
          <li>{t("ece_benefit_4")}</li>
        </ul>
      </div>
    ),
    color: "#9B51E0"
  }
];

export default function WhoWeHelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations("WhoWeHelp");
  
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
    <main className="min-h-screen bg-[#FFF6E2]">
      {/* Intro rectangle */}
      
      <section className="w-full flex flex-col items-center px-4 py-16">
        <div className="bg-[#2959BF] rounded-[25px] max-w-7xl w-full px-6 sm:px-12 py-14 shadow-2xl">
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white text-center drop-shadow-lg mb-16">
            {t("page_title")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-white text-center items-stretch">
            
            {/* Card 1 */}
            <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
              <Image src="/svg/brain.svg" alt="Neurodivergent" width={64} height={64} className="mb-5" />
              <h3 className="text-xl font-bold mb-3">{t("card_neurodivergent_title")}</h3>
              <p className="text-sm leading-relaxed">
                {t("card_neurodivergent_text")}
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
              <Image src="/svg/growth.svg" alt="Early Learners" width={64} height={64} className="mb-5" />
              <h3 className="text-xl font-bold mb-3">{t("card_earlylearners_title")}</h3>
              <p className="text-sm leading-relaxed">
                {t("card_earlylearners_text")}
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
              <Image src="/svg/support.svg" alt="Parents & Therapists" width={64} height={64} className="mb-5" />
              <h3 className="text-xl font-bold mb-3">{t("card_parents_title")}</h3>
              <p className="text-sm leading-relaxed">
                {t("card_parents_text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="rounded-xl overflow-hidden shadow-xl">
          {disabilities.map((item, index) => (
            <div key={index}>
              <button
                className="w-full flex justify-between items-center px-6 py-5 font-extrabold text-xl sm:text-2xl text-black"
                style={{
                  backgroundColor: item.color,
                  borderTopLeftRadius: index === 0 ? "12px" : "0",
                  borderTopRightRadius: index === 0 ? "12px" : "0",
                  borderBottomLeftRadius:
                    index === disabilities.length - 1 && openIndex !== index ? "12px" : "0",
                  borderBottomRightRadius:
                    index === disabilities.length - 1 && openIndex !== index ? "12px" : "0"
                }}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{t(item.titleKey)}</span>
                <span className="text-7xl">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="px-0 py-0 text-[#444] text-base sm:text-lg leading-relaxed">
                  {item.descriptionComponent(t)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}