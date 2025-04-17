"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Marquee from "react-fast-marquee";
import { Nerko_One } from "next/font/google";
const nerkoOne = Nerko_One({ subsets: ["latin"], weight: "400" });

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Home() {
  const [textVisible, setTextVisible] = useState(false);
  const [subTextVisible, setSubTextVisible] = useState(false);
  const [butterflyAnim, setButterflyAnim] = useState(null);
  const [sunAnim, setSunAnim] = useState(null);
  const [visibleFeatures, setVisibleFeatures] = useState(0);
  const [visibleWhyUs, setVisibleWhyUs] = useState(0);
  const marqueeRef = useRef(null);
  const featureRefs = useRef([]);
  const whyUsRefs = useRef([]);


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
  useEffect(() => {
    const onScroll = () => {
      featureRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.85) {
          setVisibleFeatures((prev) => Math.max(prev, i + 1));
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      whyUsRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.85) {
          setVisibleWhyUs((prev) => Math.max(prev, i + 1));
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const whyUs = [
    {
      title: "💡 Engaging Games",
      text: "Research-backed activities designed to keep kids excited.",
    },
    {
      title: "📈 Adaptive Challenges",
      text: "Exercises scale with the child's learning curve.",
    },
    {
      title: "🛡️ Safe Digital Space",
      text: "Privacy-focused, calming, and child-friendly interface.",
    },
    {
      title: "🤝 Expert Collaboration",
      text: "Built with therapists, educators, and parents.",
    },
  ];
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
  const features = [
    {
      title: "Play & Explore",
      text: "From math and literacy to science and empathy, our games engage your child's intellect and emotional intelligence in a fun and interactive way.",
      image: "/feature_play.png",
    },
    {
      title: "Move with Joy",
      text: "Games that get kids moving — physically and mentally. We promote active play that stimulates body and brain.",
      image: "/feature_move.png",
    },
    {
      title: "Learn Together",
      text: "Through playful discovery, children build real-world skills — from memory and focus to collaboration and creativity.",
      image: "/feature_learn.png",
    },
    {
      title: "Grow Confident",
      text: "We encourage confidence and self-expression by giving children autonomy and celebrating every small win.",
      image: "/feature_move.png",
    }
  ];
  const gameImages = [
    "/draw_it.png",
    "/bubble_pop.png",
    "/tennis.png",
    "/friut_slice.png",    
  ];
  const [familyAnim, setFamilyAnim] = useState(null);

useEffect(() => {
  fetch("/lottie/family.json")
    .then(res => res.json())
    .then(setFamilyAnim);
}, []);


  return (
    <>
      <div className="relative w-full min-h-screen bg-[#A2DBF4] overflow-hidden">
        {sunAnim && (
          <Lottie animationData={sunAnim} loop className="absolute top-2 left-4 w-100 h-100 z-10" />
        )}
        <Image src="/svg/cloud1.svg" alt="Cloud 1" width={300} height={150} className="absolute top-72 left-24 opacity-70" />
        <Image src="/svg/cloud1.svg" alt="Cloud 2" width={320} height={160} className="absolute top-16 right-16 opacity-70" />
        <Image src="/svg/cloud2.svg" alt="Cloud 3" width={250} height={120} className="absolute top-5 left-[30%] opacity-50" />
        <Image src="/svg/cloud2.svg" alt="Cloud 4" width={280} height={140} className="absolute top-72 right-[20%] opacity-60" />
        <Image src="/svg/cloud2.svg" alt="Cloud 5" width={220} height={120} className="absolute top-120 left-90 opacity-60" />
        <Image src="/svg/cloud1.svg" alt="Cloud 6" width={240} height={120} className="absolute top-120 right-[10%] opacity-60" />

        {butterflyAnim && (
          <Lottie animationData={butterflyAnim} loop className="absolute bottom-8 right-8 w-64 h-64 z-10" />
        )}

        <div className="relative z-10 pt-48 px-6 text-center flex flex-col items-center">
          <h1 className={`${nerkoOne.className} text-[#6D2FA3] text-6xl sm:text-8xl font-extrabold transition-all duration-700 ease-out ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>WHERE PLAY</h1>
          <h1 className={`${nerkoOne.className} text-[#2959BF] text-6xl sm:text-8xl font-extrabold transition-all duration-700 ease-out delay-300 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>MEETS</h1>
          <h1 className={`${nerkoOne.className} text-[#F49B00] text-6xl sm:text-8xl font-extrabold transition-all duration-700 ease-out delay-500 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>PROGRESS</h1>
          <p className={`mt-6 text-[#3A4F63] text-lg sm:text-xl max-w-xl transition-all duration-700 ease-out delay-700 ${subTextVisible ? "opacity-100" : "opacity-0"}`}>Samga offers a gamified platform with proven exercises and materials to support children with diverse needs.</p>
          <button className={`mt-10 px-6 py-3 bg-[#F49B00] text-white rounded-full text-lg font-semibold hover:bg-[#e78a00] transition-all duration-700 ease-out delay-1000 ${subTextVisible ? "opacity-100" : "opacity-0"}`}>TRY NOW</button>
        </div>
      </div>

      
      <div className="bg-blue-500 py-2">
  <Marquee speed={100} gradient={false}>
    <span className="mx-6 text-white text-xl sm:text-3xl font-bold"> ⭐ ENJOY ⭐ MOVE ⭐ PLAY ⭐ ENJOY ⭐ MOVE ⭐ PLAY ⭐ ENJOY ⭐ MOVE ⭐ PLAY ⭐ ENJOY ⭐ MOVE ⭐ PLAY ⭐ ENJOY ⭐ MOVE ⭐ PLAY</span>
  </Marquee>
</div>

<div className="bg-[#FFF5E1] py-24 px-6 sm:px-10">
        <h2 className="text-4xl sm:text-6xl font-bold text-center text-[#5C3E00] mb-12">WHY US?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {whyUs.map((item, index) => (
            <div
              key={index}
              ref={(el) => (whyUsRefs.current[index] = el)}
              className={`bg-white rounded-3xl p-6 shadow-xl transform transition-all duration-700 ease-out ${
                visibleWhyUs > index ? "opacity-100 scale-100" : "opacity-0 scale-95"
              } flex flex-col items-center text-center gap-4 border-4 border-dashed border-[#FFD966]`}
            >
              <div className="text-4xl">{item.title.split(" ")[0]}</div>
              <h3 className="text-xl font-bold text-[#333]">{item.title.replace(/^\S+\s/, "")}</h3>
              <p className="text-sm text-[#666]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>


      <div className="overflow-hidden w-screen -mx-4">

      <section className="bg-[#FFF6E2] py-16 space-y-12 overflow-x-hidden w-screen">

        {/* Top Marquee */}
        <Marquee speed={60} gradient={false} className="-rotate-2 w-full">
          {gameImages.concat(gameImages).map((src, i) => (
            <div
              key={`top-${i}`}
              className="mx-4 rounded-3xl shadow-2xl overflow-hidden w-[260px] h-[160px] shrink-0"
            >
              <Image
                src={src}
                alt={`Game ${i}`}
                width={260}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </Marquee>

        {/* Bottom Marquee reverse */}
        <Marquee speed={60} gradient={false} direction="right" className="-rotate-2 w-full">
          {gameImages.concat(gameImages).map((src, i) => (
            <div
              key={`bottom-${i}`}
              className="mx-4 rounded-3xl shadow-2xl overflow-hidden w-[260px] h-[160px] shrink-0"
            >
              <Image
                src={src}
                alt={`Game ${i}`}
                width={260}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </Marquee>
      </section>
      </div>

      <div className="bg-[#FFF5E1] py-24 px-6 sm:px-10 space-y-24">
        {features.map((feature, index) => (
          <div
            key={index}
            ref={(el) => (featureRefs.current[index] = el)}
            className={`flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto opacity-0 transform transition-all duration-1000 ease-out ${
              visibleFeatures > index
                ? index % 2 === 0
                  ? "opacity-100 translate-x-0 animate-slide-left"
                  : "opacity-100 translate-x-0 animate-slide-right"
                : "translate-y-12"
            }`}
          >
            {index % 2 === 0 ? (
              <>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={300}
                  height={300}
                  className="rounded-xl"
                />
                <div className="text-left">
                  <h3 className="text-4xl font-bold text-[#333] mb-4">{feature.title}</h3>
                  <p className="text-xl text-[#444] max-w-xl">{feature.text}</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-left">
                  <h3 className="text-4xl font-bold text-[#333] mb-4">{feature.title}</h3>
                  <p className="text-xl text-[#444] max-w-xl">{feature.text}</p>
                </div>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={300}
                  height={300}
                  className="rounded-xl"
                />
              </>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-purple-500 py-2">
  <Marquee speed={100} gradient={false}>
    <span className="mx-6 text-white text-xl sm:text-3xl font-bold"> ⭐ ENJOY ⭐ MOVE ⭐ PLAY ⭐ ENJOY ⭐ MOVE ⭐ PLAY ⭐ ENJOY ⭐ MOVE ⭐ PLAY ⭐ ENJOY ⭐ MOVE ⭐ PLAY ⭐ ENJOY ⭐ MOVE ⭐ PLAY</span>
  </Marquee>
</div>




<div className="py-20 bg-[#FFF6E2] w-full mb-24">
  <h2 className="text-3xl sm:text-7xl font-bold text-center text-[#694800] mb-2">
    Trusted by families all<br/>
    around the country
  </h2>
  {familyAnim && (
  <div className="flex justify-center">
    <Lottie
      animationData={familyAnim}
      loop
      className="w-full max-w-5xl h-[300px] mb-5"
    />
  </div>
)}

  
  <div className="max-w-7xl mx-auto overflow-hidden ">
    <div
      ref={marqueeRef}
      className="flex gap-6 whitespace-nowrap overflow-hidden w-full"
    >
      {[...reviews, ...reviews].map((review, index) => (
        <div
          key={index}
          className={`${review.color} rounded-2xl min-w-[360px] sm:min-w-[420px] w-[420px] flex-shrink-0 p-6 shadow-lg text-black flex flex-col justify-between whitespace-normal break-words`}
        >
          <div className="text-3xl text-white mb-4">“</div>
          <div className="text-lg sm:text-xl font-semibold">{review.text}</div>
          <div className="mt-6 font-bold text-black">{review.author}</div>
          <div className="mt-2 text-yellow-500 text-lg">★★★★★</div>
        </div>
      ))}
    </div>
  </div>
</div>


    </>
  );
}
