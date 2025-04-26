"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MotoricSkills() {
  const t = useTranslations("MotoricSkills");

  return (
    <div className="flex flex-col items-center bg-[#FFF5E1] min-h-screen px-4 py-10">
      <div className="w-full max-w-6xl flex flex-col gap-10">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[#F7BFC8] rounded-2xl shadow-md p-6 sm:p-12 min-h-[300px] flex flex-col justify-center relative overflow-hidden"
        >
          <div className="absolute top-6 right-6 text-blue-600 opacity-20 sm:opacity-30">
            <Activity size={100} />
          </div>

          <h3 className="text-sm sm:text-base font-semibold mb-4 sm:mb-6 text-black z-10">
            {t("heading")}
          </h3>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-600 mb-2 z-10 relative">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent drop-shadow">
              {t("main_title")}
            </span>
          </h2>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-blue-600 z-10 relative">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow">
              {t("subtitle")}
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-white p-6 sm:p-10 rounded-2xl shadow-md text-base leading-7 text-[#1e1e1e]"
        >
          <h3 className="text-lg font-bold mb-3">{t("section1.title")}</h3>
          <p className="mb-4">{t("section1.text")}</p>

          <h3 className="text-lg font-bold mb-3">{t("section2.title")}</h3>
          <p className="mb-4">{t("section2.text")}</p>

          <h3 className="text-lg font-bold mb-3">{t("section3.title")}</h3>
          <ul className="list-disc ml-6 space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i}>
                <strong>{t(`skills.skill${i}.title`)}:</strong>{" "}
                {t(`skills.skill${i}.text`)}
              </li>
            ))}
          </ul>

          <p className="mt-4">{t("conclusion")}</p>
        </motion.div>
      </div>
    </div>
  );
}
