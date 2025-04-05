"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      text: t('review1'),
      author: "Quralay Quanysh",
      role: "Special Educator"
    },
    {
      text: "This platform has transformed the way children with special needs interact with technology. The accessibility features are thoughtfully designed, making learning enjoyable and effective.",
      author: "Aidar Bek",
      role: "Therapist"
    },
    {
      text: "Samga’s approach to inclusive education is truly inspiring. The adaptive difficulty levels ensure every child can participate and grow at their own pace.",
      author: "Aliya Tulegenova",
      role: "Educator"
    }
  ];

  const handleScroll = (direction: string) => {
    if (direction === "left") {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
    } else {
      setCurrentIndex((prevIndex) => (prevIndex === reviews.length - 1 ? 0 : prevIndex + 1));
    }
  };

  return (
    <>
      <div className="bg-[#FFF6E2] min-h-screen flex flex-col items-center justify-center sm:flex-row sm:justify-between px-6 sm:px-20 py-10 gap-10 font-sans">
          
      <div className="flex flex-col gap-8 text-[#3C2A00] max-w-md">
          
          <div className="text-xl sm:text-8xl font-semibold leading-snug space-y-1">
            <p>Welcome</p>
            <p>to</p>
            <Image
              src="/icons/samga_brown.png"
              alt="Samga Logo"
              width={400}
              height={400}
              priority
            />
          </div>

          
          <div className="flex flex-col gap-4 text-lg sm:text-5xl font-semibold mt-2">
            <div className="flex items-center gap-2 ml-0">
              <span className="text-[#F3C100] text-5xl">▶</span>
              <span className="text-[#5A3E16]">Play</span>
            </div>
            <div className="flex items-center gap-2 ml-30">
              <span className="text-[#845EC2] text-5xl">★</span>
              <span className="text-[#5A3E16]">Enjoy</span>
            </div>
            <div className="flex items-center gap-2 ml-60">
              <span className="text-[#2C73D2] text-5xl">◆</span>
              <span className="text-[#5A3E16]">Move</span>
            </div>
          </div>
        </div>

        
        <div className="border-2 border-[#3C2A00] rounded-2xl overflow-hidden shadow-md max-w-[600px]">
          <Image
            src="/image_kids_illustration.png"
            alt="Kids playing illustration"
            width={600}
            height={600}
            className="object-cover"
          />
        </div>
      </div>

    
      <div className="relative w-full bg-blue-500 py-2 overflow-hidden">
  <div className="animate-marquee text-white font-bold text-3xl">
    <span>ENJOY</span>
    <span>⭐</span>
    <span>MOVE</span>
    <span>⭐</span>
    <span>PLAY</span>
    <span>⭐</span>
    <span>ENJOY</span>
    <span>⭐</span>
    <span>MOVE</span>
    <span>⭐</span>
  </div>
</div>


<div className="flex justify-center bg-[#FFF5E1] py-20 px-6 sm:px-20">
        <div className="bg-[#A97CB5] text-white p-16 rounded-xl max-w-5xl w-full shadow-lg text-left relative">
          <h2 className="text-6xl font-bold mb-8 text-center">WHY US?</h2>
          <p className="text-2xl leading-relaxed mb-6">
            {/* @ts-ignore */}
            Samga is more than just a platform—it's a transformative experience designed to make learning fun, accessible, and meaningful for children with different abilities. Our games are crafted with care to ensure an inclusive, interactive, and development-focused environment where every child can thrive.
          </p>
          <ul className="text-xl space-y-4 max-w-3xl">
            <li>✅ Engaging, research-backed games tailored for various abilities</li>
            <li>✅ Adaptive challenges that grow with each child's progress</li>
            <li>✅ A vibrant, safe, and supportive digital learning space</li>
            <li>✅ Collaboration with experts in education and accessibility</li>
          </ul>
          <div className="mt-10 flex justify-center">
            <button className="bg-[#FFF6E2] text-[#A97CB5] font-bold py-3 px-8 rounded-lg shadow-md hover:bg-[#F9DB63] transition">
              Learn more
            </button>
          </div>
        </div>
      </div>

      
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 px-6 sm:px-20 py-16 bg-yellow-400">
        
        <div className="flex-1 max-w-sm bg-yellow-500 text-black text-center p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">Access to Inclusive Spectrum Games</h2>
          <p className="mt-4">
            Our interactive therapy games for children are designed to embrace diversity,
            ensuring that kids of all abilities can join in the fun. With spectrum-accessible
            games, we're fostering a culture of inclusive learning, where every child can shine.
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Learn More
          </button>
        </div>
        
        
        <div className="flex-1 max-w-sm bg-yellow-300 text-black text-center p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">Live Reporting: Real-Time Progress Insights</h2>
          <p className="mt-4">
            Stay in the know with our real-time progress tracking. Samga keeps you
            updated on your child's development journey, offering valuable insights that
            empower parents, educators, and therapists to make informed decisions.
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Learn More
          </button>
        </div>

        
        <div className="flex-1 max-w-sm bg-yellow-500 text-black text-center p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">Discover Games</h2>
          <p className="mt-4">
            Uncover a world of captivating games that nurture essential developmental skills
            while making learning an exciting adventure. Watch as your child thrives and grows,
            all while having loads of fun.
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            Learn More
          </button>
        </div>
        
      </div>
      <div className="relative w-full bg-blue-500 py-2 overflow-hidden">
  <div className="animate-marquee text-white font-bold text-3xl">
    <span>ENJOY</span>
    <span>⭐</span>
    <span>MOVE</span>
    <span>⭐</span>
    <span>PLAY</span>
    <span>⭐</span>
    <span>ENJOY</span>
    <span>⭐</span>
    <span>MOVE</span>
    <span>⭐</span>
  </div>
</div>


        
        <div className="flex flex-col items-center py-20 bg-[#FFF6E2] px-6 sm:px-20">
  <div className="relative bg-[#F9DB63] p-16 rounded-xl max-w-5xl w-full shadow-lg text-left">
    <h2 className="text-6xl font-bold text-[#694800] text-center mb-8">
      WHAT PEOPLE ARE SAYING ABOUT US?
    </h2>
    <p className="text-2xl text-black leading-relaxed">{reviews[currentIndex].text}</p>
    <p className="mt-6 font-bold text-xl text-black">{reviews[currentIndex].author}</p>
    <p className="text-lg text-black">{reviews[currentIndex].role}</p>

    
    <div className="flex justify-center items-center mt-10 gap-10">
      <button
        onClick={() => handleScroll("left")}
        className="w-12 h-12 border-2 border-[#3C2A00] text-[#3C2A00] rounded-full flex items-center justify-center hover:bg-[#3C2A00] hover:text-white transition"
      >
        ◀
      </button>

      
      <div className="flex gap-3">
        {reviews.map((_, index) => (
          <span
            key={index}
            className={`w-4 h-4 rounded-full ${
              index === currentIndex ? "bg-[#3C2A00]" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>

      <button
        onClick={() => handleScroll("right")}
        className="w-12 h-12 border-2 border-[#3C2A00] text-[#3C2A00] rounded-full flex items-center justify-center hover:bg-[#3C2A00] hover:text-white transition"
      >
        ▶
      </button>
    </div>
  </div>
</div>



     

    </>
    
  );
  
}