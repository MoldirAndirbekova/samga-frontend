"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl"; 



const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Footer() {
  const t = useTranslations("Footer"); 
  const [email, setEmail] = useState("");        
  const [submitted, setSubmitted] = useState(false); 
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/lottie/butterfly.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));

    const handleScroll = () => {
      document.querySelectorAll<HTMLElement>('.parallax-cloud').forEach((el, i) => {
        const offset = window.scrollY;
        el.style.transform = `translateY(${offset * (0.1 + i * 0.05)}px)`; 
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer id ='footer' className="relative bg-[#3894FB] pt-48 pb-20 px-8 overflow-hidden text-white">

      <div className="absolute top-0 left-0 w-full z-10">
        <svg viewBox="0 0 1440 320" className="w-full h-[120px]" preserveAspectRatio="none">
          <path fill="#ffffff" d="M0,160 C360,320 1080,0 1440,160 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="parallax-cloud absolute w-[200px] h-[80px] bg-white opacity-40 rounded-full top-[120px] left-[5%] blur-xl z-10" />
      <div className="parallax-cloud absolute w-[350px] h-[120px] bg-white opacity-20 rounded-full top-[100px] left-[25%] blur-2xl z-10" />
      <div className="parallax-cloud absolute w-[300px] h-[100px] bg-white opacity-30 rounded-full top-[80px] left-[50%] blur-xl z-10" />

      {animationData && (
        <>
          <Lottie animationData={animationData} loop className="absolute w-64 h-64 right-[900px] top-[100px] animate-fly-left z-20 scale-x-[-1]" />
          <Lottie animationData={animationData} loop className="absolute w-64 h-64 right-[-120px] top-[140px] animate-fly-left z-20 scale-x-[-1]" />
        </>
      )}

      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-[#FFA400] text-white text-4xl sm:text-5xl font-bold px-8 py-4 rounded-xl shadow-xl rotate-[-2deg] animate-bounce-slow">
          {t("itsSamgaTime")}
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 relative z-20 mt-24">
        
        <div className="flex flex-col gap-6 max-w-xs">
        <Link href={"/"}>
        <Image
            src="/svg/logo_white.svg"
            alt="Samga logo"
            width={240}
            height={60}
            className="w-auto h-[100px] object-contain"
          />
        </Link>
          <p className="text-lg leading-relaxed text-white/90">
            {t("inclusivePlatform")}
          </p>
          <div className="flex gap-3 text-xl mt-3">
            {["instagram", "youtube", "twitter", "linkedin", "facebook"].map((name, i) => (
              <Image
                key={i}
                src={`/icons/${name}_icon.png`}
                alt={name}
                width={32}
                height={32}
                className="h-8 w-8 hover:scale-110 transition-transform duration-300"
              />
            ))}
          </div>
        </div>

<div className="text-lg"> 
  <h3 className="text-white font-bold mb-3 text-xl">{t("quickLinks")}</h3>
  <ul className="space-y-2 text-white/90">
    <li className="hover:underline cursor-pointer">
      <Link href="/#top">{t("home")}</Link>
    </li>
    <li className="hover:underline cursor-pointer">
      <Link href="/#whyus">{t("aboutUs")}</Link>
    </li>
    <li className="hover:underline cursor-pointer">
      <Link href="/#reviews">{t("reviews")}</Link>
    </li>
    <li className="hover:underline cursor-pointer">
      <Link href="/#footer">{t("contactUs")}</Link>
    </li>
    <li className="hover:underline cursor-pointer">
      <Link href="/terms">{t("terms")}</Link>
    </li>
  </ul>
</div>

        <div className="text-lg">
          <h3 className="text-white font-bold mb-3 text-xl">{t("skillsWeDevelop")}</h3>
          <ul className="space-y-2 text-white/90">
            <li>
              <Link href="/skills/cognitive" className="hover:underline">
                {t("cognitiveSkills")}
              </Link>
            </li>
            <li>
              <Link href="/skills/motoric" className="hover:underline">
                {t("motorSkills")}
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white text-[#2F63D3] rounded-3xl px-6 py-6 w-[320px] shadow-2xl transition-transform hover:scale-105">
  <h2 className="text-lg font-bold mb-3">{t("haveQuestions")}</h2>
  
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder={t("enterEmail")}
    className="w-full rounded px-3 py-2 text-black bg-[#F0F0F0] mb-3 outline-none focus:ring-2 focus:ring-[#2F63D3]"
  />

  <button
    onClick={() => {
      if (!email.includes("@")) {
        alert("Please enter a valid email.");
        return;
      }
      console.log("Email submitted:", email);
      setEmail("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    }}
    className="w-full py-2 bg-[#2F63D3] text-white font-bold rounded hover:bg-[#1e4db6] transition mb-2"
  >
    {submitted ? t("submitted") : t("submit")}
  </button>

  <p className="text-sm font-semibold">{t("weWillContact")}</p>
</div>

      </div>
    </footer>
  );
}
