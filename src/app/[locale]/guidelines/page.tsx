"use client";
import Image from "next/image";

import { useState } from "react";
import { useTranslations } from 'next-intl';


export default function GuidelinesPage() {
   const t = useTranslations('GuidelinesPage');
  const [activeTab, setActiveTab] = useState("play");

  return (
    <div className="min-h-screen bg-[#FFF5E1] flex flex-col text-[#694800]">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold ">{t('title')}</h1>
          <h4 className=" mt-7 font-bold text-xl whitespace-pre-line">
           {t('lead-paragraph')}
          </h4>

          <div className="mt-6 flex space-x-6 border-b-8 border-[#E8DEF8]  pb-2 text-lg font-bold">
            <button
              className={`font-semibold pb-2 ${
                activeTab === "play" ? " border-b-2 " : "text-yellow-800"
              }`}
              onClick={() => setActiveTab("play")}
            >
              {t('play-setup')}
            </button>
            <button
              className={`font-semibold pb-2 ${
                activeTab === "faq" ? " border-b-2 " : "text-yellow-800"
              }`}
              onClick={() => setActiveTab("faq")}
            >
              {t('faq')}
            </button>
          </div>

          {activeTab === "play" && (
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-4 shadow-md rounded-lg grid grid-cols-2">
                <div className="flex flex-col items-center ">
                  <Image
                    src="/guidelines/laptop.png"
                    alt="Laptop"
                    width={120}
                    height={120}
                    className="w-30 h-30 object-contain"
                  />
                  <Image
                    src="/guidelines/router.png"
                    alt="Router"
                    width={104}
                    height={104}
                    className="w-26 h-26 object-contain"
                  />
                  <Image
                    src="/guidelines/camera.png"
                    alt="Camera"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="">
                  <h2 className="text-xl font-bold flex items-center whitespace-pre-line">
                    <span className="text-[#2959bf] font-bold border-3 border-[#2959bf] rounded-full w-6 h-6 flex items-center justify-center mr-3  mb-20">
                      1
                    </span>
                    {t('rule1')}
                  </h2>
                  <p className="text-neutral-950 mt-2 font-semibold ml-9 whitespace-pre-line">
                   {t('rule1-paragraph')}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 shadow-md rounded-lg grid grid-cols-2 ">
                <div className="mt-4">
                  <Image
                    src="/guidelines/webcam_placement.png"
                    alt="Webcam Placement"
                    width={320}
                    height={200}
                    className="w-80 h-50 object-contain rounded-lg  items-center"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold flex items-center whitespace-pre-line">
                    <span className="text-[#2959bf] font-bold border-3 border-[#2959bf] rounded-full w-6 h-6 flex items-center justify-center mr-3 mb-20">
                      2
                    </span>
                   {t('rule2')}
                  </h2>
                  <p className="text-neutral-950 mt-2 font-semibold ml-9 whitespace-pre-line">
                  {t('rule2-paragraph')}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 shadow-md rounded-lg md:col-span-2  whitespace-pre-line">
                <h2 className="text-lg font-semibold flex items-center space-x-2">
                  <span className="text-[#2959bf] font-bold border-3 border-[#2959bf] rounded-full w-6 h-6 flex items-center justify-center mr-3 ml-3">
                    3
                  </span>
                  {t('rule3')}
                </h2>

                <div className="grid md:grid-cols-3 gap-3 mt-2 mb-6">
                  <div>
                    <Image
                      src="/guidelines/battery_level.png"
                      alt="Battery"
                      width={212}
                      height={104}
                      className="mt-2 w-53 h-26"
                    />
                    <p className="ml-5 text-[15px] font-semibold text-neutral-950  whitespace-pre-line">
                     {t('rule3-paragraph')}
                    </p>
                  </div>
                  <div>
                    <Image
                      src="/guidelines/bright-light.png"
                      alt="Bright Light"
                      width={212}
                      height={104}
                      className="mt-2 w-53 h-26"
                    />
                    <p className="ml-5 text-[15px] font-semibold text-neutral-950 whitespace-pre-line">
                      {t('rule3-parapgraph2')}
                    </p>
                  </div>
                  <div>
                    <Image
                      src="/guidelines/bad_bg.png"
                      alt="Bad background"
                      width={212}
                      height={104}
                      className="mt-2 w-53 h-26"
                    />
                    <p className="ml-5 text-[15px] font-semibold text-neutral-950 whitespace-pre-line">
                    {t('rule3-paragraph3')}
                    </p>
                  </div>
                  <div>
                    <Image
                      src="/guidelines/colorful_bg.png"
                      alt="Colorful Background"
                      width={212}
                      height={104}
                      className="mt-2 w-53 h-26"
                    />
                    <p className="ml-5 text-[15px] font-semibold text-neutral-950 whitespace-pre-line">
                     {t('rule3-paragraph4')}
                    </p>
                  </div>
                  <div>
                    <Image
                      src="/guidelines/good_bg.png"
                      alt="Good background"
                      width={200}
                      height={100}
                      className="mt-2 w-50 h-25"
                    />
                    <p className="ml-5 text-[15px] font-semibold text-neutral-950 whitespace-pre-line">
                     {t('rule3-paragraph5')}
                    </p>
                  </div>
                  <div>
                    <Image
                      src="/guidelines/bad_bg.png"
                      alt="Clothing Restrictions"
                      width={212}
                      height={104}
                      className="mt-2 w-53 h-26"
                    />
                    <p className="ml-5 text-[15px] font-semibold text-neutral-950 whitespace-pre-line">
                    {t('rule3-paragraph6')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold">{t('title2')}</h3>
              <ul className="mt-2 space-y-2 ">
                <li>
                  <strong>{t('question_letter')}:</strong> {t('question1')}<br />{" "}
                  <strong>{t('answer_letter')}:</strong> {t('answer1')}
                </li>
                <li>
                  <strong>{t('question_letter')}:</strong> {t('question2')}<br />{" "}
                  <strong>{t('answer_letter')}:</strong> {t('answer2')}
                </li>
                <li>
                  <strong>{t('question_letter')}:</strong>{t('question3')}<br />{" "}
                  <strong>{t('answer_letter')}</strong> {t('answer3')}
                </li>
                <li>
                  <strong>{t('question_letter')}:</strong>{t('question1')} {" "}
                  <br /> <strong>{t('answer_letter')}:</strong> {t('answer1')}
                </li>
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
