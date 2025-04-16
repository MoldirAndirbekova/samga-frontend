"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Nerko_One } from "next/font/google";
const nerkoOne = Nerko_One({ subsets: ["latin"], weight: "400" });

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Home() {
  const [textVisible, setTextVisible] = useState(false);
  const [subTextVisible, setSubTextVisible] = useState(false);
  const [butterflyAnim, setButterflyAnim] = useState(null);
  const [sunAnim, setSunAnim] = useState(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const mainTimer = setTimeout(() => setTextVisible(true), 500);
    const subTimer = setTimeout(() => setSubTextVisible(true), 1200);

    const container = marqueeRef.current;
    let scrollAmount = 0;
    const speed = 0.5;
    let paused = false;

    const handleMouseEnter = () => (paused = true);
    const handleMouseLeave = () => (paused = false);

    const scroll = () => {
      if (!paused && container) {
        scrollAmount += speed;
        container.scrollLeft = scrollAmount;
        if (scrollAmount >= container.scrollWidth - container.clientWidth) {
          scrollAmount = 0;
        }
      }
      requestAnimationFrame(scroll);
    };

    container?.addEventListener("mouseenter", handleMouseEnter);
    container?.addEventListener("mouseleave", handleMouseLeave);

    scroll();
    return () => {
      clearTimeout(mainTimer);
      clearTimeout(subTimer);
      container?.removeEventListener("mouseenter", handleMouseEnter);
      container?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    fetch("/lottie/main_butterfly.json")
      .then((res) => res.json())
      .then(setButterflyAnim);
    fetch("/lottie/sun.json")
      .then((res) => res.json())
      .then(setSunAnim);
  }, []);

  const reviews = [
    {
      text: "This platform has been a game-changer for my son. He enjoys every session, and I've seen noticeable improvement in his coordination and attention span. The characters and challenges are delightful!",
      author: "Rayan",
      color: "bg-blue-400",
    },
    {
      text: "So pretty much the better game. It's colorful, intuitive, and my daughter is always asking to play it again. She feels included and empowered — and so do we as parents.",
      author: "Mimoy Qoeh",
      color: "bg-pink-400",
    },
    {
      text: "The best game ever. It allows children with cognitive difficulties to interact, play, and grow. The learning curve is gentle and full of encouragement.",
      author: "Amrita Singh",
      color: "bg-lime-400",
    },
    {
      text: "My two-year-old daughter loves this because she thinks it’s magical. She says she 'learns everything' through games. A fun and educational tool that we now use daily.",
      author: "Melody Wisk",
      color: "bg-orange-400",
    },
    {
      text: "Samga is an amazing project. I’ve personally seen children light up with excitement while using it. The interface is designed with care and heart.",
      author: "Danelia Nauryz",
      color: "bg-purple-400",
    }
  ];

  return (
    <>
      <div className="relative w-full min-h-screen bg-[#A2DBF4] overflow-hidden">
        {sunAnim && (
          <Lottie
            animationData={sunAnim}
            loop
            className="absolute top-2 left-4 w-100 h-100 z-10"
          />
        )}
        <Image src="/svg/cloud1.svg" alt="Cloud 1" width={300} height={150} className="absolute top-72 left-24 opacity-70" />
        <Image src="/svg/cloud1.svg" alt="Cloud 2" width={320} height={160} className="absolute top-16 right-16 opacity-70" />
        <Image src="/svg/cloud2.svg" alt="Cloud 3" width={250} height={120} className="absolute top-5 left-[30%] opacity-50" />
        <Image src="/svg/cloud2.svg" alt="Cloud 4" width={280} height={140} className="absolute top-72 right-[20%] opacity-60" />
        <Image src="/svg/cloud2.svg" alt="Cloud 5" width={220} height={120} className="absolute top-120 left-90 opacity-60" />
        <Image src="/svg/cloud1.svg" alt="Cloud 6" width={240} height={120} className="absolute top-120 right-[10%] opacity-60" />

        {butterflyAnim && (
          <Lottie
            animationData={butterflyAnim}
            loop
            className="absolute bottom-8 right-8 w-64 h-64 z-10"
          />
        )}

        
        <div className="relative z-10 pt-48 px-6 text-center flex flex-col items-center">
          <h1 className={`${nerkoOne.className} text-[#6D2FA3] text-6xl sm:text-8xl font-extrabold transition-all duration-700 ease-out ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            WHERE PLAY
          </h1>
          <h1 className={`${nerkoOne.className} text-[#2959BF] text-6xl sm:text-8xl font-extrabold transition-all duration-700 ease-out delay-300 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            MEETS
          </h1>
          <h1 className={`${nerkoOne.className} text-[#F49B00] text-6xl sm:text-8xl font-extrabold transition-all duration-700 ease-out delay-500 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            PROGRESS
          </h1>
          <p className={`mt-6 text-[#3A4F63] text-lg sm:text-xl max-w-xl transition-all duration-700 ease-out delay-700 ${subTextVisible ? "opacity-100" : "opacity-0"}`}>
            Samga offers a gamified platform with proven exercises and materials to support children with diverse needs.
          </p>
          <button className={`mt-10 px-6 py-3 bg-[#F49B00] text-white rounded-full text-lg font-semibold hover:bg-[#e78a00] transition-all duration-700 ease-out delay-1000 ${subTextVisible ? "opacity-100" : "opacity-0"}`}>
            TRY NOW
          </button>
        </div>
      </div>
      {/* Marquee Section */}
      <div className="relative w-full bg-blue-500 py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-white font-bold text-xl sm:text-3xl">
          <span className="mx-4">ENJOY ⭐ MOVE ⭐ PLAY ⭐ ENJOY ⭐ MOVE ⭐</span>
        </div>
      </div>

      {/* Why Us Section */}
      <div className="flex justify-center bg-[#FFF5E1] py-20 px-6 sm:px-10">
        <div className="bg-[#A97CB5] text-white p-6 sm:p-12 rounded-xl w-full max-w-5xl shadow-lg">
          <h2 className="text-4xl sm:text-6xl font-bold mb-8 text-center">WHY US?</h2>
          <p className="text-lg sm:text-2xl leading-relaxed mb-6">
            Samga is more than just a platform—it's a transformative experience designed to make learning fun, accessible, and meaningful for children with different abilities.
          </p>
          <ul className="text-base sm:text-xl space-y-4 max-w-3xl">
            <li>✅ Engaging, research-backed games tailored for various abilities</li>
            <li>✅ Adaptive challenges that grow with each child's progress</li>
            <li>✅ A vibrant, safe, and supportive digital learning space</li>
            <li>✅ Collaboration with experts in education and accessibility</li>
          </ul>
          <div className="mt-10 flex justify-center">
            <button className="bg-[#FFF6E2] text-[#A97CB5] font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#F9DB63] transition">
              Learn more
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 px-6 sm:px-10 py-16 bg-yellow-400">
        {[
          {
            title: "Access to Inclusive Spectrum Games",
            text: "Our interactive therapy games for children are designed to embrace diversity, ensuring that kids of all abilities can join in the fun.",
          },
          {
            title: "Live Reporting: Real-Time Progress Insights",
            text: "Stay in the know with our real-time progress tracking. Samga keeps you updated on your child's development journey.",
          },
          {
            title: "Discover Games",
            text: "Uncover a world of captivating games that nurture essential developmental skills while making learning an exciting adventure.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex-1 bg-yellow-500 text-black text-center p-6 rounded-lg shadow-lg max-w-sm w-full"
          >
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <p className="mt-4">{item.text}</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
              Learn More
            </button>
          </div>
        ))}
      </div>

      {/* Marquee Again */}
      <div className="relative w-full bg-blue-500 py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-white font-bold text-xl sm:text-3xl">
          <span className="mx-4">ENJOY ⭐ MOVE ⭐ PLAY ⭐ ENJOY ⭐ MOVE ⭐</span>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-20 bg-[#FFF6E2] w-full mb-24">
        <h2 className="text-3xl sm:text-5xl font-bold text-center text-[#694800] mb-12">
          WHAT PEOPLE ARE SAYING ABOUT US?
        </h2>
        <div ref={marqueeRef} className="flex gap-6 whitespace-nowrap overflow-hidden max-w-7xl mx-auto px-4">
          {[...reviews, ...reviews].map((review, index) => (
            <div
              key={index}
              className={`${review.color} rounded-2xl min-w-[360px] sm:min-w-[420px] w-[420px] max-w-[90vw] p-6 shadow-lg text-black flex flex-col justify-between whitespace-normal break-words`}
            >
              <div className="text-3xl text-white mb-4">“</div>
              <div className="text-lg sm:text-xl font-semibold">{review.text}</div>
              <div className="mt-6 font-bold text-black">{review.author}</div>
              <div className="mt-2 text-yellow-500 text-lg">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
