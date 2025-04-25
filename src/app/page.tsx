"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Marquee from "react-fast-marquee";
import { Nerko_One } from "next/font/google";
import Link from "next/link";
import { Globe, ChevronDown } from "lucide-react";

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
  const [playAnim, setPlayAnim] = useState(null);
  const [moveAnim, setMoveAnim] = useState(null);
  const [learnAnim, setLearnAnim] = useState(null);
  const [growAnim, setGrowAnim] = useState(null);
  const [arrowAnim, setArrowAnim] = useState(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  




useEffect(() => {
  fetch("/lottie/arrow.json")
    .then(res => res.json())
    .then(setArrowAnim);
}, []); 
  

useEffect(() => {
  fetch("/lottie/play.json").then(res => res.json()).then(setPlayAnim);
  fetch("/lottie/move.json").then(res => res.json()).then(setMoveAnim);
  fetch("/lottie/learn.json").then(res => res.json()).then(setLearnAnim);
  fetch("/lottie/grow.json").then(res => res.json()).then(setGrowAnim);
}, []);


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
      text: "From math and literacy to science and empathy, our games spark curiosity and engage your child's intellect and emotional intelligence. Each game is designed to turn learning into an adventure — fun, meaningful, and full of discovery.",
    },
    {
      title: "Move with Joy",
      text: "We believe in the power of movement — not just for fitness, but for learning too. Our games get kids up and active, blending physical play with cognitive challenges that energize both body and brain.",
    },
    {
      title: "Learn Together",
      text: "Our platform fosters meaningful interactions. Whether it's solving puzzles as a team or sharing creative ideas, kids build essential real-world skills like memory, focus, collaboration, and innovation — all through playful exploration.",
    },
    {
      title: "Grow Confident",
      text: "Confidence grows with every small victory. Our games celebrate effort, creativity, and individuality, empowering children to take the lead, express themselves, and feel proud of what they achieve — no matter how big or small.",
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

const [kidAnim, setKidAnim] = useState(null);

useEffect(() => {
  fetch("/lottie/happy_boy.json")
    .then((res) => res.json())
    .then(setKidAnim);
}, []);
const navItems = [
  { label: "Home", href: "#", active: true },
  { label: "For Parents", href: "#" },
  { label: "For Teachers", href: "#" },
  { label: "About Us", href: "#" },
  { label: "News", href: "#" },
];





  return (
    <>
       <div
      className="relative w-full min-h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: 'url("/background_hero.jpg")', // Ensure image is in /public/images
      }}
    > 
    <div className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4">
  
  <div>
    <Image src="/logo.png" alt="Samga Logo" width={120} height={40} />
  </div>

  
  <ul className="flex gap-16 px-6 py-4 bg-white rounded-full shadow-lg items-center">
  {[
    { label: "About Us", href: "/about" },
    { label: "Who We Help", href: "/who-we-help" },
    { label: "Skills We Develop", href: "/skills" },
    { label: "Contact Us", href: "/contact" },
    { label: "Sign Up", href: "/register" },
    { label: "Log In", href: "/login" },
    ].map((item) => (
      <li key={item.label}>
        <Link
          href={item.href}
          className={` className="text-white font-medium text-lg sm:text-xl hover:underline transition-all ${
            item.active ? "text-[#F49B00]" : "text-black"
          } hover:text-[#F49B00] transition`}
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>

  
  <div className="flex items-center gap-3">
    <button className="bg-black text-white px-5 py-4 rounded-full font-semibold hover:bg-gray-800 transition text-xl">
      Try it for free!
    </button>

    
    <div className="relative">
      <button
        onClick={() => setLanguageOpen(!languageOpen)}
        className="border border-black rounded-full px-3 py-4 text-xl flex items-center gap-1 font-medium text-black hover:bg-black hover:text-white transition"
      >
        <Globe className="w-4 h-4" />
        {selectedLang}
        <ChevronDown className="w-4 h-4" />
      </button>

      {languageOpen && (
        <ul className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-24 z-50">
          {["EN", "RU", "KZ"].map((lang) => (
            <li
              key={lang}
              onClick={() => {
                setSelectedLang(lang);
                setLanguageOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              {lang}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
</div>

    
      <Lottie
        animationData={kidAnim}
        loop
        className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 z-10"
      />

      
      <div className="relative z-20 pt-48 px-6 text-center flex flex-col items-center">
        <h1
          className={`${nerkoOne.className} text-white text-6xl sm:text-8xl font-extrabold transition-all duration-700 ease-out ${
            textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          WHERE PLAY 
        </h1>
        <h1
          className={`${nerkoOne.className} text-white text-6xl sm:text-8xl font-extrabold transition-all duration-700 ease-out delay-300 ${
            textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          MEETS PROGRESS
        </h1>
        <h1
          className={`${nerkoOne.className} text-white text-6xl sm:text-8xl font-extrabold transition-all duration-700 ease-out delay-500 ${
            textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          
        </h1>
        <p
          className={`mt-6 text-white text-lg sm:text-xl max-w-xl transition-all duration-700 ease-out delay-700 ${
            subTextVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Samga offers a gamified platform with proven exercises and materials to support children with diverse needs.
        </p>
        <button
          className={`mt-10 px-6 py-3 bg-white text-[#F49B00] rounded-full text-lg font-semibold hover:bg-gray-200 transition-all duration-700 ease-out delay-1000 ${
            subTextVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          TRY NOW
        </button>
      </div>
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
     
      <section className="w-full">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
    {[
      {
        title: "Discover Samga Games",
        text: "Explore playful activities that nurture learning, emotional growth, and fun at every stage.",
        image: "/games.png",
        icon: "/svg/game_controller.svg",
      },
      {
        title: "Inclusive Play for All",
        text: "Our games adapt to all abilities, supporting every child through joyful, accessible experiences.",
        image: "/child.png",
        icon: "/svg/puzzle.svg",
      },
      {
        title: "Real-Time Progress",
        text: "Track your child’s growth with instant feedback designed for parents, educators, and therapists.",
        image: "/report.png",
        icon: "/svg/bar_graph.svg",
      },
      {
        title: "Samga for Institutions",
        text: "Custom solutions for schools and clinics to integrate inclusive learning with outcomes.",
        image: "/games.png",
        icon: "/svg/building.svg",
      },
    ].map((card, idx) => (
      <div key={idx} className="flex flex-col items-center text-center w-full">
        
        <div className="relative w-full h-[500px]">
          <Image
            src={card.image}
            alt={card.title}
            layout="fill"
            objectFit="cover"
            className="w-full h-full object-cover"
          />
          
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-10">
            <Image src={card.icon} alt="icon" width={80} height={80} />
          </div>
        </div>

        
        <div
          className={`w-full px-6 pt-16 pb-10 ${
            idx % 2 === 0 ? "bg-[#E6EEFF]" : "bg-[#FFFFFF]"
          }`}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-[#000000] mb-4">{card.title}</h3>
          <p className="text-base sm:text-lg text-[#000000] mb-6 leading-relaxed">{card.text}</p>
          <Link href="/product">
  <button className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-6 py-3 text-base rounded-full font-semibold transition">
    Learn More →
  </button>
</Link>
        </div>
      </div>
    ))}
  </div>
</section>



      

      <div className="bg-[#FFF5E1] py-24 px-6 sm:px-10 space-y-14">
      {features.map((feature, index) => (
  <div
    key={index}
    ref={(el) => (featureRefs.current[index] = el)}
    className={`flex flex-col md:flex-row items-center justify-center gap-10 max-w-6xl mx-auto opacity-0 transform transition-all duration-1000 ease-out ${
    visibleFeatures > index
      ? index % 2 === 0
        ? "opacity-100 translate-x-0 animate-slide-left"
        : "opacity-100 translate-x-0 animate-slide-right"
      : "translate-y-12"
    }`}
  >
    {(index % 2 === 0 ? (
      <>
        
        <div className="w-[400px] h-[400px]">
          {index === 0 && playAnim && <Lottie animationData={playAnim} loop />}
          {index === 1 && moveAnim && <Lottie animationData={moveAnim} loop />}
          {index === 2 && learnAnim && <Lottie animationData={learnAnim} loop />}
          {index === 3 && growAnim && <Lottie animationData={growAnim} loop />}
        </div>
        <div className="text-left">
          <h3 className="text-6xl font-bold text-[#333] mb-4">{feature.title}</h3>
          <p className="text-2xl text-[#444] max-w-xl">{feature.text}</p>
        </div>
      </>
    ) : (
      <>
        <div className="text-left">
          <h3 className="text-6xl font-bold text-[#333] mb-4">{feature.title}</h3>
          <p className="text-2xl text-[#444] max-w-xl">{feature.text}</p>
        </div>
        <div className="w-[400px] h-[400px]">
          {index === 0 && playAnim && <Lottie animationData={playAnim} loop />}
          {index === 1 && moveAnim && <Lottie animationData={moveAnim} loop />}
          {index === 2 && learnAnim && <Lottie animationData={learnAnim} loop />}
          {index === 3 && growAnim && <Lottie animationData={growAnim} loop />}
        </div>
      </>
    ))}
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
<section className="bg-[#FFF6E2] py-16 space-y-12 overflow-x-hidden w-screen -rotate-2 -mb-12">
  
  <Marquee speed={60} gradient={false} className="rotate-[4deg]">
    {gameImages.concat(gameImages).map((src, i) => (
      <div
        key={`top-alt-${i}`}
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

  
  <Marquee speed={60} gradient={false} direction="right" className="rotate-[4deg]">
    {gameImages.concat(gameImages).map((src, i) => (
      <div
        key={`bottom-alt-${i}`}
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


      <section className="w-full bg-[#FFF6E2] py-20 px-6 flex justify-center items-center">
  <div className="w-full max-w-7xl bg-[#FDE68A] rounded-3xl shadow-lg border-4 border-[#F59E0B] flex flex-col md:flex-row items-start p-10 gap-8">
    
    <div className="w-full md:w-1/2">
      <h2 className="text-4xl sm:text-5xl font-bold text-[#5C3E00] mb-6 leading-tight">
        HOW CAN <br /> SAMGA HELP YOU?
      </h2>
      <div className="flex justify-end">
  <div className="w-56 h-56">
    <Lottie animationData={arrowAnim} loop autoplay />
  </div>
</div>


    </div>

    
    <div className="w-full md:w-1/2 space-y-6">
      {[
        {
          text: "If you are a parent or educator",
          button: "Start Free Trial Now",
          color: "bg-[#3B82F6] text-white",
        },
        {
          text: "If you are interested in Samga for Institutions",
          button: "Book A Demo Now",
          color: "bg-[#3B82F6] text-white",
        },
        {
          text: "If you wish to help Samga please send an email",
          button: "Email",
          color: "bg-white text-black border border-black",
        },
        {
          text: "If you want to help expand the research",
          button: "Book a meeting now",
          color: "bg-white text-black border border-black",
        },
      ].map((item, idx) => (
        <div key={idx} className="flex justify-between items-center border-b border-[#5C3E00] pb-4">
          <p className="text-md sm:text-lg font-medium text-[#5C3E00] w-2/3">{item.text}</p>
          <button
            className={`ml-4 px-4 py-2 rounded-full font-semibold whitespace-nowrap ${item.color} hover:scale-105 transition`}
          >
            {item.button} →
          </button>
        </div>
      ))}
    </div>
  </div>
</section>


    </>
  );
}
