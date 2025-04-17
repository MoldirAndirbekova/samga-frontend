"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Footer() {
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
    <footer className="relative bg-gradient-to-b from-[#8DD7FF] to-[#B5EDFF] pt-48 pb-20 px-8 overflow-hidden text-white">
      {/* Cloud top wave */}
      <div className="absolute top-0 left-0 w-full z-10">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-[120px]"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            d="M0,160 C360,320 1080,0 1440,160 L1440,0 L0,0 Z"
          />
        </svg>
      </div>

      {/* Parallax clouds */}
      <div className="parallax-cloud absolute w-[200px] h-[80px] bg-white opacity-40 rounded-full top-[120px] left-[5%] blur-xl z-10" />
      <div className="parallax-cloud absolute w-[350px] h-[120px] bg-white opacity-20 rounded-full top-[100px] left-[25%] blur-2xl z-10" />
      <div className="parallax-cloud absolute w-[300px] h-[100px] bg-white opacity-30 rounded-full top-[80px] left-[50%] blur-xl z-10" />

      {/* Animated Lottie Butterflies */}
      {animationData && (
        <>
          {/* Left to right butterfly (starts from left, goes right) */}
          <Lottie
            animationData={animationData}
            loop
            className="absolute w-64 h-64 right-[900px] top-[100px] animate-fly-left z-20 scale-x-[-1]"
          />

          {/* Right to left butterfly (starts from right, goes left and mirrored) */}
          <Lottie
            animationData={animationData}
            loop
            className="absolute w-64 h-64 right-[-120px] top-[140px] animate-fly-left z-20 scale-x-[-1]"
          />
        </>
      )}

      {/* Banner */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-[#FFA400] text-white text-4xl sm:text-5xl font-bold px-8 py-4 rounded-xl shadow-xl rotate-[-2deg] animate-bounce-slow">
          IT'S SAMGA TIME!
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 relative z-20 mt-24">
        {/* Logo & Social */}
        <div className="flex flex-col gap-6 max-w-xs">
          <Image
            src="/icons/samga_blue.png"
            alt="Samga logo"
            width={100}
            height={30}
            className="h-20 w-70"
          />
          <p className="text-lg leading-relaxed text-white/90">
            Inclusive platform that helps kids with motor and cognitive disabilities.
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

        {/* Quick Links */}
        <div className="text-lg">
          <h3 className="text-white font-bold mb-3 text-xl">QUICK LINKS</h3>
          <ul className="space-y-2 text-white/90">
            <li className="hover:underline cursor-pointer">Home</li>
            <li className="hover:underline cursor-pointer">About Us</li>
            <li className="hover:underline cursor-pointer">Reviews</li>
            <li className="hover:underline cursor-pointer">Contact Us</li>
            <li className="hover:underline cursor-pointer">Terms and Conditions</li>
          </ul>
        </div>

        {/* Skills */}
        <div className="text-lg">
          <h3 className="text-white font-bold mb-3 text-xl">SKILLS WE DEVELOP</h3>
          <ul className="space-y-2 text-white/90">
            <li>
              <Link href="/skills/cognitive" className="hover:underline">
                Cognitive skills
              </Link>
            </li>
            <li>
              <Link href="/skills/motoric" className="hover:underline">
                Motor skills
              </Link>
            </li>
          </ul>
        </div>

        {/* Email Box */}
        <div className="bg-white text-[#2F63D3] rounded-3xl px-6 py-6 w-[320px] shadow-2xl transition-transform hover:scale-105">
          <h2 className="text-lg font-bold mb-3">
            DO YOU HAVE QUESTIONS OR SUGGESTIONS?
          </h2>
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full rounded px-3 py-2 text-black bg-[#F0F0F0] mb-3 outline-none focus:ring-2 focus:ring-[#2F63D3]"
          />
          <p className="text-sm font-semibold">We will contact you!</p>
        </div>
      </div>
    </footer>
  );
}
