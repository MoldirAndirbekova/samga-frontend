"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Lottie from "lottie-react";
import { useTranslations } from 'next-intl';

export default function ProductPage() {
  const [arrowAnim, setArrowAnim] = useState(null);
  const t = useTranslations('ProductPage');

  useEffect(() => {
    fetch("/lottie/arrow.json")
      .then((res) => res.json())
      .then((data) => setArrowAnim(data));
  }, []);

  const gameImages = [
    "/rockpaper.png",
    "/tennis.png",
    "/bubble-pop.png",
    "/constructor.png",
    "/flappybird.png",
  ];

  return (
    <section className="w-full flex flex-col items-center px-4 py-12">
      <div className="bg-[#8B5CF6] rounded-[25px] max-w-7xl w-full px-6 sm:px-12 py-12">
        <h2 className="text-4xl sm:text-8xl font-extrabold text-white drop-shadow-lg mb-10">
          {t("why_us_title")}
        </h2> 

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white mb-16">
          <div className="flex flex-col items-start">
            <Image src="/svg/hospital.svg" alt="Hospital" width={64} height={64} className="mb-4" />
            <h3 className="text-lg font-bold mb-2">{t("clinically_title")}</h3>
            <p className="text-sm leading-relaxed">{t("clinically_text")}</p>
          </div>

          <div className="flex flex-col items-start">
            <Image src="/svg/handshake.svg" alt="Handshake" width={64} height={64} className="mb-4" />
            <h3 className="text-lg font-bold mb-2">{t("community_title")}</h3>
            <p className="text-sm leading-relaxed">{t("community_text")}</p>
          </div>

          <div className="flex flex-col items-start">
            <Image src="/svg/door.svg" alt="Door" width={64} height={64} className="mb-4" />
            <h3 className="text-lg font-bold mb-2">{t("accessible_title")}</h3>
            <p className="text-sm leading-relaxed">{t("accessible_text")}</p>
          </div>
        </div>

        <div className="flex justify-center items-end flex-wrap px-4 sm:px-0">
          {gameImages.map((src, index) => (
            <div
              key={index}
              className={`relative w-[300px] h-[200px] rounded-[20px] 
              overflow-hidden transform transition-all duration-300 ease-in-out 
              ${index % 2 === 0 ? "-rotate-6" : "rotate-6"} 
              ${index !== 0 ? "-ml-1" : ""} 
              z-${10 + index}
              hover:scale-110 hover:z-50 shadow-[0_20px_40px_rgba(0,0,0,1)]`}
            >
              <Image
                src={src}
                alt={`Game ${index + 1}`}
                width={150}
                height={150}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-7xl mt-24 px-4">
        <AccordionSection />
      </div>

      <div className="w-full bg-[#FFF6E2] py-20 px-6 flex justify-center items-center">
        <div className="w-full max-w-7xl bg-[#FDE68A] rounded-3xl shadow-lg border-4 border-[#F59E0B] flex flex-col md:flex-row items-start p-10 gap-8">
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#5C3E00] mb-6 leading-tight">
              {t("how_help")}
            </h2>
            <div className="flex justify-end">
              <div className="w-56 h-56">
                <Lottie animationData={arrowAnim} loop autoplay />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b border-[#5C3E00] pb-4"
              >
                <p className="text-md sm:text-lg font-medium text-[#5C3E00] w-2/3">
                  {t(`help_text_${idx}`)}
                </p>
                <button
                  className={`ml-4 px-4 py-2 rounded-full font-semibold whitespace-nowrap ${
                    idx < 2
                      ? "bg-[#3B82F6] text-white"
                      : "bg-white text-black border border-black"
                  } hover:scale-105 transition`}
                >
                  {t(`help_button_${idx}`)} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AccordionSection() {
  const [active, setActive] = useState<string | null>(null);
  const t = useTranslations('ProductPage');

  const toggle = (type: string) => {
    setActive(prev => (prev === type ? null : type));
  };

  const sections = [
    {
      title: t("motor_title"),
      color: "bg-[#FACC15]",
      text: t("motor_text"),
      image: "/motor.png",
      skills: [
        t("motor_skill_0"),
        t("motor_skill_1"),
        t("motor_skill_2"),
        t("motor_skill_3"),
        t("motor_skill_4"),
        t("motor_skill_5"),
        t("motor_skill_6"),
      ],
      id: "motor",
    },
    {
      title: t("cognitive_title"),
      color: "bg-[#3B82F6]",
      text: t("cognitive_text"),
      image: "/cognitive.png",
      skills: [
        t("cognitive_skill_0"),
        t("cognitive_skill_1"),
        t("cognitive_skill_2"),
        t("cognitive_skill_3"),
        t("cognitive_skill_4"),
        t("cognitive_skill_5"),
      ],
      id: "cognitive",
    },
  ];

  return (
    <div className="space-y-[-10px] relative z-10">
      {sections.map((section, index) => (
        <div key={section.id} className={`relative z-[${index === 1 ? 50 : 40}]`}>
          <button
            className={`w-full flex justify-between items-center px-6 py-5 text-6xl font-semibold ${section.color} text-black shadow-md rounded-t-xl hover:brightness-105 transition`}
            onClick={() => toggle(section.id)}
          >
            {section.title}
            <span className="text-6xl">{active === section.id ? "−" : "+"}</span>
          </button>

          {active === section.id && (
            <div className={`p-6 flex flex-col lg:flex-row gap-6 ${section.color} rounded-b-xl shadow-xl border-t border-black`}>
              <div className="lg:w-1/2">
                <p className="text-black text-base mb-12 leading-relaxed">{section.text}</p>
                <div className="flex flex-wrap gap-3">
                  {section.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="border-0 border-black rounded-full px-8 py-1 text-lg font-medium text-black bg-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="rounded-xl overflow-hidden border-0 border-black">
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={400}
                    height={400}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
